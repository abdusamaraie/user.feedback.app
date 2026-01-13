import Link from 'next/link';
import { StatusPill } from '@/components/StatusPill';
import { TagPill } from '@/components/TagPill';
import { VoteButton } from '@/components/VoteButton';

export function PostCard({ post }: { post: any }) {
  return (
    <div className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          {post.pinned ? (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
              Pinned
            </span>
          ) : null}
          <StatusPill status={post.status} />
          <span className="text-xs font-semibold uppercase text-slate-400">{post.type}</span>
        </div>
        <Link href={`/p/${post.id}`} className="text-lg font-semibold text-slate-900">
          {post.title}
        </Link>
        <p className="text-sm text-slate-600">{post.body}</p>
        <div className="flex flex-wrap gap-2">
          {post.tags?.map((tag: any) => (
            <TagPill key={tag.id} name={tag.name} color={tag.color} />
          ))}
        </div>
      </div>
      <VoteButton postId={post.id} initialVotes={post.votesCount || 0} />
    </div>
  );
}
