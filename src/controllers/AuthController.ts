import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AuthService } from '../services/AuthService';
import { registerSchema, loginSchema, pushTokenSchema } from '../validations/auth';
import { AppError } from '../utils/errors';
import { User } from '../models/User';

export class AuthController {
  static async register(req: AuthRequest, res: Response): Promise<void> {
    try {
      const input = registerSchema.parse(req.body);
      const result = await AuthService.register(input);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Registration failed',
        });
      }
    }
  }

  static async login(req: AuthRequest, res: Response): Promise<void> {
    try {
      const input = loginSchema.parse(req.body);
      const result = await AuthService.login(input);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Login failed',
        });
      }
    }
  }

  static async getMe(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(401, 'User ID not found');
      }

      const user = await AuthService.getUserById(req.userId);

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
          message: 'Failed to get user',
        });
      }
    }
  }

  static async setPushToken(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(401, 'User ID not found');
      }

      const input = pushTokenSchema.parse(req.body);

      const user = await User.findByIdAndUpdate(
        req.userId,
        { expoPushToken: input.expoPushToken },
        { new: true }
      );

      if (!user) {
        throw new AppError(404, 'User not found');
      }

      const userResponse = user.toObject();
      delete (userResponse as any).passwordHash;

      res.status(200).json({
        success: true,
        data: userResponse,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to set push token',
        });
      }
    }
  }
}
