import { describe, expect, it } from 'vitest';
import { createFingerprint, fingerprintCookieOptions } from '@/lib/fingerprint';

describe('fingerprint helpers', () => {
  it('returns existing fingerprint when provided', () => {
    const existing = 'existing-id';
    expect(createFingerprint(existing)).toBe(existing);
  });

  it('creates cookie options with secure flag in production', () => {
    const options = fingerprintCookieOptions(true);
    expect(options.secure).toBe(true);
    expect(options.httpOnly).toBe(true);
  });
});
