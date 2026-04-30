import { NextRequest, NextResponse } from 'next/server';

import { SESSION_COOKIE } from '@/lib/session';

const protectedPaths = ['/admin', '/acesso', '/trocar-senha'];

export function middleware(request: NextRequest) {
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
  const { pathname } = request.nextUrl;

  if (protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`)) && !hasSession) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === '/login' && hasSession) {
    const accessUrl = request.nextUrl.clone();
    accessUrl.pathname = '/acesso';
    accessUrl.search = '';
    return NextResponse.redirect(accessUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/acesso', '/trocar-senha', '/login'],
};
