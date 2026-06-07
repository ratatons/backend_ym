import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { connectDatabase } from './config/database';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/logger';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import jokeRoutes from './routes/jokeRoutes';
import favoriteRoutes from './routes/favoriteRoutes';
import messageRoutes from './routes/messageRoutes';
import pushRoutes from './routes/pushRoutes';

dotenv.config();

const app = express();

// Health check endpoint (before all middleware to avoid rate limiting)
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Backend healthy',
  });
});

// Initialize database
connectDatabase().catch((error) => {
  console.error('Failed to connect to database:', error);
  process.exit(1);
});

// Security middleware
app.use(helmet());

// CORS middleware
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(
  cors({
    origin: corsOrigin === '*' ? '*' : corsOrigin.split(','),
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logger
app.use(requestLogger);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jokes', jokeRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', pushRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

export default app;
