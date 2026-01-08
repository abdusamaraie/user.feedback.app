import { describe, expect, it } from 'vitest';
import { isUniqueConstraintError } from '@/lib/prisma-errors';

describe('prisma error helpers', () => {
  it('detects unique constraint errors', () => {
    const error = { code: 'P2002' };
    expect(isUniqueConstraintError(error)).toBe(true);
  });

  it('returns false for other errors', () => {
    const error = { code: 'P5000' };
    expect(isUniqueConstraintError(error)).toBe(false);
  });
});
