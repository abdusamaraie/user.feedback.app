import { z } from 'zod';

export const postSchema = z.object({
  boardId: z.string().min(1).optional(),
  appSlug: z.string().min(1).optional(),
  boardSlug: z.string().min(1).optional(),
  title: z.string().min(5).max(120),
  body: z.string().min(10).max(2000),
  type: z.enum(['feature', 'bug', 'idea']).default('feature'),
  authorName: z.preprocess(
    (value) => (value === '' ? undefined : value),
    z.string().max(80).optional()
  ),
  authorEmail: z.preprocess(
    (value) => (value === '' ? undefined : value),
    z.string().email().optional()
  ),
  website: z.string().max(0).optional(),
  startedAt: z.string().datetime()
}).refine(
  (value) => Boolean(value.boardId) || (Boolean(value.appSlug) && Boolean(value.boardSlug)),
  { message: 'boardId or appSlug/boardSlug required' }
);

export const voteSchema = z.object({
  postId: z.string().min(1)
});

export const deleteSchema = z.object({
  postId: z.string().min(1),
  token: z.string().min(10)
});
