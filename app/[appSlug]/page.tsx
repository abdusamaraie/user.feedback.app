import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPayloadClient } from '@/lib/payload';

export default async function AppBoardsPage({ params }: { params: { appSlug: string } }) {
  const payload = await getPayloadClient();
  const appResult = await payload.find({
    collection: 'apps',
    where: { slug: { equals: params.appSlug } },
    limit: 1
  });

  const app = appResult.docs[0];
  if (!app) return notFound();

  const boards = await payload.find({
    collection: 'boards',
    where: {
      app: { equals: app.id },
      isPublic: { equals: true }
    },
    limit: 20,
    sort: ['name']
  });

  return (
    <main className="container space-y-8 py-10">
      <section className="card space-y-2">
        <h1 className="text-2xl font-semibold">{app.name}</h1>
        {app.description && <p className="text-sm text-slate-600">{app.description}</p>}
        <div className="flex flex-wrap gap-2 text-xs">
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
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {boards.docs.map((board) => (
          <Link
            key={board.id}
            href={`/${app.slug}/${board.slug}`}
            className="card space-y-2 hover:border-slate-300"
          >
            <h2 className="text-lg font-semibold">{board.name}</h2>
            <p className="text-sm text-slate-600">{board.description ?? 'Share feedback.'}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
