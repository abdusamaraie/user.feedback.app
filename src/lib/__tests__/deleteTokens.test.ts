import { describe, expect, it } from 'vitest';
import { generateDeleteToken, hashDeleteToken, verifyDeleteToken } from '@/lib/deleteTokens';

describe('delete tokens', () => {
  it('hashes and verifies tokens', () => {
    const token = generateDeleteToken();
    const hash = hashDeleteToken(token);
    expect(hash).toHaveLength(64);
    expect(verifyDeleteToken(token, hash)).toBe(true);
    expect(verifyDeleteToken('wrong', hash)).toBe(false);
  });
});
