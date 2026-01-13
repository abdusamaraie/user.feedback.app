import { generateToken, hashToken } from './security';

export function generateDeleteToken() {
  const token = generateToken(32);
  return { token, hash: hashToken(token) };
}

export function verifyDeleteToken(token: string, hash: string) {
  return hashToken(token) === hash;
}
