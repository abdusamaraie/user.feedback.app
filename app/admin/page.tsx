import { prisma } from '@/lib/prisma';
import AdminClient from './AdminClient';

export default async function AdminPage() {
  const boards = await prisma.board.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      feedback: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  return (
    <main className="container space-y-6 py-10">
      <AdminClient boards={boards} />
    </main>
  );
}
