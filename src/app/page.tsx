import Link from 'next/link';
import { getPayload } from '@/lib/payload';

export default async function HomePage() {
  const payload = await getPayload();
  const apps = await payload.find({ collection: 'apps', limit: 20 });

  return (
    <main className="container space-y-8 py-10">
      <section className="space-y-3">
        <p className="text-sm font-semibold uppercase text-brand-600">Feedback Board</p>
        <h1 className="text-4xl font-bold text-slate-900">Build better products with anonymous feedback.</h1>
        <p className="max-w-2xl text-lg text-slate-600">
          Collect ideas, bugs, and feature requests from your community. Visitors can submit feedback or upvote
          without creating accounts.
        </p>
        <div className="flex flex-wrap gap-3">
          {apps.docs.map((app) => (
            <Link
              key={app.id}
              href={`/${app.slug}`}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold"
            >
              {app.name}
            </Link>
          ))}
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: 'Anonymous by design',
            description: 'No accounts required to submit or vote on ideas.'
          },
          {
            title: 'Moderation-ready',
            description: 'Admins triage posts, add tags, and pin important requests.'
          },
          {
            title: 'Built for teams',
            description: 'Support multiple mobile apps with separate boards.'
          }
        ].map((card) => (
          <div key={card.title} className="card p-4">
            <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
            <p className="text-sm text-slate-600">{card.description}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
