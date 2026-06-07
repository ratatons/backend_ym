import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticate } from '../middleware/auth';

const userRouter = Router();

userRouter.get('/', authenticate, UserController.getAllUsers);
userRouter.get('/search', authenticate, UserController.searchUsers);
userRouter.get('/:id', authenticate, UserController.getUserById);

export default userRouter;
