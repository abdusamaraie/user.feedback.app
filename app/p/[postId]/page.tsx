import Link from 'next/link';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { getPayloadClient } from '@/lib/payload';
import { FINGERPRINT_COOKIE } from '@/lib/fingerprint';
import { UpvoteButton } from '@/components/UpvoteButton';
import { Pill, statusTone, typeTone } from '@/components/Pills';
import { formatRelative } from '@/lib/time';
import { DeletePostButton } from '@/components/DeletePostButton';

export default async function PostDetailPage({
  params,
  searchParams
}: {
  params: { postId: string };
  searchParams: { token?: string };
}) {
  const payload = await getPayloadClient();
  const post = await payload.findByID({ collection: 'posts', id: params.postId, depth: 2 });
  if (!post) return notFound();

  const boardId = typeof post.board === 'string' ? post.board : post.board?.id;
  const board = boardId
    ? await payload.findByID({ collection: 'boards', id: boardId, depth: 1 })
    : null;

  const appId = board && typeof board.app !== 'string' ? board.app?.id : null;
  const app = appId ? await payload.findByID({ collection: 'apps', id: appId, depth: 0 }) : null;

  const fingerprint = cookies().get(FINGERPRINT_COOKIE)?.value;
  const voteDocs = fingerprint
    ? await payload.find({
        collection: 'votes',
        where: { fingerprint: { equals: fingerprint }, post: { equals: post.id } },
        limit: 1,
        depth: 0,
        overrideAccess: true
      })
    : { docs: [] };

  const hasVoted = voteDocs.docs.length > 0;

  return (
    <main className="container space-y-6 py-10">
      <section className="card space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          {app && board && (
            <Link href={`/${app.slug}/${board.slug}`} className="hover:text-slate-700">
              Back to board
            </Link>
          )}
          <span>{formatRelative(new Date(post.createdAt))}</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">{post.title}</h1>
          <div className="flex flex-wrap gap-2">
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
          </div>
          <p className="text-sm text-slate-600">{post.body}</p>
        </div>
        <UpvoteButton postId={post.id} initialCount={post.votesCount ?? 0} initiallyUpvoted={hasVoted} />
      </section>

      {searchParams.token && (
        <section className="card space-y-2">
          <h2 className="text-lg font-semibold">Manage this post</h2>
          <p className="text-sm text-slate-600">
            This delete link is private. You can remove your post at any time.
          </p>
          <DeletePostButton postId={post.id} token={searchParams.token} />
        </section>
      )}
    </main>
  );
}
