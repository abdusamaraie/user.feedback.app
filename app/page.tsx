import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="container py-16">
      <div className="card space-y-4">
        <h1 className="text-2xl font-semibold">Feedback Board MVP</h1>
        <p className="text-sm text-slate-600">
          Create a board for each release and share it with your users. Anonymous feedback, mood
          tags, and lightweight moderation.
        </p>
        <Link className="button w-fit" href="/b/launch-v1">
          Visit sample board
        </Link>
      </div>
    </main>
  );
}
