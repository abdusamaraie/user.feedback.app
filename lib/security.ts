import crypto from 'crypto';
import type { NextRequest } from 'next/server';

const SALT = process.env.HASH_SALT ?? 'dev-salt-change-me';

export function hashValue(value: string) {
  return crypto.createHash('sha256').update(`${SALT}:${value}`).digest('hex');
}

export function getRequestIp(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() ?? 'unknown';
  }
  return request.ip ?? 'unknown';
}

export function getFingerprint(request: NextRequest) {
  const cookie = request.cookies.get('fp');
  return cookie?.value ?? 'missing';
}
