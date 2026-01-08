import { z } from 'zod';

export const moodEnum = z.enum(['happy', 'neutral', 'sad', 'angry']);
export const statusEnum = z.enum(['idea', 'planned', 'in_progress', 'shipped', 'closed']);
export const platformEnum = z.enum(['ios', 'android', 'web']);

export const feedbackSchema = z.object({
  boardSlug: z.string().min(1).max(120),
  title: z.string().min(3).max(80),
  body: z.string().min(10).max(1000),
  mood: moodEnum,
  platform: z.preprocess((value) => (value === '' ? undefined : value), platformEnum.optional()),
  appVersion: z.preprocess(
    (value) => (value === '' ? undefined : value),
    z.string().max(30).optional()
  ),
  website: z.string().max(0).optional(),
  startedAt: z.string().datetime()
});

export const upvoteSchema = z.object({
  feedbackId: z.string().uuid()
});

export const boardSchema = z.object({
  name: z.string().min(2).max(80),
  slug: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10).max(300),
  appStoreUrl: z.preprocess(
    (value) => (value === '' ? undefined : value),
    z.string().url().optional()
  ),
  playStoreUrl: z.preprocess(
    (value) => (value === '' ? undefined : value),
    z.string().url().optional()
  )
});

export const boardUpdateSchema = boardSchema.extend({
  id: z.string().uuid()
});

export const statusUpdateSchema = z.object({
  feedbackId: z.string().uuid(),
  status: statusEnum
});

export const hideSchema = z.object({
  feedbackId: z.string().uuid(),
  isHidden: z.boolean()
});
