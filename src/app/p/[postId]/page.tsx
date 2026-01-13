import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPayload } from '@/lib/payload';
import { StatusPill } from '@/components/StatusPill';
import { TagPill } from '@/components/TagPill';
import { VoteButton } from '@/components/VoteButton';
import { DeletePostButton } from '@/components/DeletePostButton';

export default async function PostPage({
  params,
  searchParams
}: {
  params: { postId: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const payload = await getPayload();
  const post = await payload.findByID({ collection: 'posts', id: params.postId, depth: 1 });
  if (!post) {
    notFound();
  }

  const board = await payload.findByID({ collection: 'boards', id: post.board });
  const app = board ? await payload.findByID({ collection: 'apps', id: board.app }) : null;
  const deleteToken = typeof searchParams.token === 'string' ? searchParams.token : '';

  return (
    <main className="container space-y-6 py-10">
      {app && board ? (
        <Link href={`/${app.slug}/${board.slug}`} className="text-sm font-semibold text-slate-500">
          ← Back to board
        </Link>
      ) : null}
      <div className="card space-y-4 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill status={post.status} />
          <span className="text-xs font-semibold uppercase text-slate-400">{post.type}</span>
          {post.pinned ? (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">Pinned</span>
          ) : null}
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{post.title}</h1>
        <p className="text-slate-700">{post.body}</p>
        <div className="flex flex-wrap gap-2">
          {post.tags?.map((tag: any) => (
            <TagPill key={tag.id} name={tag.name} color={tag.color} />
          ))}
        </div>
        <VoteButton postId={post.id} initialVotes={post.votesCount || 0} />
      </div>

      {deleteToken ? (
        <div className="card p-4">
          <h2 className="text-lg font-semibold text-slate-900">Delete this post</h2>
          <p className="text-sm text-slate-600">
            Use this tokenized link to remove your feedback. This link is only shown after submission.
          </p>
          <div className="mt-3">
            <DeletePostButton postId={post.id} token={deleteToken} />
          </div>
        </div>
      ) : null}
    </main>
  );
}
