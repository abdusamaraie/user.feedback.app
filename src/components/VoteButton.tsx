'use client';

import { useState } from 'react';

export function VoteButton({ postId, initialVotes }: { postId: string; initialVotes: number }) {
  const [votes, setVotes] = useState(initialVotes);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVote = async () => {
    if (loading || voted) return;
    setLoading(true);
    try {
      const res = await fetch('/api/public/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId })
      });

      const data = await res.json();
      if (res.ok || res.status === 409) {
        setVotes(data.votesCount ?? votes);
        setVoted(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleVote}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
        voted ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-700'
      }`}
      disabled={loading}
    >
      <span>{voted ? 'Upvoted' : 'Upvote'}</span>
      <span className="rounded-full bg-slate-900 px-2 py-0.5 text-xs font-bold text-white">
        {votes}
      </span>
    </button>
  );
}
