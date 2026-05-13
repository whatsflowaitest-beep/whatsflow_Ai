/**
 * AI Hardening Middleware
 *
 * Protects the AI pipeline from:
 *  - Token budget exhaustion (per-tenant daily cap)
 *  - Prompt injection attacks
 *  - Excessive conversation history (memory limits)
 *  - API rate limit cascades
 *  - Runaway costs
 *
 * Usage (in webhook.worker.ts before getAgentResponse):
 *   const safe = await AIGuard.check(tenantId, message, history)
 *   if (!safe.allowed) { ... skip AI ... }
 *   const safeMessage = safe.sanitizedMessage
 */

import { createClient } from '@supabase/supabase-js'
import { logger } from '../utils/logger.js'

// ── Config ────────────────────────────────────────────────────────────────────

const TOKEN_BUDGET_DAILY    = parseInt(process.env.AI_DAILY_TOKEN_BUDGET   ?? '10000', 10)
const MAX_HISTORY_MESSAGES  = parseInt(process.env.AI_MAX_HISTORY          ?? '10',    10)
const MAX_MESSAGE_LENGTH    = parseInt(process.env.AI_MAX_MESSAGE_LENGTH   ?? '2000',  10)

// ── Prompt Injection Patterns ─────────────────────────────────────────────────
// Detect common jailbreak/injection attempts
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /you\s+are\s+now\s+(a\s+)?DAN/i,
  /act\s+as\s+(if\s+you\s+are\s+)?a/i,
  /system\s*:\s*/i,
  /\[INST\]/i,
  /<\|im_start\|>/i,
  /###\s*Instruction/i,
  /disregard\s+(your|all)\s+(previous|prior)/i,
  /pretend\s+(you|that\s+you)\s+(are|have)/i,
]

// ── Token Estimation ──────────────────────────────────────────────────────────
// Rough estimate: 1 token ≈ 4 characters (good enough for budgeting)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

// ── Guard Result ──────────────────────────────────────────────────────────────

export interface AIGuardResult {
  allowed:          boolean
  reason?:          string
  sanitizedMessage: string
  truncatedHistory: { role: 'user' | 'assistant'; content: string }[]
}

// ── Main Guard ────────────────────────────────────────────────────────────────

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export class AIGuard {
  /**
   * Run all AI safety checks before sending to any AI provider.
   */
  static async check(
    tenantId: string,
    message: string,
    history: { role: 'user' | 'assistant'; content: string }[] = []
  ): Promise<AIGuardResult> {
    // 1. Length limit
    const truncatedMsg = message.slice(0, MAX_MESSAGE_LENGTH)

    // 2. Prompt injection detection
    const injectionDetected = INJECTION_PATTERNS.some((p) => p.test(truncatedMsg))
    if (injectionDetected) {
      logger.warn('[AIGuard] Prompt injection attempt detected', {
        tenantId,
        preview: truncatedMsg.slice(0, 100),
      })
      return {
        allowed: false,
        reason: 'prompt_injection',
        sanitizedMessage: truncatedMsg,
        truncatedHistory: [],
      }
    }

    // 3. Daily token budget check
    const todayStart = new Date()
    todayStart.setUTCHours(0, 0, 0, 0)

    const { data: usageRows } = await supabase
      .from('usage_logs')
      .select('quantity')
      .eq('tenant_id', tenantId)
      .eq('resource_type', 'ai_tokens')
      .gte('created_at', todayStart.toISOString())

    const usedToday = (usageRows ?? []).reduce((sum, r) => sum + (r.quantity ?? 0), 0)
    const estimatedCost = estimateTokens(truncatedMsg) + history.slice(-MAX_HISTORY_MESSAGES)
      .reduce((s, h) => s + estimateTokens(h.content), 0)

    if (usedToday + estimatedCost > TOKEN_BUDGET_DAILY) {
      logger.warn('[AIGuard] Token budget exceeded', { tenantId, usedToday, TOKEN_BUDGET_DAILY })
      return {
        allowed: false,
        reason: 'token_budget_exceeded',
        sanitizedMessage: truncatedMsg,
        truncatedHistory: [],
      }
    }

    // 4. Truncate conversation history to prevent context bloat
    const truncatedHistory = history
      .slice(-MAX_HISTORY_MESSAGES)
      .map((h) => ({
        role: h.role,
        content: h.content.slice(0, 1000), // Cap each message too
      }))

    // 5. Log token usage estimate
    await supabase.from('usage_logs').insert({
      tenant_id:     tenantId,
      resource_type: 'ai_tokens',
      quantity:      estimatedCost,
      metadata:      { source: 'ai_guard', estimated: true },
    })

    return {
      allowed: true,
      sanitizedMessage: truncatedMsg,
      truncatedHistory,
    }
  }
}
