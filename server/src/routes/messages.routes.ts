import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import MessageController from '../controllers/message.controller';
import { body } from 'express-validator';
import { validateMessageBody } from '../validators/messages.validators';

const router = Router();

router.get('/messages/:discussion', MessageController.getMessages);
router.post('/messages', authMiddleware, validateMessageBody(), MessageController.createMessage);
router.put('/messages', authMiddleware, validateMessageBody(), MessageController.updateMessage);
router.delete('/messages/:id', authMiddleware, MessageController.deleteMessage);

export default router;
