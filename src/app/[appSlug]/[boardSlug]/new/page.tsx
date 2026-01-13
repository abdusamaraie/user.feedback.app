import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPayload } from '@/lib/payload';
import { NewPostForm } from '@/components/NewPostForm';

export default async function NewPostPage({ params }: { params: { appSlug: string; boardSlug: string } }) {
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
    where: { app: { equals: app.id }, slug: { equals: params.boardSlug } },
    limit: 1
  });
  const board = boards.docs[0];
  if (!board) {
    notFound();
  }

  return (
    <main className="container space-y-6 py-10">
      <Link href={`/${app.slug}/${board.slug}`} className="text-sm font-semibold text-slate-500">
        ← Back to board
      </Link>
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-slate-900">Submit feedback</h1>
        <p className="text-sm text-slate-600">Share ideas, bugs, or requests anonymously.</p>
        <div className="mt-6">
          <NewPostForm boardId={board.id} />
        </div>
      </div>
    </main>
  );
}
