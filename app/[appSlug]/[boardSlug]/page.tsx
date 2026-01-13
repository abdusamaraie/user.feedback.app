import Link from 'next/link';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { getPayloadClient } from '@/lib/payload';
import { formatRelative } from '@/lib/time';
import { Pill, statusTone, typeTone } from '@/components/Pills';
import { UpvoteButton } from '@/components/UpvoteButton';
import { FINGERPRINT_COOKIE } from '@/lib/fingerprint';

const PAGE_SIZE = 10;

export default async function BoardPage({
  params,
  searchParams
}: {
  params: { appSlug: string; boardSlug: string };
  searchParams: { sort?: string; type?: string; status?: string; tag?: string; page?: string };
}) {
  const payload = await getPayloadClient();
  const appResult = await payload.find({
    collection: 'apps',
    where: { slug: { equals: params.appSlug } },
    limit: 1
  });
  const app = appResult.docs[0];
  if (!app) return notFound();

  const boardResult = await payload.find({
    collection: 'boards',
    where: {
      app: { equals: app.id },
      slug: { equals: params.boardSlug },
      isPublic: { equals: true }
    },
    limit: 1
  });
  const board = boardResult.docs[0];
  if (!board) return notFound();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  const page = Number(searchParams.page ?? '1');
  const sort = searchParams.sort === 'top' ? 'top' : 'new';

  const where: Record<string, unknown> = {
    board: { equals: board.id }
  };
  if (searchParams.type) {
    where.type = { equals: searchParams.type };
  }
  if (searchParams.status) {
    where.status = { equals: searchParams.status };
  }
  if (searchParams.tag) {
    where.tags = { contains: searchParams.tag };
  }

  const posts = await payload.find({
    collection: 'posts',
    where,
    limit: PAGE_SIZE,
    page,
    sort: sort === 'top' ? ['-pinned', '-votesCount'] : ['-pinned', '-createdAt'],
    depth: 1
  });

  const fingerprint = cookies().get(FINGERPRINT_COOKIE)?.value;
  const voteDocs = fingerprint
    ? await payload.find({
        collection: 'votes',
        where: { fingerprint: { equals: fingerprint }, post: { in: posts.docs.map((doc) => doc.id) } },
        limit: 200,
        depth: 0,
        overrideAccess: true
      })
    : { docs: [] };

  const voteSet = new Set(voteDocs.docs.map((vote) => String(vote.post)));

  return (
    <main className="container space-y-8 py-10">
      <section className="card space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">{board.name}</h1>
            <p className="text-sm text-slate-600">{board.description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {app.appStoreUrl && (
              <Link className="button-outline" href={app.appStoreUrl} target="_blank">
                App Store
              </Link>
            )}
            {app.playStoreUrl && (
              <Link className="button-outline" href={app.playStoreUrl} target="_blank">
                Google Play
              </Link>
            )}
            <Link className="button" href={`/${app.slug}/${board.slug}/new`}>
              Submit feedback
            </Link>
          </div>
        </div>
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
          <div className="font-medium text-slate-700">Embed snippet</div>
          <p className="mt-1">Link: {`${siteUrl}/${app.slug}/${board.slug}`}</p>
          <p>{`<a href=\"${siteUrl}/${app.slug}/${board.slug}\">Give Feedback</a>`}</p>
        </div>
      </section>

      <section className="card space-y-4">
        <form className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select className="input sm:w-40" name="sort" defaultValue={sort}>
            <option value="top">Top</option>
            <option value="new">Newest</option>
          </select>
          <select className="input sm:w-40" name="type" defaultValue={searchParams.type ?? ''}>
            <option value="">All types</option>
            <option value="feature">Feature</option>
            <option value="bug">Bug</option>
            <option value="idea">Idea</option>
          </select>
          <select className="input sm:w-40" name="status" defaultValue={searchParams.status ?? ''}>
            <option value="">All status</option>
            <option value="open">Open</option>
            <option value="planned">Planned</option>
            <option value="in_progress">In progress</option>
            <option value="done">Done</option>
            <option value="closed">Closed</option>
          </select>
          <input
            className="input sm:w-48"
            name="tag"
            placeholder="Tag slug"
            defaultValue={searchParams.tag ?? ''}
          />
          <button className="button w-full sm:w-auto" type="submit">
            Apply
          </button>
        </form>

        <div className="space-y-4">
          {posts.docs.map((post) => (
            <article key={post.id} className="card border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <Link href={`/p/${post.id}`} className="text-base font-semibold text-slate-900">
                    {post.title}
                  </Link>
                  <p className="text-sm text-slate-600">
                    {post.body.length > 180 ? `${post.body.slice(0, 180)}...` : post.body}
                  </p>
                </div>
                <UpvoteButton
                  postId={post.id}
                  initialCount={post.votesCount ?? 0}
                  initiallyUpvoted={voteSet.has(post.id)}
                />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <Pill label={post.type} tone={typeTone(post.type)} />
                <Pill label={post.status.replace('_', ' ')} tone={statusTone(post.status)} />
                {post.pinned && <Pill label="Pinned" tone="amber" />}
                {Array.isArray(post.tags) &&
                  post.tags.map((tag) =>
                    typeof tag === 'string' ? (
                      <Pill key={tag} label={tag} />
                    ) : (
                      <Pill key={tag.id} label={tag.name} />
                    )
                  )}
                <span>{formatRelative(new Date(post.createdAt))}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>
            Page {posts.page} of {posts.totalPages}
          </span>
          <div className="flex gap-2">
            {posts.hasPrevPage && (
              <Link
                className="button-outline"
                href={{
                  pathname: `/${app.slug}/${board.slug}`,
                  query: { ...searchParams, page: posts.page - 1 }
                }}
              >
                Previous
              </Link>
            )}
            {posts.hasNextPage && (
              <Link
                className="button-outline"
                href={{
                  pathname: `/${app.slug}/${board.slug}`,
                  query: { ...searchParams, page: posts.page + 1 }
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
