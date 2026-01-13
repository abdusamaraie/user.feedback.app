import crypto from 'crypto';

export const FINGERPRINT_COOKIE = 'fb_fingerprint';

export function createFingerprint(existing?: string | null) {
  return existing ?? crypto.randomUUID();
}

export function fingerprintCookieOptions(isProduction: boolean) {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 365
  };
}
