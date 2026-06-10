import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

function secret() {
  return new TextEncoder().encode(process.env.SESSION_SECRET ?? 'dev-secret-change-me');
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === '/dashboard/login') return NextResponse.next();

  const session = req.cookies.get('session')?.value;
  if (session) {
    try {
      await jwtVerify(session, secret());
      return NextResponse.next();
    } catch {}
  }

  return NextResponse.redirect(new URL('/dashboard/login', req.url));
}

export const config = {
  matcher: '/dashboard/:path*',
};
