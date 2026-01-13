import { AdminRouter } from '@payloadcms/next/rsc';
import configPromise from '@/payload.config';

export const runtime = 'nodejs';

export default function AdminPage({
  params,
  searchParams
}: {
  params: { segments?: string[] };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  return <AdminRouter config={configPromise} params={params} searchParams={searchParams} />;
}
