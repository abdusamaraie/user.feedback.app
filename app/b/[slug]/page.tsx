import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { formatRelative } from '@/lib/time';
import { hashValue } from '@/lib/security';
import { MoodBadge } from '@/components/MoodBadge';
import { StatusBadge } from '@/components/StatusBadge';
import { UpvoteButton } from '@/components/UpvoteButton';

const PAGE_SIZE = 10;

export default async function BoardPage({
  params,
  searchParams
}: {
  params: { slug: string };
  searchParams: { q?: string; sort?: string; page?: string };
}) {
  const board = await prisma.board.findUnique({
    where: { slug: params.slug }
  });

  if (!board) {
    return notFound();
  }

  const page = Number(searchParams.page ?? '1');
  const query = searchParams.q?.trim();
  const sort = searchParams.sort === 'top' ? 'top' : 'new';

  const where = {
    boardId: board.id,
    isHidden: false,
    ...(query
      ? {
          OR: [
            { title: { contains: query, mode: 'insensitive' as const } },
            { body: { contains: query, mode: 'insensitive' as const } }
          ]
        }
      : {})
  };

  const [items, totalCount] = await Promise.all([
    prisma.feedback.findMany({
      where,
      orderBy: sort === 'top' ? { upvoteCount: 'desc' } : { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE
    }),
    prisma.feedback.count({ where })
  ]);

  const cookie = cookies().get('fp');
  const voterHash = cookie ? hashValue(cookie.value) : null;
  const upvotes = voterHash
    ? await prisma.upvote.findMany({
        where: { voterHash, feedbackId: { in: items.map((item) => item.id) } },
        select: { feedbackId: true }
      })
    : [];

  const upvotedSet = new Set(upvotes.map((upvote) => upvote.feedbackId));
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <main className="container space-y-8 py-10">
      <section className="card space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">{board.name}</h1>
            <p className="text-sm text-slate-600">{board.description}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {board.appStoreUrl && (
              <Link className="button-outline" href={board.appStoreUrl} target="_blank">
                App Store
              </Link>
            )}
            {board.playStoreUrl && (
              <Link className="button-outline" href={board.playStoreUrl} target="_blank">
                Google Play
              </Link>
            )}
            <Link className="button" href={`/b/${board.slug}/new`}>
              Submit feedback
            </Link>
          </div>
        </div>
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
          <div className="font-medium text-slate-700">Embed snippet</div>
          <p className="mt-1">Link: {`https://yourapp.com/b/${board.slug}`}</p>
          <p>{`<a href="https://yourapp.com/b/${board.slug}">Give Feedback</a>`}</p>
        </div>
      </section>

      <section className="card space-y-4">
        <form className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            className="input"
            name="q"
            placeholder="Search feedback"
            defaultValue={query}
          />
          <select className="input sm:w-48" name="sort" defaultValue={sort}>
            <option value="top">Top</option>
            <option value="new">Newest</option>
          </select>
          <button className="button w-full sm:w-auto" type="submit">
            Apply
          </button>
        </form>

        <div className="space-y-4">
          {items.map((item) => (
            <article key={item.id} className="flex gap-4 rounded-lg border border-slate-200 p-4">
              <UpvoteButton
                feedbackId={item.id}
                initialCount={item.upvoteCount}
                initiallyUpvoted={upvotedSet.has(item.id)}
              />
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold">{item.title}</h3>
                  <MoodBadge mood={item.mood} />
                  <StatusBadge status={item.status} />
                </div>
                <p className="text-sm text-slate-600">
                  {item.body.length > 160 ? `${item.body.slice(0, 160)}...` : item.body}
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                  <span>{formatRelative(item.createdAt)}</span>
                  {item.platform && <span>Platform: {item.platform}</span>}
                  {item.appVersion && <span>Version: {item.appVersion}</span>}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                className="button-outline"
                href={{
                  pathname: `/b/${board.slug}`,
                  query: { q: query, sort, page: page - 1 }
                }}
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                className="button-outline"
                href={{
                  pathname: `/b/${board.slug}`,
                  query: { q: query, sort, page: page + 1 }
                }}
              >
                Next
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
