import { z } from 'zod';
import { Types } from 'mongoose';

export const sendMessageSchema = z.object({
  receiverId: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: 'Invalid receiver ID',
  }),
  jokeText: z.string().min(1, 'Joke text is required').max(1000, 'Joke text must be at most 1000 characters'),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
