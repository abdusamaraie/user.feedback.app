'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function NewFeedbackPage() {
  const params = useParams<{ slug: string }>();
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const startedAt = useMemo(() => new Date().toISOString(), []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('submitting');
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, boardSlug: params.slug })
    });

    if (response.ok) {
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
            Share your thoughts anonymously. We only use a fingerprint cookie to prevent spam.
          </p>
        </div>

        {state === 'success' ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            Thanks! Your feedback has been received.
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input type="hidden" name="startedAt" value={startedAt} />
            <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

            <div>
              <label className="text-sm font-medium">Title</label>
              <input className="input mt-1" name="title" maxLength={80} required />
            </div>

            <div>
              <label className="text-sm font-medium">Details</label>
              <textarea className="textarea mt-1" name="body" maxLength={1000} rows={5} required />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Mood</label>
                <select className="input mt-1" name="mood" required>
                  <option value="happy">Happy</option>
                  <option value="neutral">Neutral</option>
                  <option value="sad">Sad</option>
                  <option value="angry">Angry</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Platform</label>
                <select className="input mt-1" name="platform">
                  <option value="">Select</option>
                  <option value="ios">iOS</option>
                  <option value="android">Android</option>
                  <option value="web">Web</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">App version (optional)</label>
              <input className="input mt-1" name="appVersion" maxLength={30} />
            </div>

            {error && <p className="text-sm text-rose-600">{error}</p>}

            <div className="flex flex-wrap gap-3">
              <button className="button" type="submit" disabled={state === 'submitting'}>
                {state === 'submitting' ? 'Submitting...' : 'Submit feedback'}
              </button>
              <Link className="button-outline" href={`/b/${params.slug}`}>
                Back to board
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
