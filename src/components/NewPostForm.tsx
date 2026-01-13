'use client';

import { useState } from 'react';
import { z } from 'zod';
import { postSchema } from '@/lib/validation';

const clientSchema = postSchema.extend({
  boardId: z.string().min(1)
});

export function NewPostForm({ boardId }: { boardId: string }) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [deleteLink, setDeleteLink] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('idle');
    setMessage('');

    const formData = new FormData(event.currentTarget);
    const payload = {
      boardId,
      title: String(formData.get('title') || ''),
      body: String(formData.get('body') || ''),
      type: String(formData.get('type') || 'feature'),
      authorName: String(formData.get('authorName') || ''),
      authorEmail: String(formData.get('authorEmail') || ''),
      honeypot: String(formData.get('company') || '')
    };

    const parsed = clientSchema.safeParse(payload);
    if (!parsed.success) {
      setStatus('error');
      setMessage('Please fill in the required fields with enough detail.');
      return;
    }

    const res = await fetch('/api/public/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data)
    });

    const data = await res.json();
    if (!res.ok) {
      setStatus('error');
      setMessage(data?.error || 'Something went wrong.');
      return;
    }

    setStatus('success');
    setDeleteLink(`/p/${data.post.id}?token=${data.deleteToken}`);
    event.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm font-semibold">
          Title
          <input
            name="title"
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            placeholder="Short summary"
            required
            maxLength={120}
          />
        </label>
        <label className="space-y-1 text-sm font-semibold">
          Type
          <select name="type" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2">
            <option value="feature">Feature request</option>
            <option value="bug">Bug</option>
            <option value="idea">Idea</option>
          </select>
        </label>
      </div>
      <label className="space-y-1 text-sm font-semibold">
        Details
        <textarea
          name="body"
          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
          rows={5}
          placeholder="Describe the problem or request..."
          required
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm font-semibold">
          Name (optional)
          <input name="authorName" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2" />
        </label>
        <label className="space-y-1 text-sm font-semibold">
          Email (optional)
          <input name="authorEmail" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2" type="email" />
        </label>
      </div>
      <div className="hidden">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <button
        type="submit"
        className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
      >
        Submit feedback
      </button>
      {status === 'error' ? <p className="text-sm text-red-600">{message}</p> : null}
      {status === 'success' ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          <p>Thanks! Your feedback was submitted.</p>
          {deleteLink ? (
            <p className="mt-1">
              Save this delete link (only shown once): <span className="break-all font-semibold">{deleteLink}</span>
            </p>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
