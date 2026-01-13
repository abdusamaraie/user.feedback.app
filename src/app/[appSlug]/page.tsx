import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPayload } from '@/lib/payload';

export default async function AppPage({ params }: { params: { appSlug: string } }) {
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
      isPublic: { equals: true }
    },
    sort: 'name'
  });

  return (
    <main className="container space-y-8 py-10">
      <div className="space-y-2">
        <Link href="/" className="text-sm font-semibold text-slate-500">
          ← All apps
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">{app.name}</h1>
        <p className="max-w-2xl text-slate-600">{app.description}</p>
        <div className="flex gap-3">
          {app.appStoreUrl ? (
            <a className="text-sm font-semibold text-brand-600" href={app.appStoreUrl}>
              App Store
            </a>
          ) : null}
          {app.playStoreUrl ? (
            <a className="text-sm font-semibold text-brand-600" href={app.playStoreUrl}>
              Play Store
            </a>
          ) : null}
        </div>
      </div>
      <section className="grid gap-4 md:grid-cols-2">
        {boards.docs.map((board) => (
          <Link
            key={board.id}
            href={`/${app.slug}/${board.slug}`}
            className="card block p-4 transition hover:border-brand-500"
          >
            <h2 className="text-lg font-semibold text-slate-900">{board.name}</h2>
            <p className="text-sm text-slate-600">{board.description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
