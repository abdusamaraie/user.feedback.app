import { NextResponse, type NextRequest } from 'next/server';
import { getPayloadClient } from '@/lib/payload';
import { postSchema } from '@/lib/validation';
import { rateLimit } from '@/lib/rate-limit';
import { getRequestIp, hashIp } from '@/lib/security';
import { createFingerprint, fingerprintCookieOptions, FINGERPRINT_COOKIE } from '@/lib/fingerprint';
import { generateDeleteToken } from '@/lib/delete-token';

export const runtime = 'nodejs';

const MIN_FILL_TIME_MS = 3000;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const boardId = searchParams.get('boardId');
  if (!boardId) {
    return NextResponse.json({ message: 'boardId is required' }, { status: 400 });
  }

  const sort = searchParams.get('sort') === 'top' ? 'top' : 'new';
  const type = searchParams.get('type');
  const status = searchParams.get('status');
  const tag = searchParams.get('tag');
  const page = Number(searchParams.get('page') ?? '1');

  const where: Record<string, unknown> = {
    board: { equals: boardId }
  };
  if (type) where.type = { equals: type };
  if (status) where.status = { equals: status };
  if (tag) where.tags = { contains: tag };

  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: 'posts',
    where,
    limit: 10,
    page,
    sort: sort === 'top' ? ['-pinned', '-votesCount'] : ['-pinned', '-createdAt'],
    depth: 1
  });

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = postSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }

  const { website, startedAt, boardId, boardSlug, appSlug, authorName, authorEmail, ...data } = parsed.data;

  if (website) {
    return NextResponse.json({ message: 'Bot detected' }, { status: 400 });
  }

  const startedTime = new Date(startedAt).getTime();
  if (Number.isNaN(startedTime) || Date.now() - startedTime < MIN_FILL_TIME_MS) {
    return NextResponse.json({ message: 'Please slow down and try again.' }, { status: 429 });
  }

  const payload = await getPayloadClient();

  let board = null;
  if (boardId) {
    board = await payload.findByID({ collection: 'boards', id: boardId, depth: 0 });
  } else if (boardSlug && appSlug) {
    const appResult = await payload.find({
      collection: 'apps',
      where: { slug: { equals: appSlug } },
      limit: 1
    });
    const app = appResult.docs[0];
    if (app) {
      const boardResult = await payload.find({
        collection: 'boards',
        where: { app: { equals: app.id }, slug: { equals: boardSlug }, isPublic: { equals: true } },
        limit: 1
      });
      board = boardResult.docs[0];
    }
  }

  if (!board || board.isPublic === false) {
    return NextResponse.json({ message: 'Board not found' }, { status: 404 });
  }

  const ipHash = hashIp(getRequestIp(request));
  const limiter = await rateLimit(`posts:${ipHash}`, 5, 60 * 60 * 1000);
  if (!limiter.success) {
    return NextResponse.json({ message: 'Rate limit exceeded' }, { status: 429 });
  }

  const existingFingerprint = request.cookies.get(FINGERPRINT_COOKIE)?.value ?? null;
  const fingerprint = createFingerprint(existingFingerprint);

  const { token, hash } = generateDeleteToken();
  const isAnonymous = !(authorName || authorEmail);

  const post = await payload.create({
    collection: 'posts',
    data: {
      board: board.id,
      title: data.title,
      body: data.body,
      type: data.type,
      authorName: authorName || undefined,
      authorEmail: authorEmail || undefined,
      isAnonymous,
      deleteTokenHash: hash
    },
    overrideAccess: true
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const response = NextResponse.json({
    post,
    deleteUrl: `${siteUrl}/p/${post.id}?token=${token}`
  });

  if (!existingFingerprint) {
    response.cookies.set(FINGERPRINT_COOKIE, fingerprint, fingerprintCookieOptions(process.env.NODE_ENV === 'production'));
  }

  return response;
}
