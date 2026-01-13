import { NextResponse } from 'next/server';
import { getPayload } from '@/lib/payload';
import { ensureFingerprint } from '@/lib/fingerprint';
import { getClientIp } from '@/lib/request';
import { hashIp } from '@/lib/ipHash';
import { getRateLimiter } from '@/lib/rateLimit';
import { voteSchema } from '@/lib/validation';
import { createVote, DuplicateVoteError } from '@/lib/votes';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const payload = await getPayload();
  const body = await request.json();
  const parsed = voteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const fingerprint = ensureFingerprint();
  const ipHash = hashIp(getClientIp());
  const rateLimiter = getRateLimiter();
  if (ipHash) {
    const rate = await rateLimiter.vote.limit(ipHash);
    if (!rate.success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }
  }

  try {
    const votesCount = await createVote({
      payload,
      postId: parsed.data.postId,
      fingerprint,
      ipHash
    });

    return NextResponse.json({ voted: true, votesCount });
  } catch (error) {
    if (error instanceof DuplicateVoteError) {
      const post = await payload.findByID({ collection: 'posts', id: parsed.data.postId });
      return NextResponse.json({ voted: true, votesCount: post?.votesCount ?? 0 }, { status: 409 });
    }

    throw error;
  }
}
