import { NextResponse } from 'next/server';
import { getPayload } from '@/lib/payload';
import { ensureFingerprint } from '@/lib/fingerprint';
import { getClientIp } from '@/lib/request';
import { hashIp } from '@/lib/ipHash';
import { getRateLimiter } from '@/lib/rateLimit';
import { generateDeleteToken, hashDeleteToken } from '@/lib/deleteTokens';
import { postSchema } from '@/lib/validation';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const boardId = searchParams.get('boardId');
  if (!boardId) {
    return NextResponse.json({ error: 'boardId is required' }, { status: 400 });
  }

  const sort = searchParams.get('sort') === 'top' ? 'top' : 'new';
  const type = searchParams.get('type');
  const status = searchParams.get('status');
  const tag = searchParams.get('tag');

  const where: Record<string, unknown> = {
    board: { equals: boardId }
  };

  if (type) {
    where.type = { equals: type };
  }

  if (status) {
    where.status = { equals: status };
  }

  if (tag) {
    where.tags = { contains: tag };
  }

  const payload = await getPayload();
  const result = await payload.find({
    collection: 'posts',
    where,
    depth: 1,
    sort: ['-pinned', sort === 'top' ? '-votesCount' : '-createdAt'],
    limit: 50
  });

  return NextResponse.json({
    posts: result.docs
  });
}

export async function POST(request: Request) {
  const payload = await getPayload();
  const fingerprint = ensureFingerprint();
  const body = await request.json();
  const parsed = postSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', issues: parsed.error.flatten() }, { status: 400 });
  }

  if (parsed.data.honeypot) {
    return NextResponse.json({ error: 'Spam detected' }, { status: 400 });
  }

  const ipHash = hashIp(getClientIp());
  const rateLimiter = getRateLimiter();
  if (ipHash) {
    const rate = await rateLimiter.post.limit(ipHash);
    if (!rate.success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }
  }

  const deleteToken = generateDeleteToken();
  const hasContact = Boolean(parsed.data.authorName || parsed.data.authorEmail);

  const post = await payload.create({
    collection: 'posts',
    data: {
      board: parsed.data.boardId,
      title: parsed.data.title,
      body: parsed.data.body,
      type: parsed.data.type,
      status: 'open',
      votesCount: 0,
      authorName: parsed.data.authorName || undefined,
      authorEmail: parsed.data.authorEmail || undefined,
      isAnonymous: !hasContact,
      deleteTokenHash: hashDeleteToken(deleteToken)
    }
  });

  return NextResponse.json({ post, deleteToken, fingerprint });
}
