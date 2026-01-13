import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { feedbackSchema } from '@/lib/validation';
import { getFingerprint, getRequestIp, hashValue } from '@/lib/security';
import { rateLimit } from '@/lib/rate-limit';
import { revalidatePath } from 'next/cache';

const MIN_FILL_TIME_MS = 3000;

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = feedbackSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }

  const { website, startedAt, boardSlug, ...data } = parsed.data;

  if (website) {
    return NextResponse.json({ message: 'Bot detected' }, { status: 400 });
  }

  const startedTime = new Date(startedAt).getTime();
  if (Number.isNaN(startedTime) || Date.now() - startedTime < MIN_FILL_TIME_MS) {
    return NextResponse.json({ message: 'Please slow down and try again.' }, { status: 429 });
  }

  const ipHash = hashValue(getRequestIp(request));
  const voterHash = hashValue(getFingerprint(request));
  const limiter = await rateLimit(`feedback:${ipHash}:${voterHash}`, 5, 60 * 60 * 1000);

  if (!limiter.success) {
    return NextResponse.json({ message: 'Rate limit exceeded' }, { status: 429 });
  }

  const board = await prisma.board.findUnique({ where: { slug: boardSlug } });
  if (!board) {
    return NextResponse.json({ message: 'Board not found' }, { status: 404 });
  }

  const feedback = await prisma.feedback.create({
    data: {
      ...data,
      boardId: board.id,
      status: 'idea'
    }
  });

  revalidatePath(`/b/${board.slug}`);
  return NextResponse.json({ id: feedback.id });
}
