import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { boardSchema, boardUpdateSchema } from '@/lib/validation';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = boardSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }

  const board = await prisma.board.create({ data: parsed.data });
  revalidatePath(`/b/${board.slug}`);
  return NextResponse.json({ id: board.id });
}

export async function PUT(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = boardUpdateSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }

  const { id, ...data } = parsed.data;
  const board = await prisma.board.update({
    where: { id },
    data
  });

  revalidatePath(`/b/${board.slug}`);
  return NextResponse.json({ id: board.id });
}

export async function DELETE(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const schema = boardSchema.pick({ slug: true });
  const parsed = schema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }

  await prisma.board.delete({ where: { slug: parsed.data.slug } });
  revalidatePath(`/b/${parsed.data.slug}`);
  return NextResponse.json({ success: true });
}
