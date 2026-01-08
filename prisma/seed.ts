import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const board = await prisma.board.upsert({
    where: { slug: 'launch-v1' },
    update: {},
    create: {
      slug: 'launch-v1',
      name: 'Launch v1 Feedback',
      description: 'Share feedback on the latest release of our mobile app.',
      appStoreUrl: 'https://apps.apple.com',
      playStoreUrl: 'https://play.google.com'
    }
  });

  await prisma.feedback.createMany({
    data: [
      {
        boardId: board.id,
        title: 'Love the onboarding flow',
        body: 'The new onboarding is smooth, but I would love a skip option.',
        mood: 'happy',
        status: 'idea',
        platform: 'ios',
        appVersion: '1.0.0'
      },
      {
        boardId: board.id,
        title: 'Search needs filters',
        body: 'Search results are good but it would help to filter by category.',
        mood: 'neutral',
        status: 'planned',
        platform: 'android',
        appVersion: '1.0.0'
      }
    ]
  });
}

main()
  .catch(async (error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
