import { describe, expect, it } from 'vitest';
import { feedbackSchema, upvoteSchema } from '@/lib/validation';

describe('feedback validation', () => {
  it('accepts valid feedback', () => {
    const result = feedbackSchema.safeParse({
      boardSlug: 'launch-v1',
      title: 'Great idea',
      body: 'This is a detailed message about the feature request.',
      mood: 'happy',
      platform: 'ios',
      appVersion: '1.0.0',
      website: '',
      startedAt: new Date().toISOString()
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid feedback length', () => {
    const result = feedbackSchema.safeParse({
      boardSlug: 'launch-v1',
      title: 'Hi',
      body: 'Short',
      mood: 'happy',
      website: '',
      startedAt: new Date().toISOString()
    });

    expect(result.success).toBe(false);
  });
});

describe('upvote validation', () => {
  it('accepts a valid uuid', () => {
    const result = upvoteSchema.safeParse({
      feedbackId: '123e4567-e89b-12d3-a456-426614174000'
    });

    expect(result.success).toBe(true);
  });
});
