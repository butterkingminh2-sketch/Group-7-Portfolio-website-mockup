import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? '';
  const [scheme, encoded] = auth.split(' ');

  if (scheme === 'Basic' && encoded) {
    const decoded = Buffer.from(encoded, 'base64').toString();
    const password = decoded.split(':').slice(1).join(':');
    if (password === process.env.DASHBOARD_PASSWORD) {
      return NextResponse.next();
    }
  }

  return new NextResponse('Access denied.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Studio 7 Dashboard"' },
  });
}

export const config = {
  matcher: '/dashboard/:path*',
};
