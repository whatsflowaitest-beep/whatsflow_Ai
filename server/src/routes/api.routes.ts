import { Router } from 'express';
import { APIController } from '../controllers/api.controller.js';

const router = Router();

router.get('/conversations', APIController.getConversations);
router.get('/stats', APIController.getStats);
router.get('/leads', APIController.getLeads);
router.get('/flows', APIController.getFlows);
router.get('/campaigns', APIController.getCampaigns);
router.post('/campaigns', APIController.saveCampaign);
router.delete('/campaigns/:id', APIController.deleteCampaign);
router.get('/knowledge', APIController.getKnowledgeSources);
router.get('/analytics', APIController.getAnalytics);
router.get('/tickets', APIController.getTickets);
router.post('/tickets', APIController.createTicket);
router.get('/conversations/:leadId/messages', APIController.getMessages);
router.post('/flows', APIController.saveFlow);
router.delete('/flows/:id', APIController.deleteFlow);
router.get('/settings', APIController.getSettings);
router.post('/settings', APIController.updateSettings);

router.get('/whatsapp-templates', APIController.getWhatsAppTemplates);
router.post('/whatsapp-templates', APIController.saveWhatsAppTemplate);
router.delete('/whatsapp-templates/:id', APIController.deleteWhatsAppTemplate);

export default router;
