import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Favorite } from '../models/Favorite';
import { addFavoriteSchema, deleteFavoriteSchema } from '../validations/favorite';
import { AppError } from '../utils/errors';

export class FavoriteController {
  static async addFavorite(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(401, 'User ID not found');
      }

      const input = addFavoriteSchema.parse(req.body);

      // Check if favorite already exists
      const existingFavorite = await Favorite.findOne({
        userId: req.userId,
        jokeText: input.jokeText,
      });

      if (existingFavorite) {
        throw new AppError(409, 'This joke is already in your favorites');
      }

      const favorite = await Favorite.create({
        userId: req.userId,
        jokeText: input.jokeText,
      });

      res.status(201).json({
        success: true,
        data: favorite,
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
          message: 'Failed to add favorite',
        });
      }
    }
  }

  static async getFavorites(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(401, 'User ID not found');
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const favorites = await Favorite.find({ userId: req.userId })
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 });

      const total = await Favorite.countDocuments({ userId: req.userId });

      res.status(200).json({
        success: true,
        data: favorites,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
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
          message: 'Failed to fetch favorites',
        });
      }
    }
  }

  static async deleteFavorite(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(401, 'User ID not found');
      }

      const input = deleteFavoriteSchema.parse(req.params);

      const favorite = await Favorite.findOneAndDelete({
        _id: input.id,
        userId: req.userId,
      });

      if (!favorite) {
        throw new AppError(404, 'Favorite not found');
      }

      res.status(200).json({
        success: true,
        message: 'Favorite deleted successfully',
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
          message: 'Failed to delete favorite',
        });
      }
    }
  }
}
