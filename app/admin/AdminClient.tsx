'use client';

import { useState } from 'react';

type Feedback = {
  id: string;
  title: string;
  status: string;
  isHidden: boolean;
  upvoteCount: number;
  mood: string;
};

type Board = {
  id: string;
  name: string;
  slug: string;
  description: string;
  appStoreUrl: string | null;
  playStoreUrl: string | null;
  feedback: Feedback[];
};

export default function AdminClient({ boards }: { boards: Board[] }) {
  const [message, setMessage] = useState<string | null>(null);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    // capture the form element synchronously — React's synthetic event is pooled and
    // will be null after an `await`, so we store a reference before using it later
    const form = event.currentTarget;

    const response = await fetch('/api/admin/boards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      setMessage('Board created. Refresh to see it in the list.');
      form.reset();
    } else {
      setMessage('Unable to create board.');
    }
  }

  async function updateStatus(feedbackId: string, status: string) {
    await fetch('/api/admin/feedback/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedbackId, status })
    });
  }

  async function updateHidden(feedbackId: string, isHidden: boolean) {
    await fetch('/api/admin/feedback/hide', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedbackId, isHidden })
    });
  }

  return (
    <div className="space-y-6">
      <section className="card space-y-4">
        <h1 className="text-2xl font-semibold">Admin dashboard</h1>
        <p className="text-sm text-slate-600">
          Create boards and moderate feedback. Use Basic Auth with ADMIN_PASSWORD.
        </p>
        {message && <p className="text-sm text-emerald-700">{message}</p>}
        <form className="grid gap-3 md:grid-cols-2" onSubmit={handleCreate}>
          <input className="input" name="name" placeholder="Board name" required />
          <input className="input" name="slug" placeholder="slug" required />
          <input className="input md:col-span-2" name="description" placeholder="Description" required />
          <input className="input" name="appStoreUrl" placeholder="App Store URL" />
          <input className="input" name="playStoreUrl" placeholder="Play Store URL" />
          <button className="button md:col-span-2" type="submit">
            Create board
          </button>
        </form>
      </section>

      {boards.map((board) => (
        <section key={board.id} className="card space-y-3">
          <div>
            <h2 className="text-xl font-semibold">{board.name}</h2>
            <p className="text-sm text-slate-600">/{board.slug}</p>
            <p className="text-sm text-slate-500">{board.description}</p>
          </div>
          <div className="text-xs text-slate-500">
            Total posts: {board.feedback.length} | Total upvotes:{' '}
            {board.feedback.reduce((sum, item) => sum + item.upvoteCount, 0)}
          </div>
          <div className="text-xs text-slate-500">
            Mood distribution:{' '}
            {['happy', 'neutral', 'sad', 'angry']
              .map((mood) => {
                const count = board.feedback.filter((item) => item.mood === mood).length;
                return `${mood}: ${count}`;
              })
              .join(' • ')}
          </div>
          <div className="space-y-2">
            {board.feedback.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-200 p-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-slate-500">Mood: {item.mood}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      className="input w-36 text-xs"
                      defaultValue={item.status}
                      onChange={(event) => updateStatus(item.id, event.target.value)}
                    >
                      <option value="idea">Idea</option>
                      <option value="planned">Planned</option>
                      <option value="in_progress">In progress</option>
                      <option value="shipped">Shipped</option>
                      <option value="closed">Closed</option>
                    </select>
                    <button
                      className="button-outline text-xs"
                      type="button"
                      onClick={() => updateHidden(item.id, !item.isHidden)}
                    >
                      {item.isHidden ? 'Unhide' : 'Hide'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
