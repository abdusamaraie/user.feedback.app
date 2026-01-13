import crypto from 'crypto';
import type { NextRequest } from 'next/server';

const IP_SALT = process.env.IP_HASH_SALT ?? 'dev-ip-salt';

export function hashIp(ip: string) {
  return crypto.createHash('sha256').update(`${IP_SALT}:${ip}`).digest('hex');
}

export function getRequestIp(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() ?? 'unknown';
  }
  return request.ip ?? 'unknown';
}

export function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}
