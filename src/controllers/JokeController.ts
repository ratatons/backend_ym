import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { JokeService } from '../services/JokeService';

export class JokeController {
  static async getRandomJoke(req: AuthRequest, res: Response): Promise<void> {
    try {
      const joke = await JokeService.getRandomJoke();

      res.status(200).json({
        success: true,
        data: joke,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch joke',
      });
    }
  }
}
