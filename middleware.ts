import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createFingerprint, fingerprintCookieOptions, FINGERPRINT_COOKIE } from '@/lib/fingerprint';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const existing = request.cookies.get(FINGERPRINT_COOKIE)?.value ?? null;
  if (!existing) {
    const fingerprint = createFingerprint();
    response.cookies.set(FINGERPRINT_COOKIE, fingerprint, fingerprintCookieOptions(process.env.NODE_ENV === 'production'));
  }
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
