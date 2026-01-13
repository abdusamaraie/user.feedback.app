import crypto from 'crypto';

export function hashIp(ip: string | null | undefined) {
  if (!ip) return undefined;
  const salt = process.env.IP_HASH_SALT || 'dev-salt';
  return crypto.createHash('sha256').update(`${ip}:${salt}`).digest('hex');
}
