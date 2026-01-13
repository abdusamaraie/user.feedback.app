import { sql } from 'drizzle-orm';
import type { Payload } from 'payload';

export function isDuplicateVoteError(error: unknown) {
  if (typeof error !== 'object' || !error) return false;
  if ('code' in error && error.code === '23505') return true;
  const message = (error as { message?: string }).message ?? '';
  return message.includes('duplicate') || message.includes('unique');
}

export function shouldIncrementVotesCount(error?: unknown) {
  if (!error) return true;
  return !isDuplicateVoteError(error);
}

export async function incrementVotesCount(payload: Payload, postId: string) {
  const db = payload.db;

  if ('drizzle' in db) {
    await db.drizzle.execute(sql`UPDATE posts SET "votesCount" = "votesCount" + 1 WHERE id = ${postId}`);
    return;
  }

  const post = await payload.findByID({ collection: 'posts', id: postId, depth: 0 });
  await payload.update({
    collection: 'posts',
    id: postId,
    data: { votesCount: (post.votesCount ?? 0) + 1 },
    overrideAccess: true
  });
}
