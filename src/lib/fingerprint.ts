import { cookies } from 'next/headers';
import crypto from 'crypto';

const COOKIE_NAME = 'fb_fingerprint';
const ONE_YEAR = 60 * 60 * 24 * 365;

type CookieOptions = {
  name: string;
  value: string;
  httpOnly: boolean;
  sameSite: 'lax';
  secure: boolean;
  maxAge: number;
  path: string;
};

export function buildFingerprintCookie(value: string, isProduction: boolean): CookieOptions {
  return {
    name: COOKIE_NAME,
    value,
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    maxAge: ONE_YEAR,
    path: '/'
  };
}

export function getFingerprint() {
  return cookies().get(COOKIE_NAME)?.value;
}

export function ensureFingerprint() {
  const cookieStore = cookies();
  let fingerprint = cookieStore.get(COOKIE_NAME)?.value;

  if (!fingerprint) {
    fingerprint = crypto.randomUUID();
    cookieStore.set(buildFingerprintCookie(fingerprint, process.env.NODE_ENV === 'production'));
  }

  return fingerprint;
}

export const fingerprintCookieName = COOKIE_NAME;
