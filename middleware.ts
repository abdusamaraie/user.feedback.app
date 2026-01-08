import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_PATHS = ['/admin', '/api/admin'];

function isAdminPath(pathname: string) {
  return ADMIN_PATHS.some((path) => pathname.startsWith(path));
}

function unauthorized() {
  return new NextResponse('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Feedback Admin"'
    }
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAdminPath(pathname)) {
    const password = process.env.ADMIN_PASSWORD;
    if (!password) {
      return new NextResponse('ADMIN_PASSWORD not configured', { status: 500 });
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Basic ')) {
      return unauthorized();
    }

    const decoded = Buffer.from(authHeader.split(' ')[1], 'base64').toString();
    const [username, providedPassword] = decoded.split(':');

    if (!username || providedPassword !== password) {
      return unauthorized();
    }
  }

  if (pathname.startsWith('/b')) {
    const response = NextResponse.next();
    const fingerprint = request.cookies.get('fp');
    if (!fingerprint) {
      response.cookies.set('fp', crypto.randomUUID(), {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 365
      });
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/b/:path*', '/admin/:path*', '/api/admin/:path*']
};
