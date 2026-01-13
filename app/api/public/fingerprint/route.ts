import { NextResponse, type NextRequest } from 'next/server';
import { createFingerprint, fingerprintCookieOptions, FINGERPRINT_COOKIE } from '@/lib/fingerprint';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const existing = request.cookies.get(FINGERPRINT_COOKIE)?.value ?? null;
  const fingerprint = createFingerprint(existing);

  const response = NextResponse.json({ fingerprint });
  if (!existing) {
    response.cookies.set(FINGERPRINT_COOKIE, fingerprint, fingerprintCookieOptions(process.env.NODE_ENV === 'production'));
  }

  return response;
}
