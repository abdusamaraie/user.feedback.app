import { describe, expect, it } from 'vitest';
import { isDuplicateVoteError, shouldIncrementVotesCount } from '@/lib/votes';

describe('vote uniqueness handling', () => {
  it('detects duplicate vote errors', () => {
    expect(isDuplicateVoteError({ code: '23505' })).toBe(true);
  });

  it('prevents increment on duplicate votes', () => {
    const error = { code: '23505' };
    expect(shouldIncrementVotesCount(error)).toBe(false);
  });
});
