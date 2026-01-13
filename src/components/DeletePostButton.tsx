'use client';

import { useState } from 'react';

export function DeletePostButton({ postId, token }: { postId: string; token: string }) {
  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (loading) return;
    setLoading(true);
    setError('');
    const res = await fetch('/api/public/posts/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, token })
    });

    if (res.ok) {
      setDeleted(true);
    } else {
      setError('Unable to delete. Check your token.');
    }

    setLoading(false);
  };

  if (deleted) {
    return <p className="text-sm text-emerald-600">Post deleted.</p>;
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleDelete}
        className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700"
        disabled={loading}
      >
        Delete my post
      </button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
