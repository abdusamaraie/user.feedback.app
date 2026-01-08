import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hideSchema } from '@/lib/validation';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = hideSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }

  const feedback = await prisma.feedback.update({
    where: { id: parsed.data.feedbackId },
    data: { isHidden: parsed.data.isHidden },
    select: { id: true, board: { select: { slug: true } } }
  });

  revalidatePath(`/b/${feedback.board.slug}`);
  return NextResponse.json({ id: feedback.id });
}
