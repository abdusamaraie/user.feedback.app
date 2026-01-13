import { NextResponse, type NextRequest } from 'next/server';
import { getPayloadClient } from '@/lib/payload';
import { voteSchema } from '@/lib/validation';
import { rateLimit } from '@/lib/rate-limit';
import { getRequestIp, hashIp } from '@/lib/security';
import { createFingerprint, fingerprintCookieOptions, FINGERPRINT_COOKIE } from '@/lib/fingerprint';
import { incrementVotesCount, isDuplicateVoteError } from '@/lib/votes';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = voteSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }

  const payload = await getPayloadClient();
  const post = await payload.findByID({ collection: 'posts', id: parsed.data.postId, depth: 0 });
  if (!post) {
    return NextResponse.json({ message: 'Post not found' }, { status: 404 });
  }

  const ipHash = hashIp(getRequestIp(request));
  const limiter = await rateLimit(`votes:${ipHash}`, 50, 60 * 60 * 1000);
  if (!limiter.success) {
    return NextResponse.json({ message: 'Rate limit exceeded' }, { status: 429 });
  }

  const existingFingerprint = request.cookies.get(FINGERPRINT_COOKIE)?.value ?? null;
  const fingerprint = createFingerprint(existingFingerprint);

  try {
    await payload.create({
      collection: 'votes',
      data: {
        post: post.id,
        fingerprint,
        ipHash
      },
      overrideAccess: true
    });

    await incrementVotesCount(payload, post.id);
  } catch (error) {
    if (isDuplicateVoteError(error)) {
      return NextResponse.json({ message: 'Already voted' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Unable to vote' }, { status: 500 });
  }

  const response = NextResponse.json({ voted: true, votesCount: (post.votesCount ?? 0) + 1 });
  if (!existingFingerprint) {
    response.cookies.set(FINGERPRINT_COOKIE, fingerprint, fingerprintCookieOptions(process.env.NODE_ENV === 'production'));
  }

  return response;
}
