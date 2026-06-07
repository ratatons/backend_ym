import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authenticate } from '../middleware/auth';

const pushRouter = Router();

pushRouter.post('/push-token', authenticate, AuthController.setPushToken);

export default pushRouter;
