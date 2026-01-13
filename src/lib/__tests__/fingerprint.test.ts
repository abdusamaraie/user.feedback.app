import { describe, expect, it } from 'vitest';
import { buildFingerprintCookie } from '@/lib/fingerprint';

describe('fingerprint cookies', () => {
  it('builds a httpOnly fingerprint cookie with one-year maxAge', () => {
    const cookie = buildFingerprintCookie('test-id', true);
    expect(cookie.name).toBe('fb_fingerprint');
    expect(cookie.value).toBe('test-id');
    expect(cookie.httpOnly).toBe(true);
    expect(cookie.sameSite).toBe('lax');
    expect(cookie.secure).toBe(true);
    expect(cookie.maxAge).toBe(60 * 60 * 24 * 365);
    expect(cookie.path).toBe('/');
  });
});
