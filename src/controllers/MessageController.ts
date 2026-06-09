import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Message } from '../models/Message';
import { User } from '../models/User';
import { sendMessageSchema } from '../validations/message';
import { PushNotificationService } from '../services/PushNotificationService';
import { AppError } from '../utils/errors';

export class MessageController {
  static async sendMessage(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(401, 'User ID not found');
      }

      const input = sendMessageSchema.parse(req.body);

      // Check if receiver exists
      const receiver = await User.findById(input.receiverId);
      if (!receiver) {
        throw new AppError(404, 'Receiver not found');
      }

      // Prevent sending message to self
      if (req.userId === input.receiverId) {
        throw new AppError(400, 'You cannot send a message to yourself');
      }

      // Create message
      const message = await Message.create({
        senderId: req.userId,
        receiverId: input.receiverId,
        jokeText: input.jokeText,
        read: false,
      });

      // Get sender info for push notification
      const sender = await User.findById(req.userId);

      // Send push notification if receiver has push token
      if (receiver.expoPushToken && sender) {
        await PushNotificationService.sendJokeNotification(
          receiver.expoPushToken,
          sender.username
        );
      }

      res.status(201).json({
        success: true,
        data: message,
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
          message: 'Failed to send message',
        });
      }
    }
  }

  static async getInbox(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(401, 'User ID not found');
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const messages = await Message.find({ receiverId: req.userId })
        .populate('senderId', 'username email _id expoPushToken')
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 });

      const total = await Message.countDocuments({ receiverId: req.userId });

      res.status(200).json({
        success: true,
        data: messages,
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
          message: 'Failed to fetch inbox',
        });
      }
    }
  }

  static async getSent(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(401, 'User ID not found');
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const messages = await Message.find({ senderId: req.userId })
        .populate('receiverId', 'username email _id expoPushToken')
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 });

      const total = await Message.countDocuments({ senderId: req.userId });

      res.status(200).json({
        success: true,
        data: messages,
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
          message: 'Failed to fetch sent messages',
        });
      }
    }
  }

  static async markAsRead(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(401, 'User ID not found');
      }

      const { id } = req.params;

      const message = await Message.findOneAndUpdate(
        { _id: id, receiverId: req.userId },
        { read: true },
        { new: true }
      );

      if (!message) {
        throw new AppError(404, 'Message not found');
      }

      res.status(200).json({
        success: true,
        data: message,
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
          message: 'Failed to mark message as read',
        });
      }
    }
  }
}
