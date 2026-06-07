import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { AppError } from '../utils/errors';

export class UserController {
  static async getAllUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const users = await User.find()
        .select('-passwordHash')
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 });

      const total = await User.countDocuments();

      res.status(200).json({
        success: true,
        data: users,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch users',
      });
    }
  }

  static async searchUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const query = req.query.q as string;

      if (!query || query.length < 2) {
        throw new AppError(400, 'Search query must be at least 2 characters');
      }

      const users = await User.find({
        $or: [
          { username: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
        ],
      })
        .select('-passwordHash')
        .limit(20)
        .sort({ username: 1 });

      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to search users',
        });
      }
    }
  }

  static async getUserById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const user = await User.findById(id).select('-passwordHash');

      if (!user) {
        throw new AppError(404, 'User not found');
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch user',
        });
      }
    }
  }
}
