import { supabase } from '../index.js';
import { AIService } from './ai.service.js';

export interface FlowStep {
  id: string;
  type: string;
  message?: string;
  variableName?: string;
  buttons?: any[];
  tagName?: string;
  notifyNote?: string;
  bookingUrl?: string;
  delayMinutes?: number;
  conditionVariable?: string;
  conditionOperator?: string;
  conditionValue?: string;
  mediaType?: string;
  mediaUrl?: string;
  aiPrompt?: string;
  webhookUrl?: string;
  listTitle?: string;
  listItems?: any[];
}

export class FlowService {
  /**
   * Process a message through an automation flow
   */
  static async processFlow(leadId: string, message: string, flowId: string, currentStepIndex: number = 0) {
    // 1. Get Flow from DB
    const { data: flow, error } = await supabase
      .from('flows')
      .select('*')
      .eq('id', flowId)
      .single();

    if (error || !flow) return;

    const steps = flow.steps as FlowStep[];
    if (currentStepIndex >= steps.length) return;

    const step = steps[currentStepIndex];
    if (!step) return;

    // 2. Handle different step types
    switch (step.type) {
      case 'message':
        await this.sendMessage(leadId, step.message || '');
        // Proceed to next step immediately
        await this.processFlow(leadId, message, flowId, currentStepIndex + 1);
        break;

      case 'question':
        await this.sendMessage(leadId, step.message || '');
        // Stop here and wait for answer (to be handled by webhook controller)
        await this.updateLeadStep(leadId, flowId, currentStepIndex);
        break;

      case 'ai_agent':
        const aiResponse = await AIService.getGeminiResponse(message, step.aiPrompt);
        await this.sendMessage(leadId, aiResponse);
        await this.processFlow(leadId, message, flowId, currentStepIndex + 1);
        break;

      // Add more cases as needed (tag, notify, etc.)
      default:
        await this.processFlow(leadId, message, flowId, currentStepIndex + 1);
    }
  }

  static async sendMessage(leadId: string, content: string) {
    console.log(`Sending message to Lead ${leadId}: ${content}`);
    // Here we would call the WhatsApp Cloud API
    
    // Log message to DB
    await supabase.from('messages').insert({
      lead_id: leadId,
      content,
      sender: 'ai',
      timestamp: new Date().toISOString()
    });
  }

  static async updateLeadStep(leadId: string, flowId: string, stepIndex: number) {
    await supabase.from('leads').update({
      current_flow_id: flowId,
      current_step_index: stepIndex,
      status: 'waiting_for_reply'
    }).eq('id', leadId);
  }
}
