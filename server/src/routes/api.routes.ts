import { Router } from 'express';
import multer from 'multer';
import { APIController } from '../controllers/api.controller.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

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

router.get('/catalog', APIController.getCatalogProducts);
router.post('/catalog/upload', upload.single('file'), APIController.uploadCatalogImage);
router.post('/catalog', APIController.createCatalogProduct);
router.put('/catalog/:id', APIController.updateCatalogProduct);
router.delete('/catalog/:id', APIController.deleteCatalogProduct);

router.get('/ai-agents', APIController.getAIAgents);
router.post('/ai-agents', APIController.createAIAgent);
router.put('/ai-agents/:id', APIController.updateAIAgent);
router.delete('/ai-agents/:id', APIController.deleteAIAgent);
router.patch('/ai-agents/:id/status', APIController.toggleAIAgentStatus);
router.post('/ai-agents/:id/chat', APIController.chatWithAIAgent);

export default router;
