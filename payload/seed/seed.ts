import type { Payload } from 'payload';

export async function seed(payload: Payload) {
  const existingApp = await payload.find({
    collection: 'apps',
    where: { slug: { equals: 'shuur' } },
    limit: 1
  });

  if (existingApp.docs.length > 0) return;

  const app = await payload.create({
    collection: 'apps',
    data: {
      name: 'Shuur',
      slug: 'shuur',
      description: 'Share feedback to shape the Shuur mobile experience.'
    },
    overrideAccess: true
  });

  const board = await payload.create({
    collection: 'boards',
    data: {
      app: app.id,
      name: 'General Feedback',
      slug: 'general',
      isPublic: true,
      description: 'Tell us what you think about the latest release.'
    },
    overrideAccess: true
  });

  const tag = await payload.create({
    collection: 'tags',
    data: {
      name: 'Onboarding',
      slug: 'onboarding',
      color: '#6366F1'
    },
    overrideAccess: true
  });

  await payload.create({
    collection: 'posts',
    data: {
      board: board.id,
      title: 'Add dark mode support',
      body: 'Please add a dark theme option for night-time usage.',
      type: 'feature',
      status: 'open',
      tags: [tag.id],
      pinned: true,
      votesCount: 3,
      deleteTokenHash: 'seeded'
    },
    overrideAccess: true
  });

  await payload.create({
    collection: 'posts',
    data: {
      board: board.id,
      title: 'Improve search speed',
      body: 'Search feels slow on large lists. Can we cache results?',
      type: 'idea',
      status: 'planned',
      votesCount: 1,
      deleteTokenHash: 'seeded'
    },
    overrideAccess: true
  });
}
