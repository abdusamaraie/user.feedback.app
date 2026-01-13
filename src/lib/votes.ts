import type { Payload } from 'payload';

export class DuplicateVoteError extends Error {}

export async function createVote({
  payload,
  postId,
  fingerprint,
  ipHash
}: {
  payload: Payload;
  postId: string;
  fingerprint: string;
  ipHash?: string;
}) {
  try {
    await payload.create({
      collection: 'votes',
      data: {
        post: postId,
        fingerprint,
        ipHash
      }
    });
  } catch (error) {
    if (isDuplicateError(error)) {
      throw new DuplicateVoteError('Already voted');
    }
    throw error;
  }

  const db = payload.db as { pool?: { query: (sql: string, params: unknown[]) => Promise<{ rows: Array<{ votesCount: number }> }> } } | null;

  if (db?.pool) {
    const result = await db.pool.query(
      'UPDATE posts SET "votesCount" = "votesCount" + 1 WHERE id = $1 RETURNING "votesCount"',
      [postId]
    );
    return result.rows[0]?.votesCount ?? 0;
  }

  const current = await payload.findByID({ collection: 'posts', id: postId });
  const updated = await payload.update({
    collection: 'posts',
    id: postId,
    data: {
      votesCount: (current.votesCount || 0) + 1
    }
  });

  return updated.votesCount || 0;
}

export function isDuplicateError(error: unknown) {
  if (!error || typeof error !== 'object') return false;
  const message = 'message' in error ? String((error as { message?: string }).message) : '';
  return message.includes('duplicate key') || message.includes('unique constraint');
}
