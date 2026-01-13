import { describe, expect, it, vi } from 'vitest';
import { createVote, DuplicateVoteError } from '@/lib/votes';

describe('votes', () => {
  it('does not increment votes when duplicate vote detected', async () => {
    const payload = {
      create: vi.fn().mockRejectedValue({ message: 'duplicate key value violates unique constraint' }),
      update: vi.fn(),
      findByID: vi.fn(),
      db: null
    } as any;

    await expect(
      createVote({ payload, postId: 'post-1', fingerprint: 'fp-1' })
    ).rejects.toBeInstanceOf(DuplicateVoteError);
    expect(payload.update).not.toHaveBeenCalled();
  });
});
