import { describe, expect, it } from 'vitest';
import { generateDeleteToken, verifyDeleteToken } from '@/lib/delete-token';

describe('delete token helpers', () => {
  it('generates a token and verifies it', () => {
    const { token, hash } = generateDeleteToken();
    expect(token.length).toBeGreaterThan(10);
    expect(verifyDeleteToken(token, hash)).toBe(true);
  });

  it('fails verification for mismatched tokens', () => {
    const { hash } = generateDeleteToken();
    expect(verifyDeleteToken('invalid', hash)).toBe(false);
  });
});
