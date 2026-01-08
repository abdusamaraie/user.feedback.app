import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { statusUpdateSchema } from '@/lib/validation';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = statusUpdateSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }

  const feedback = await prisma.feedback.update({
    where: { id: parsed.data.feedbackId },
    data: { status: parsed.data.status },
    select: { id: true, board: { select: { slug: true } } }
  });

  revalidatePath(`/b/${feedback.board.slug}`);
  return NextResponse.json({ id: feedback.id });
}
