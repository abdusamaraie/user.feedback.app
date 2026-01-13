import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { upvoteSchema } from '@/lib/validation';
import { getFingerprint, getRequestIp, hashValue } from '@/lib/security';
import { rateLimit } from '@/lib/rate-limit';
import { isUniqueConstraintError } from '@/lib/prisma-errors';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = upvoteSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }

  const { feedbackId } = parsed.data;
  const ipHash = hashValue(getRequestIp(request));
  const voterHash = hashValue(getFingerprint(request));
  const limiter = await rateLimit(`upvote:${ipHash}:${voterHash}`, 30, 60 * 60 * 1000);

  if (!limiter.success) {
    return NextResponse.json({ message: 'Rate limit exceeded' }, { status: 429 });
  }

  const feedback = await prisma.feedback.findUnique({
    where: { id: feedbackId },
    select: { id: true, board: { select: { slug: true } } }
  });

  if (!feedback) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.upvote.create({
        data: {
          feedbackId,
          voterHash,
          ipHash
        }
      });
      await tx.feedback.update({
        where: { id: feedbackId },
        data: { upvoteCount: { increment: 1 } }
      });
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json({ message: 'Already upvoted' }, { status: 200 });
    }
    return NextResponse.json({ message: 'Unable to upvote' }, { status: 500 });
  }

  revalidatePath(`/b/${feedback.board.slug}`);
  return NextResponse.json({ success: true });
}
