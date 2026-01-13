import { z } from 'zod';

export const postSchema = z.object({
  boardId: z.string().min(1),
  title: z.string().min(3).max(120),
  body: z.string().min(10).max(2000),
  type: z.enum(['feature', 'bug', 'idea']).default('feature'),
  authorName: z.string().max(120).optional().or(z.literal('')),
  authorEmail: z.string().email().optional().or(z.literal('')),
  honeypot: z.string().optional()
});

export const deleteSchema = z.object({
  postId: z.string().min(1),
  token: z.string().min(32)
});

export const voteSchema = z.object({
  postId: z.string().min(1)
});
