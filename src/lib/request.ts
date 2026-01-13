import { headers } from 'next/headers';

export function getClientIp() {
  const header = headers();
  const forwarded = header.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim();
  }
  return header.get('x-real-ip') || undefined;
}
