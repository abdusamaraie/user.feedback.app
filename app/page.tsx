import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="container space-y-10 py-12">
      <section className="card space-y-4">
        <h1 className="text-3xl font-semibold">Feedback Board</h1>
        <p className="text-sm text-slate-600">
          A lightweight, anonymous feedback board powered by Payload CMS. Collect ideas, triage
          them, and keep users in the loop.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link className="button" href="/shuur">
            View Shuur boards
          </Link>
          <Link className="button-outline" href="/admin">
            Admin dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
