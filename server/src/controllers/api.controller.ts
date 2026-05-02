import type { Request, Response } from 'express';
import { supabase } from '../index.js';

export class APIController {
  /**
   * Get all conversations (latest message per lead)
   */
  static async getConversations(req: Request, res: Response) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          messages (
            content,
            sender,
            timestamp
          )
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  /**
   * Get messages for a specific lead
   */
  static async getMessages(req: Request, res: Response) {
    const { leadId } = req.params;
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('lead_id', leadId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }



  /**
   * Get Dashboard Stats
   */
  static async getStats(req: Request, res: Response) {
    try {
      const { count: totalLeads } = await supabase.from('leads').select('*', { count: 'exact', head: true });
      const { count: bookedLeads } = await supabase.from('leads').select('*', { count: 'exact', head: true }).eq('stage', 'Booked');

      const { data: recentMessages } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);

      res.json({
        totalLeads: totalLeads || 0,
        bookedLeads: bookedLeads || 0,
        conversionRate: totalLeads ? ((bookedLeads || 0) / totalLeads * 100).toFixed(1) : 0,
        activeChats: 0, // Logic for active chats would go here
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  /**
   * Get All Leads
   */
  static async getLeads(req: Request, res: Response) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  /**
   * Get All Flows
   */
  static async getFlows(req: Request, res: Response) {
    try {
      const { data, error } = await supabase
        .from('flows')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  /**
   * Get All Campaigns
   */
  static async getCampaigns(req: Request, res: Response) {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  /**
   * Save/Update Campaign
   */
  static async saveCampaign(req: Request, res: Response) {
    try {
      const campaign = req.body;
      const { data, error } = await supabase
        .from('campaigns')
        .upsert([{
          id: campaign.id,
          name: campaign.name,
          status: campaign.status,
          audience_type: campaign.audienceType,
          audience_tag: campaign.audienceTag,
          audience_count: campaign.audienceCount,
          message: campaign.message,
          media_type: campaign.mediaType,
          media_url: campaign.mediaUrl,
          buttons: campaign.buttons,
          scheduled_at: campaign.scheduledAt,
          sent_at: campaign.sentAt,
          stats: campaign.stats || { sent: 0, delivered: 0, read: 0, replied: 0 },
          created_at: campaign.createdAt || new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      res.json(data[0]);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  /**
   * Delete Campaign
   */
  static async deleteCampaign(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  /**
   * Get Knowledge Sources
   */
  static async getKnowledgeSources(req: Request, res: Response) {
    try {
      const { data, error } = await supabase
        .from('knowledge_sources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  /**
   * Get Detailed Analytics
   */
  static async getAnalytics(req: Request, res: Response) {
    try {
      // In a real app, this would be a complex query or multiple queries
      // For now, we'll return a structure that the frontend expects
      const { data: leads } = await supabase.from('leads').select('*');
      const { data: flows } = await supabase.from('flows').select('*');

      const totalLeads = leads?.length || 0;
      const bookedLeads = leads?.filter(l => l.stage === 'Booked').length || 0;
      const conversionRate = totalLeads > 0 ? (bookedLeads / totalLeads) * 100 : 0;

      res.json({
        totalLeads,
        bookedLeads,
        conversionRate: conversionRate.toFixed(1) + '%',
        avgResponseTime: '0.8s', // This would come from a message timing query
        dailyStats: [], // For the charts
        serviceStats: []
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  /**
   * Get Support Tickets
   */
  static async getTickets(req: Request, res: Response) {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  /**
   * Create Support Ticket
   */
  static async createTicket(req: Request, res: Response) {
    try {
      const ticket = req.body;
      const { data, error } = await supabase
        .from('tickets')
        .insert([{
          ...ticket,
          created_at: new Date().toISOString(),
          status: 'open'
        }])
        .select();

      if (error) throw error;
      res.status(201).json(data[0]);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  /**
   * Save/Update Flow
   */
  static async saveFlow(req: Request, res: Response) {
    try {
      const flow = req.body;
      const { data, error } = await supabase
        .from('flows')
        .upsert([{
          id: flow.id,
          name: flow.name,
          active: flow.active,
          trigger_type: flow.triggerType,
          trigger_keyword: flow.triggerKeyword,
          steps: flow.steps,
          updated_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      res.json(data[0]);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  /**
   * Delete Flow
   */
  static async deleteFlow(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { error } = await supabase
        .from('flows')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  /**
   * Get Business Settings
   */
  static async getSettings(req: Request, res: Response) {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
      res.json(data || {});
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  /**
   * Update Business Settings
   */
  static async updateSettings(req: Request, res: Response) {
    try {
      const settings = req.body;
      const { data, error } = await supabase
        .from('settings')
        .upsert([{ id: 1, ...settings }]) // For now using a single row with ID 1
        .select();

      if (error) throw error;
      res.json(data[0]);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  /**
   * Get WhatsApp Templates
   */
  static async getWhatsAppTemplates(req: Request, res: Response) {
    try {
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'whatsapp_templates.json');
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
      }
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  /**
   * Save/Update WhatsApp Template
   */
  static async saveWhatsAppTemplate(req: Request, res: Response) {
    try {
      const fs = await import('fs');
      const path = await import('path');
      const template = req.body;
      const filePath = path.join(process.cwd(), 'whatsapp_templates.json');

      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
      }
      const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      const index = existing.findIndex((t: any) => t.id === template.id);
      if (index >= 0) {
        existing[index] = { ...existing[index], ...template, updated_at: new Date().toISOString() };
      } else {
        existing.unshift({
          ...template,
          id: template.id || Math.random().toString(36).substring(2, 11),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }

      fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
      res.json(template);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  /**
   * Delete WhatsApp Template
   */
  static async deleteWhatsAppTemplate(req: Request, res: Response) {
    try {
      const fs = await import('fs');
      const path = await import('path');
      const { id } = req.params;
      const filePath = path.join(process.cwd(), 'whatsapp_templates.json');

      if (fs.existsSync(filePath)) {
        const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const filtered = existing.filter((t: any) => t.id !== id);
        fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2));
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
