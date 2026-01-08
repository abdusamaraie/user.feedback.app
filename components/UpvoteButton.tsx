'use client';

import { useState, useTransition } from 'react';
import { cn } from '@/lib/cn';

type Props = {
  feedbackId: string;
  initialCount: number;
  initiallyUpvoted: boolean;
};

export function UpvoteButton({ feedbackId, initialCount, initiallyUpvoted }: Props) {
  const [isPending, startTransition] = useTransition();
  const [count, setCount] = useState(initialCount);
  const [hasUpvoted, setHasUpvoted] = useState(initiallyUpvoted);

  async function handleUpvote() {
    if (hasUpvoted) return;
    startTransition(async () => {
      const response = await fetch('/api/upvote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedbackId })
      });

      if (response.ok) {
        const data = await response.json().catch(() => null);
        if (data?.message === 'Already upvoted') {
          setHasUpvoted(true);
          return;
        }
        setCount((value) => value + 1);
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
        'flex w-12 flex-col items-center rounded-lg border px-2 py-1 text-xs font-medium',
        hasUpvoted ? 'border-slate-400 bg-slate-100 text-slate-700' : 'border-slate-200 text-slate-600'
      )}
    >
      <span>▲</span>
      <span>{count}</span>
    </button>
  );
}
