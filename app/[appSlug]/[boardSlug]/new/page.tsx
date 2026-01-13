'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function NewPostPage() {
  const params = useParams<{ appSlug: string; boardSlug: string }>();
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [deleteUrl, setDeleteUrl] = useState<string | null>(null);
  const startedAt = useMemo(() => new Date().toISOString(), []);

  useEffect(() => {
    fetch('/api/public/fingerprint', { method: 'POST' });
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('submitting');
    setError(null);
    setDeleteUrl(null);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch('/api/public/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, boardSlug: params.boardSlug, appSlug: params.appSlug })
    });

    if (response.ok) {
      const data = await response.json().catch(() => null);
      setDeleteUrl(data?.deleteUrl ?? null);
      setState('success');
      event.currentTarget.reset();
      return;
    }

    const data = await response.json().catch(() => null);
    setError(data?.message ?? 'Unable to submit feedback');
    setState('error');
  }

  return (
    <main className="container py-10">
      <div className="card space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Submit feedback</h1>
          <p className="text-sm text-slate-600">
            Share your idea anonymously. You can optionally leave your name or email.
          </p>
        </div>

        {state === 'success' ? (
          <div className="space-y-3">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              Thanks! Your feedback has been received.
            </div>
            {deleteUrl && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                Save this private delete link (shown once):
                <p className="mt-1 break-all text-slate-800">{deleteUrl}</p>
              </div>
            )}
            <Link className="button-outline" href={`/${params.appSlug}/${params.boardSlug}`}>
              Back to board
            </Link>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input type="hidden" name="startedAt" value={startedAt} />
            <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

            <div>
              <label className="text-sm font-medium">Title</label>
              <input className="input mt-1" name="title" maxLength={120} required />
            </div>

            <div>
              <label className="text-sm font-medium">Details</label>
              <textarea className="textarea mt-1" name="body" maxLength={2000} rows={6} required />
            </div>

            <div>
              <label className="text-sm font-medium">Type</label>
              <select className="input mt-1" name="type" required>
                <option value="feature">Feature</option>
                <option value="bug">Bug</option>
                <option value="idea">Idea</option>
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Your name (optional)</label>
                <input className="input mt-1" name="authorName" maxLength={80} />
              </div>
              <div>
                <label className="text-sm font-medium">Your email (optional)</label>
                <input className="input mt-1" name="authorEmail" type="email" />
              </div>
            </div>

            {error && <p className="text-sm text-rose-600">{error}</p>}

            <div className="flex flex-wrap gap-3">
              <button className="button" type="submit" disabled={state === 'submitting'}>
                {state === 'submitting' ? 'Submitting...' : 'Submit feedback'}
              </button>
              <Link className="button-outline" href={`/${params.appSlug}/${params.boardSlug}`}>
                Back to board
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
