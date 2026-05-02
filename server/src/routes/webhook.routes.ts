import { Router } from 'express';
import { WebhookController } from '../controllers/webhook.controller.js';

const router = Router();

router.get('/', WebhookController.verify);
router.post('/', WebhookController.handle);

export default router;
