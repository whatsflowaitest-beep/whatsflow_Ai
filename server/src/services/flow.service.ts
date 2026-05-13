/**
 * Flow Service — Unified Flow Engine
 *
 * Consolidated from the old `flows` + `chatbot_flows` split.
 * Now reads exclusively from `chatbot_flows` with `tenant_id` scope.
 * Tracks state in `leads.current_flow_id` + `leads.current_step_index`.
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import type { FlowStep } from '../types/db.types.js'
import { AIService } from './ai.service.js'

export class FlowService {
  /**
   * Execute the next step of a flow.
   * @param db         Service-role Supabase client
   * @param tenantId   Tenant UUID (NOT organization_id)
   * @param contactId  Contact UUID
   * @param conversationId Conversation UUID (messages go here)
   * @param message    The incoming message text
   * @param flowId     chatbot_flows.id
   * @param stepIndex  Current step index (0-based)
   */
  static async processFlow(
    db: SupabaseClient,
    tenantId: string,
    contactId: string,
    conversationId: string,
    message: string,
    flowId: string,
    stepIndex = 0
  ): Promise<void> {
    // Load flow from chatbot_flows (tenant-scoped)
    const { data: flow, error } = await db
      .from('chatbot_flows')
      .select('id, definition, is_active')
      .eq('id', flowId)
      .eq('tenant_id', tenantId)
      .single()

    if (error || !flow || !flow.is_active) {
      console.warn(`[FlowService] Flow ${flowId} not found or inactive for tenant ${tenantId}`)
      return
    }

    const steps = flow.definition as FlowStep[]
    if (!steps || stepIndex >= steps.length) {
      // Flow finished — clear state on lead
      await FlowService.clearFlowState(db, tenantId, contactId)
      return
    }

    const step = steps[stepIndex]!

    switch (step.type) {
      case 'message': {
        await FlowService.sendMessage(db, tenantId, conversationId, step.message ?? '')
        await FlowService.processFlow(db, tenantId, contactId, conversationId, message, flowId, stepIndex + 1)
        break
      }

      case 'question': {
        await FlowService.sendMessage(db, tenantId, conversationId, step.message ?? '')
        // Save flow state — wait for user reply
        await FlowService.saveFlowState(db, tenantId, contactId, flowId, stepIndex)
        break
      }

      case 'buttons': {
        const text = step.message ?? ''
        const buttonLabels = (step.buttons ?? []).map((b) => b.label).join(' | ')
        await FlowService.sendMessage(db, tenantId, conversationId, `${text}\n\n${buttonLabels}`)
        await FlowService.saveFlowState(db, tenantId, contactId, flowId, stepIndex)
        break
      }

      case 'delay': {
        const delayMs = (step.delayMinutes ?? 1) * 60 * 1000
        await new Promise((resolve) => setTimeout(resolve, Math.min(delayMs, 30_000))) // Cap at 30s in-process
        await FlowService.processFlow(db, tenantId, contactId, conversationId, message, flowId, stepIndex + 1)
        break
      }

      case 'ai_agent': {
        const reply = await AIService.getGeminiResponse(message, step.aiPrompt ?? '')
        await FlowService.sendMessage(db, tenantId, conversationId, reply)
        await FlowService.processFlow(db, tenantId, contactId, conversationId, message, flowId, stepIndex + 1)
        break
      }

      case 'tag': {
        if (step.tagName) {
          // Fetch current tags, append the new tag (deduplicated), then write back.
          // contacts.tags is a jsonb column storing string[].
          const { data: contact } = await db
            .from('contacts')
            .select('tags')
            .eq('id', contactId)
            .eq('tenant_id', tenantId)
            .maybeSingle()

          const existingTags: string[] = Array.isArray(contact?.tags) ? contact.tags : []

          // Deduplicate — don't add the same tag twice
          if (!existingTags.includes(step.tagName)) {
            const updatedTags = [...existingTags, step.tagName]
            await db
              .from('contacts')
              .update({ tags: updatedTags })
              .eq('id', contactId)
              .eq('tenant_id', tenantId)
          }
        }
        await FlowService.processFlow(db, tenantId, contactId, conversationId, message, flowId, stepIndex + 1)
        break
      }

      case 'handover': {
        // Switch conversation to manual mode — stops AI replies
        await db
          .from('conversations')
          .update({ mode: 'manual' })
          .eq('id', conversationId)
          .eq('tenant_id', tenantId)

        if (step.handoverNote) {
          await FlowService.sendMessage(
            db,
            tenantId,
            conversationId,
            `[HANDOVER] ${step.handoverNote}`,
            'system'
          )
        }
        await FlowService.clearFlowState(db, tenantId, contactId)
        break
      }

      case 'end': {
        if (step.endMessage) {
          await FlowService.sendMessage(db, tenantId, conversationId, step.endMessage)
        }
        if (step.endLeadStage) {
          await db
            .from('leads')
            .update({ stage: step.endLeadStage, updated_at: new Date().toISOString() })
            .eq('contact_id', contactId)
            .eq('tenant_id', tenantId)
        }
        await FlowService.clearFlowState(db, tenantId, contactId)
        break
      }

      default: {
        // Skip unhandled step types and continue
        await FlowService.processFlow(db, tenantId, contactId, conversationId, message, flowId, stepIndex + 1)
      }
    }
  }

  /** Find the active keyword flow for a given message */
  static async matchKeywordFlow(
    db: SupabaseClient,
    tenantId: string,
    message: string
  ): Promise<string | null> {
    const { data } = await db
      .from('chatbot_flows')
      .select('id, definition')
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .not('definition', 'is', null)

    if (!data) return null

    // Find keyword-trigger flows where trigger_keyword matches message
    const lower = message.toLowerCase().trim()
    for (const flow of data) {
      const def = flow.definition as { triggerType?: string; triggerKeyword?: string }[]
      const meta = def?.[0] as { triggerType?: string; triggerKeyword?: string } | undefined
      if (meta?.triggerType === 'keyword' && meta?.triggerKeyword) {
        if (lower.includes(meta.triggerKeyword.toLowerCase())) {
          return flow.id as string
        }
      }
    }
    return null
  }

  /** Find the first_message trigger flow for a tenant */
  static async findWelcomeFlow(
    db: SupabaseClient,
    tenantId: string
  ): Promise<string | null> {
    const { data } = await db
      .from('chatbot_flows')
      .select('id, definition')
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .not('definition', 'is', null)
      .limit(10)

    if (!data) return null

    for (const flow of data) {
      const def = flow.definition as { triggerType?: string }[]
      const meta = def?.[0] as { triggerType?: string } | undefined
      if (meta?.triggerType === 'first_message') {
        return flow.id as string
      }
    }
    return null
  }

  /** Insert an AI/system message into a conversation */
  private static async sendMessage(
    db: SupabaseClient,
    tenantId: string,
    conversationId: string,
    content: string,
    senderType: 'ai' | 'system' = 'ai'
  ): Promise<void> {
    const { error } = await db.from('messages').insert({
      tenant_id: tenantId,
      conversation_id: conversationId,
      sender_type: senderType,
      content,
      message_type: 'text',
    })

    if (error) {
      console.error(`[FlowService.sendMessage] ${error.message}`)
    }

    // Touch last_message_at
    await db
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversationId)
  }

  /** Persist flow execution state onto the lead record */
  private static async saveFlowState(
    db: SupabaseClient,
    tenantId: string,
    contactId: string,
    flowId: string,
    stepIndex: number
  ): Promise<void> {
    const { error } = await db
      .from('leads')
      .update({
        current_flow_id: flowId,
        current_step_index: stepIndex,
        updated_at: new Date().toISOString(),
      })
      .eq('contact_id', contactId)
      .eq('tenant_id', tenantId)

    if (error) console.error(`[FlowService.saveFlowState] ${error.message}`)
  }

  /** Clear flow state when flow finishes or is abandoned */
  private static async clearFlowState(
    db: SupabaseClient,
    tenantId: string,
    contactId: string
  ): Promise<void> {
    await db
      .from('leads')
      .update({
        current_flow_id: null,
        current_step_index: 0,
        updated_at: new Date().toISOString(),
      })
      .eq('contact_id', contactId)
      .eq('tenant_id', tenantId)
  }
}
