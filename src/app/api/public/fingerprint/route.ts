import { NextResponse } from 'next/server';
import { ensureFingerprint } from '@/lib/fingerprint';

export const runtime = 'nodejs';

export async function POST() {
  const fingerprint = ensureFingerprint();
  return NextResponse.json({ fingerprint });
}
