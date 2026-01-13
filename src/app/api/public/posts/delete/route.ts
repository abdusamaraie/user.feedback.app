import { NextResponse } from 'next/server';
import { getPayload } from '@/lib/payload';
import { deleteSchema } from '@/lib/validation';
import { verifyDeleteToken } from '@/lib/deleteTokens';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const payload = await getPayload();
  const body = await request.json();
  const parsed = deleteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const post = await payload.findByID({ collection: 'posts', id: parsed.data.postId });
  if (!post) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const ok = verifyDeleteToken(parsed.data.token, post.deleteTokenHash);
  if (!ok) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
  }

  await payload.delete({ collection: 'posts', id: parsed.data.postId });
  return NextResponse.json({ deleted: true });
}
