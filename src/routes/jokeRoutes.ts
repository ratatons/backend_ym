import { Router } from 'express';
import { JokeController } from '../controllers/JokeController';
import { authenticate } from '../middleware/auth';

const jokeRouter = Router();

jokeRouter.get('/random', authenticate, JokeController.getRandomJoke);

export default jokeRouter;
