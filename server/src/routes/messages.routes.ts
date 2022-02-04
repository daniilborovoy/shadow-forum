import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import MessageController from '../controllers/message.controller';
import { body } from 'express-validator';

const router = Router();

router.get('/messages', MessageController.getMessages);
router.post('/messages', body('message')
  .isLength({
    min: 5,
    max: 500,
  }), authMiddleware, MessageController.createMessage);
router.put('/messages', authMiddleware, MessageController.updateMessage);
router.delete('/messages/:id', authMiddleware, MessageController.deleteMessage);

export default router;
