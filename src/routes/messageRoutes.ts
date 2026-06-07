import { Router } from 'express';
import { MessageController } from '../controllers/MessageController';
import { authenticate } from '../middleware/auth';

const messageRouter = Router();

messageRouter.post('/send', authenticate, MessageController.sendMessage);
messageRouter.get('/inbox', authenticate, MessageController.getInbox);
messageRouter.get('/sent', authenticate, MessageController.getSent);
messageRouter.patch('/:id/read', authenticate, MessageController.markAsRead);

export default messageRouter;
