import { Admin } from '@payloadcms/next/admin';
import config from '@/payload.config';

export const runtime = 'nodejs';

export default function AdminPage() {
  return <Admin config={config} />;
}
