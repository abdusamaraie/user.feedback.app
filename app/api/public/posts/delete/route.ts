import { NextResponse, type NextRequest } from 'next/server';
import { getPayloadClient } from '@/lib/payload';
import { deleteSchema } from '@/lib/validation';
import { verifyDeleteToken } from '@/lib/delete-token';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = deleteSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }

  const payload = await getPayloadClient();
  const post = await payload.findByID({ collection: 'posts', id: parsed.data.postId, depth: 0 });
  if (!post) {
    return NextResponse.json({ message: 'Post not found' }, { status: 404 });
  }

  if (!verifyDeleteToken(parsed.data.token, post.deleteTokenHash)) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 403 });
  }

  await payload.delete({ collection: 'posts', id: post.id, overrideAccess: true });
  return NextResponse.json({ success: true });
}
