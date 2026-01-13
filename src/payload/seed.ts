import type { Payload } from 'payload';
import { hashDeleteToken } from '../lib/deleteTokens';

export async function seed(payload: Payload) {
  const existingApps = await payload.find({ collection: 'apps', limit: 1 });
  if (existingApps.totalDocs > 0) {
    return;
  }

  const app = await payload.create({
    collection: 'apps',
    data: {
      name: 'Shuur',
      slug: 'shuur',
      description: 'Minimalist habit tracker for busy founders.',
      appStoreUrl: 'https://apps.apple.com',
      playStoreUrl: 'https://play.google.com'
    }
  });

  const board = await payload.create({
    collection: 'boards',
    data: {
      name: 'General Feedback',
      slug: 'general',
      app: app.id,
      description: 'Share ideas, bugs, and improvements.'
    }
  });

  const tagFast = await payload.create({
    collection: 'tags',
    data: {
      name: 'Performance',
      slug: 'performance',
      color: '#22c55e'
    }
  });

  const tagDesign = await payload.create({
    collection: 'tags',
    data: {
      name: 'Design',
      slug: 'design',
      color: '#a855f7'
    }
  });

  await payload.create({
    collection: 'posts',
    data: {
      board: board.id,
      title: 'Offline mode for daily check-ins',
      body: 'Let us log habits without connectivity and sync later.',
      type: 'feature',
      status: 'open',
      tags: [tagFast.id],
      pinned: true,
      votesCount: 12,
      isAnonymous: true,
      deleteTokenHash: hashDeleteToken('seed-token-1')
    }
  });

  await payload.create({
    collection: 'posts',
    data: {
      board: board.id,
      title: 'Widget for daily streaks',
      body: 'A home screen widget would keep Shuur top of mind.',
      type: 'idea',
      status: 'planned',
      tags: [tagDesign.id],
      pinned: false,
      votesCount: 7,
      isAnonymous: true,
      deleteTokenHash: hashDeleteToken('seed-token-2')
    }
  });
}
