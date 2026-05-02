import type { Request, Response } from 'express';
import { FlowService } from '../services/flow.service.js';
import { supabase } from '../index.js';

export class WebhookController {
  /**
   * Verification for WhatsApp Webhook
   */
  static verify(req: Request, res: Response) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
      if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
        console.log('Webhook verified');
        return res.status(200).send(challenge);
      }
    }
    res.sendStatus(403);
  }

  /**
   * Handle incoming messages
   */
  static async handle(req: Request, res: Response) {
    const body = req.body;

    if (body.object === 'whatsapp_business_account') {
      try {
        const entry = body.entry[0];
        const changes = entry.changes[0];
        const value = changes.value;
        const message = value.messages?.[0];

        if (message) {
          const from = message.from; // Phone number
          const text = message.text?.body;

          console.log(`Received message from ${from}: ${text}`);

          // 1. Find or Create Lead
          let { data: lead } = await supabase
            .from('leads')
            .select('*')
            .eq('phone', from)
            .single();

          if (!lead) {
            const { data: newLead } = await supabase
              .from('leads')
              .insert({ phone: from, name: 'New Contact' })
              .select()
              .single();
            lead = newLead;
          }

          // 2. Log Message
          await supabase.from('messages').insert({
            lead_id: lead.id,
            content: text,
            sender: 'user',
            timestamp: new Date().toISOString()
          });

          // 3. Process Logic (Flows or AI)
          if (lead.current_flow_id) {
            // Resume flow
            await FlowService.processFlow(lead.id, text, lead.current_flow_id, lead.current_step_index + 1);
          } else {
            // Initial trigger check or Default AI Response
            // For now, let's just trigger the 'Welcome' flow if it exists
            const { data: welcomeFlow } = await supabase
              .from('flows')
              .select('id')
              .eq('trigger_type', 'first_message')
              .eq('active', true)
              .single();

            if (welcomeFlow) {
              await FlowService.processFlow(lead.id, text, welcomeFlow.id, 0);
            }
          }
        }

        res.sendStatus(200);
      } catch (error) {
        console.error('Webhook Error:', error);
        res.sendStatus(500);
      }
    } else {
      res.sendStatus(404);
    }
  }
}
