import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPayload } from '@/lib/payload';
import { PostCard } from '@/components/PostCard';

const sortOptions = [
  { label: 'Top', value: 'top' },
  { label: 'New', value: 'new' }
];

export default async function BoardPage({
  params,
  searchParams
}: {
  params: { appSlug: string; boardSlug: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const payload = await getPayload();
  const apps = await payload.find({
    collection: 'apps',
    where: { slug: { equals: params.appSlug } },
    limit: 1
  });
  const app = apps.docs[0];
  if (!app) {
    notFound();
  }

  const boards = await payload.find({
    collection: 'boards',
    where: {
      app: { equals: app.id },
      slug: { equals: params.boardSlug }
    },
    limit: 1
  });
  const board = boards.docs[0];
  if (!board) {
    notFound();
  }

  const selectedSort = typeof searchParams.sort === 'string' ? searchParams.sort : 'top';
  const selectedType = typeof searchParams.type === 'string' ? searchParams.type : '';
  const selectedStatus = typeof searchParams.status === 'string' ? searchParams.status : '';
  const selectedTag = typeof searchParams.tag === 'string' ? searchParams.tag : '';

  const where: Record<string, unknown> = {
    board: { equals: board.id }
  };

  if (selectedType) {
    where.type = { equals: selectedType };
  }
  if (selectedStatus) {
    where.status = { equals: selectedStatus };
  }
  if (selectedTag) {
    where.tags = { contains: selectedTag };
  }

  const posts = await payload.find({
    collection: 'posts',
    where,
    depth: 1,
    sort: ['-pinned', selectedSort === 'top' ? '-votesCount' : '-createdAt'],
    limit: 50
  });

  const tags = await payload.find({
    collection: 'tags',
    sort: 'name',
    limit: 100
  });

  return (
    <main className="container space-y-6 py-10">
      <div className="space-y-3">
        <Link href={`/${app.slug}`} className="text-sm font-semibold text-slate-500">
          ← {app.name}
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{board.name}</h1>
            <p className="text-slate-600">{board.description}</p>
          </div>
          <Link
            href={`/${app.slug}/${board.slug}/new`}
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Submit feedback
          </Link>
        </div>
      </div>

      <section className="card p-4">
        <form className="grid gap-4 md:grid-cols-4" method="get">
          <label className="text-sm font-semibold">
            Sort
            <select name="sort" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2" defaultValue={selectedSort}>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold">
            Type
            <select name="type" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2" defaultValue={selectedType}>
              <option value="">All</option>
              <option value="feature">Feature</option>
              <option value="bug">Bug</option>
              <option value="idea">Idea</option>
            </select>
          </label>
          <label className="text-sm font-semibold">
            Status
            <select name="status" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2" defaultValue={selectedStatus}>
              <option value="">All</option>
              <option value="open">Open</option>
              <option value="planned">Planned</option>
              <option value="in_progress">In progress</option>
              <option value="done">Done</option>
              <option value="closed">Closed</option>
            </select>
          </label>
          <label className="text-sm font-semibold">
            Tag
            <select name="tag" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2" defaultValue={selectedTag}>
              <option value="">All</option>
              {tags.docs.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </label>
          <div className="md:col-span-4">
            <button type="submit" className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold">
              Apply filters
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        {posts.docs.length === 0 ? (
          <div className="card p-6 text-center text-sm text-slate-600">No feedback yet. Be the first!</div>
        ) : (
          posts.docs.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </section>
    </main>
  );
}
