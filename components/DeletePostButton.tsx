'use client';

import { useState } from 'react';

export function DeletePostButton({ postId, token }: { postId: string; token: string }) {
  const [state, setState] = useState<'idle' | 'deleting' | 'deleted' | 'error'>('idle');

  async function handleDelete() {
    setState('deleting');
    const response = await fetch('/api/public/posts/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, token })
    });

    if (response.ok) {
      setState('deleted');
      return;
    }

    setState('error');
  }

  if (state === 'deleted') {
    return <p className="text-sm text-emerald-600">Post deleted.</p>;
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={state === 'deleting'}
      className="button-outline"
    >
      {state === 'deleting' ? 'Deleting...' : 'Delete post'}
    </button>
  );
}
