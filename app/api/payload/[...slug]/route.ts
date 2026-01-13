import { handleRequest } from '@payloadcms/next/handlers';
import config from '@/payload.config';

export const runtime = 'nodejs';

export const GET = handleRequest({ config });
export const POST = handleRequest({ config });
export const PATCH = handleRequest({ config });
export const DELETE = handleRequest({ config });
