import crypto from 'crypto';

export function generateDeleteToken() {
  const token = crypto.randomBytes(32).toString('hex');
  return token;
}

export function hashDeleteToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function verifyDeleteToken(token: string, hash: string) {
  return hashDeleteToken(token) === hash;
}
