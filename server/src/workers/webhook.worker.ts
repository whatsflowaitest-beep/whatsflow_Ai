/**
 * WebhookWorker — Corrected Production Implementation
 *
 * Processes incoming WhatsApp messages from BullMQ.
 *
 * FIXED:
 *  - whatsapp_integrations → whatsapp_accounts
 *  - messages.lead_id → messages.conversation_id
 *  - messages.sender → messages.sender_type
 *  - messages.timestamp → messages.created_at (auto)
 *  - messages.meta_message_id → messages.wa_message_id
 *  - ai_agents.status → ai_agents.is_active (boolean)
 *  - leads.current_flow_id + leads.current_step_index via migration
 *  - flows table → chatbot_flows table
 *  - organization_id → tenant_id everywhere
 *
 * Flow:
 *  1. Validate Meta signature (done in webhook.controller.ts before enqueue)
 *  2. Resolve whatsapp_accounts by phone_number_id → tenant_id
 *  3. Upsert contact by phone
 *  4. Upsert conversation for contact
 *  5. Insert inbound message with correct fields
 *  6. Log to webhook_events for idempotency
 *  7. Check if lead has active flow state → resume flow
 *  8. Match keyword flows
 *  9. Match first_message welcome flow
 *  10. Fall back to AI agent
 *  11. Emit socket.io event for realtime inbox update
 */

import { Worker, Job } from 'bullmq'
import { Redis } from 'ioredis'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { FlowService } from '../services/flow.service.js'
import { AIService } from '../services/ai.service.js'
import { AIGuard } from '../middleware/ai.guard.js'
import { MessageRepository } from '../repositories/message.repository.js'
import { ConversationRepository } from '../repositories/conversation.repository.js'
import { sanitizeMessage } from '../utils/sanitize.js'
import { logger } from '../utils/logger.js'
import { broadcastNewMessage, emitToTenant } from '../lib/realtime.js'
import type { WebhookJobData } from '../services/queue.service.js'
import { QUEUE_NAME } from '../services/queue.service.js'
import type { Lead } from '../types/db.types.js'

dotenv.config()

// ── Shared clients ────────────────────────────────────────────────────────────

const supabase: SupabaseClient = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const connection = new Redis(process.env.REDIS_URL ?? 'redis://127.0.0.1:6379', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  tls: (process.env.REDIS_URL ?? '').startsWith('rediss://') ? {} : undefined,
})

// ── Tenant Resolution ─────────────────────────────────────────────────────────

/**
 * Look up whatsapp_accounts (not the old whatsapp_integrations table)
 * to resolve the tenant for an incoming phone_number_id.
 */
async function resolveTenantId(job: Job<WebhookJobData>): Promise<string | null> {
  if (job.data.tenantId) return job.data.tenantId

  const phoneNumberId = job.data.phoneNumberId
  if (!phoneNumberId) {
    console.warn('[worker] No phoneNumberId in job — cannot resolve tenant')
    return null
  }

  const { data, error } = await supabase
    .from('whatsapp_accounts')          // ← FIXED: was whatsapp_integrations
    .select('tenant_id')
    .eq('phone_number_id', phoneNumberId)
    .eq('status', 'connected')           // ← FIXED: was 'active', DB uses 'connected'
    .maybeSingle()

  if (error) {
    console.error('[worker] whatsapp_accounts lookup error:', error.message)
    return null
  }

  return data?.tenant_id ?? null
}

// ── Webhook Idempotency ───────────────────────────────────────────────────────

/**
 * Log to webhook_events for replay protection.
 * Returns true if this is a NEW event (should process).
 * Returns false if it was already processed (duplicate — skip).
 */
async function logWebhookEvent(messageId: string, payload: unknown): Promise<boolean> {
  const { error } = await supabase.from('webhook_events').insert({
    external_event_id: messageId,
    status: 'pending',
    payload: payload as Record<string, unknown>,
  })

  if (error) {
    // 23505 = unique_violation — duplicate event_id
    if (error.code === '23505') {
      console.log(`[worker] Duplicate webhook event ${messageId} — skipping`)
      return false
    }
    console.error('[worker] webhook_events insert error:', error.message)
  }

  return true
}

async function markWebhookProcessed(messageId: string): Promise<void> {
  await supabase
    .from('webhook_events')
    .update({ status: 'processed' })
    .eq('external_event_id', messageId)
}

async function markWebhookFailed(messageId: string, errorMsg: string): Promise<void> {
  await supabase
    .from('webhook_events')
    .update({ status: 'failed' })
    .eq('external_event_id', messageId)

  console.error(`[worker] Webhook ${messageId} marked failed: ${errorMsg}`)
}

// ── Lead State ────────────────────────────────────────────────────────────────

async function getLeadByContact(tenantId: string, contactId: string): Promise<Lead | null> {
  const { data, error } = await supabase
    .from('leads')
    .select('id, contact_id, stage, status, current_flow_id, current_step_index')
    .eq('tenant_id', tenantId)
    .eq('contact_id', contactId)
    .maybeSingle()

  if (error) {
    console.error('[worker] Lead lookup error:', error.message)
    return null
  }
  return data as Lead | null
}

/**
 * Ensure a lead record exists for a contact.
 * Creates with default stage='New', status='active'.
 */
async function upsertLead(tenantId: string, contactId: string): Promise<Lead | null> {
  const existing = await getLeadByContact(tenantId, contactId)
  if (existing) return existing

  const { data, error } = await supabase
    .from('leads')
    .insert({
      tenant_id: tenantId,
      contact_id: contactId,
      stage: 'New',
      status: 'active',
      lead_value: 0,
      current_flow_id: null,
      current_step_index: 0,
    })
    .select()
    .single()

  if (error) {
    console.error('[worker] Lead insert error:', error.message)
    return null
  }
  return data as Lead
}

// ── AI Agent Fallback ─────────────────────────────────────────────────────────

async function fetchActiveAgent(tenantId: string) {
  const { data, error } = await supabase
    .from('ai_agents')
    .select('id, name, model, instructions, temperature, is_active')
    .eq('tenant_id', tenantId)
    .eq('is_active', true)          // ← FIXED: was .eq('status', 'active')
    .limit(1)
    .maybeSingle()

  if (error) console.error('[worker] ai_agents lookup error:', error.message)
  return data
}

// ── AI Usage Tracking ─────────────────────────────────────────────────────────

async function logAiUsage(tenantId: string): Promise<void> {
  await supabase.from('usage_logs').insert({
    tenant_id: tenantId,
    resource_type: 'ai_tokens',
    quantity: 1,
    metadata: { source: 'webhook_worker' },
  })
}

// ── Auto Pipeline Stage AI Evaluation ────────────────────────────────────────

async function runAutoPipelineStageLogic(
  tenantId: string,
  contactId: string,
  conversationId: string
): Promise<void> {
  try {
    // 1. Check if tenant has AI Auto Pipeline enabled in settings
    const { data: settingsData } = await supabase
      .from('settings')
      .select('config')
      .eq('tenant_id', tenantId)
      .maybeSingle()

    const config = settingsData?.config as Record<string, any> | null
    if (!config?.ai_auto_pipeline) {
      return // Feature disabled
    }

    // 2. Fetch the lead object to know current stage
    const lead = await getLeadByContact(tenantId, contactId)
    if (!lead) return

    // 3. Fetch recent conversation history for context
    const { data: historyMsgs } = await supabase
      .from('messages')
      .select('sender_type, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(15)

    if (!historyMsgs || historyMsgs.length === 0) return

    const formattedHistory = historyMsgs.map((m) => ({
      role: (m.sender_type === 'contact' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: m.content,
    }))

    // 4. Evaluate stage via AI
    const newStage = await AIService.evaluateLeadStage(formattedHistory, lead.stage)

    // 5. Update lead stage if it changed
    if (newStage && newStage !== lead.stage) {
      const { error: updateErr } = await supabase
        .from('leads')
        .update({ stage: newStage, updated_at: new Date().toISOString() })
        .eq('id', lead.id)

      if (updateErr) {
        console.error('[worker] Failed to auto-update lead stage:', updateErr.message)
      } else {
        console.log(`[worker] Lead ${lead.id} stage automatically updated by AI to "${newStage}"`)
        
        try {
          emitToTenant(tenantId, 'lead_updated', { id: lead.id, stage: newStage })
        } catch (realtimeErr) {
          // Ignore realtime failures safely
        }
      }
    }
  } catch (err) {
    console.warn('[worker] runAutoPipelineStageLogic failed safely:', (err as Error).message)
  }
}

// ── Main Job Processor ────────────────────────────────────────────────────────

async function processWebhookJob(job: Job<WebhookJobData>): Promise<void> {
  const { messageId, from, text, rawPayload } = job.data

  console.log(`[worker] Processing job ${job.id} — messageId=${messageId} from=${from}`)

  // ── 1. Idempotency check ─────────────────────────────────────────────────
  const isNew = await logWebhookEvent(messageId, rawPayload)
  if (!isNew) return // Already processed

  try {
    // ── 2. Resolve tenant ──────────────────────────────────────────────────
    const tenantId = await resolveTenantId(job)
    if (!tenantId) {
      await markWebhookFailed(messageId, 'Tenant could not be resolved from phone_number_id')
      return
    }

    // ── 3. Sanitize input ──────────────────────────────────────────────────
    const safeText = sanitizeMessage(text)
    const safePhone = from.replace(/[^\d+]/g, '').slice(0, 20)

    if (!safePhone) {
      await markWebhookFailed(messageId, `Invalid phone number: ${from}`)
      return
    }

    // ── 4. Upsert contact ──────────────────────────────────────────────────
    const convRepo = new ConversationRepository(supabase)
    const contact = await convRepo.upsertContact(tenantId, safePhone)

    // ── 5. Upsert conversation ─────────────────────────────────────────────
    const conversation = await convRepo.upsertConversation(tenantId, contact.id)

    // ── 6. Insert inbound message with correct schema ──────────────────────
    const msgRepo = new MessageRepository(supabase)
    await msgRepo.insert({
      tenant_id: tenantId,
      conversation_id: conversation.id,    // ← FIXED: was lead_id
      sender_type: 'contact',              // ← FIXED: was sender: 'user'
      content: safeText,
      message_type: 'text',
      wa_message_id: messageId,           // ← FIXED: was meta_message_id
    })

    // Touch last_message_at
    await convRepo.touchLastMessage(conversation.id)

    // ── 7. Ensure lead exists for CRM tracking ─────────────────────────────
    const lead = await upsertLead(tenantId, contact.id)

    // ── 8. Resume active flow if contact is mid-flow ───────────────────────
    if (lead?.current_flow_id) {
      console.log(`[worker] Resuming flow ${lead.current_flow_id} at step ${lead.current_step_index}`)
      await FlowService.processFlow(
        supabase,
        tenantId,
        contact.id,
        conversation.id,
        safeText,
        lead.current_flow_id,
        (lead.current_step_index ?? 0) + 1
      )
      await runAutoPipelineStageLogic(tenantId, contact.id, conversation.id)
      await markWebhookProcessed(messageId)
      return
    }

    // ── 9. Match keyword flow ──────────────────────────────────────────────
    const keywordFlowId = await FlowService.matchKeywordFlow(supabase, tenantId, safeText)
    if (keywordFlowId) {
      console.log(`[worker] Keyword flow matched: ${keywordFlowId}`)
      await FlowService.processFlow(supabase, tenantId, contact.id, conversation.id, safeText, keywordFlowId, 0)
      await runAutoPipelineStageLogic(tenantId, contact.id, conversation.id)
      await markWebhookProcessed(messageId)
      return
    }

    // ── 10. Match first_message welcome flow ───────────────────────────────
    const welcomeFlowId = await FlowService.findWelcomeFlow(supabase, tenantId)
    if (welcomeFlowId) {
      console.log(`[worker] Welcome flow triggered: ${welcomeFlowId}`)
      await FlowService.processFlow(supabase, tenantId, contact.id, conversation.id, safeText, welcomeFlowId, 0)
      await runAutoPipelineStageLogic(tenantId, contact.id, conversation.id)
      await markWebhookProcessed(messageId)
      return
    }

    // ── 11. AI Agent fallback ──────────────────────────────────────────────
    const activeAgent = await fetchActiveAgent(tenantId)

    if (activeAgent) {
      await logAiUsage(tenantId)

      // AI Guard: check for prompt injection + token budget
      const guard = await AIGuard.check(tenantId, safeText, [])
      if (!guard.allowed) {
        logger.warn('[worker] AI guard blocked message', { tenantId, reason: guard.reason })
        await markWebhookProcessed(messageId)
        return
      }

      const systemPrompt =
        `You are an AI assistant named "${activeAgent.name ?? 'Assistant'}".\n` +
        `Instructions: ${activeAgent.instructions ?? 'Be helpful and concise.'}\n\n` +
        `Keep every reply under 3 sentences. If the user asks something outside your role, ` +
        `say "Let me connect you with a team member." and stop.`

      const reply = await AIService.getAgentResponse(
        guard.sanitizedMessage,
        systemPrompt,
        guard.truncatedHistory,
        activeAgent.model ?? 'gemini-1.5-flash'
      )

      const safeReply = sanitizeMessage(reply).slice(0, 1024)

      const aiMsg = await msgRepo.insert({
        tenant_id:       tenantId,
        conversation_id: conversation.id,
        sender_type:     'ai',
        content:         safeReply,
        message_type:    'text',
      })

      await convRepo.touchLastMessage(conversation.id)

      // Enqueue outbound delivery via Meta Cloud API
      const { enqueueOutbound } = await import('../services/queue.enterprise.js')
      await enqueueOutbound({
        tenantId,
        conversationId:  conversation.id,
        phoneNumber:     safePhone,
        content:         safeReply,
        messageType:     'text',
        idempotencyKey:  `ai-reply-${messageId}`,  // Idempotent: same inbound message → same outbound key
        waAccountId:     tenantId,
      })

      // Broadcast to all clients subscribed to this conversation
      if (aiMsg) {
        broadcastNewMessage(tenantId, conversation.id, {
          ...aiMsg,
          preview: safeReply.slice(0, 80),
        })
      }

      logger.info('[worker] AI reply queued for delivery', { tenantId, phone: safePhone })
    } else {
      logger.info('[worker] No active AI agent for tenant', { tenantId })
    }

    await runAutoPipelineStageLogic(tenantId, contact.id, conversation.id)
    await markWebhookProcessed(messageId)
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err)
    logger.error(`[worker] Job ${job.id} processing error:`, { err: errMsg })
    await markWebhookFailed(messageId, errMsg)
    throw err // Re-throw so BullMQ retries
  }
}

// ── BullMQ Worker ─────────────────────────────────────────────────────────────

const worker = new Worker<WebhookJobData>(QUEUE_NAME, processWebhookJob, {
  connection,
  concurrency: 5,
  limiter: {
    max: 50,
    duration: 1000,
  },
})

worker.on('completed', (job) => {
  console.log(`[worker] Job ${job.id} completed for message ${job.data.messageId}`)
})

worker.on('failed', (job, err) => {
  console.error(
    `[worker] Job ${job?.id} failed after ${job?.attemptsMade} attempts:`,
    err.message
  )
})

worker.on('error', (err) => {
  console.error('[worker] Worker error:', err)
})

process.on('SIGTERM', async () => {
  await worker.close()
  console.log('[worker] Gracefully shut down')
  process.exit(0)
})

console.log('[worker] WhatsApp message worker started — aligned to production schema v2.2')
