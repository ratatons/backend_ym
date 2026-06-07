import { z } from 'zod';
import { Types } from 'mongoose';

export const addFavoriteSchema = z.object({
  jokeText: z.string().min(1, 'Joke text is required').max(1000, 'Joke text must be at most 1000 characters'),
});

export const deleteFavoriteSchema = z.object({
  id: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: 'Invalid favorite ID',
  }),
});

export type AddFavoriteInput = z.infer<typeof addFavoriteSchema>;
export type DeleteFavoriteInput = z.infer<typeof deleteFavoriteSchema>;
