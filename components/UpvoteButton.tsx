'use client';

import { useState, useTransition } from 'react';
import { cn } from '@/lib/cn';

type Props = {
  postId: string;
  initialCount: number;
  initiallyUpvoted: boolean;
};

export function UpvoteButton({ postId, initialCount, initiallyUpvoted }: Props) {
  const [isPending, startTransition] = useTransition();
  const [count, setCount] = useState(initialCount);
  const [hasUpvoted, setHasUpvoted] = useState(initiallyUpvoted);

  async function handleUpvote() {
    if (hasUpvoted) return;
    startTransition(async () => {
      const response = await fetch('/api/public/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId })
      });

      if (response.status === 409) {
        setHasUpvoted(true);
        return;
      }

      if (response.ok) {
        const data = await response.json().catch(() => null);
        if (typeof data?.votesCount === 'number') {
          setCount(data.votesCount);
        } else {
          setCount((value) => value + 1);
        }
        setHasUpvoted(true);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleUpvote}
      disabled={isPending || hasUpvoted}
      className={cn(
        'flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium',
        hasUpvoted
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
      )}
    >
      <span>{hasUpvoted ? 'Upvoted' : 'Upvote'}</span>
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">{count}</span>
    </button>
  );
}
