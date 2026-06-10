import { getAuth } from 'firebase-admin/auth';
import { getDb } from '@/lib/firebase-admin';
import { SignJWT } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function secret() {
  return new TextEncoder().encode(process.env.SESSION_SECRET ?? 'dev-secret-change-me');
}

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json() as { idToken: string };
    // initialise Admin SDK (lazy)
    getDb();
    const decoded = await getAuth().verifyIdToken(idToken);
    const email = decoded.email?.toLowerCase() ?? '';

    if (!ADMIN_EMAILS.includes(email)) {
      return NextResponse.json({ error: 'This email is not authorised.' }, { status: 403 });
    }

    const token = await new SignJWT({ email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret());

    const res = NextResponse.json({ ok: true });
    res.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return res;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[/api/auth/session]', msg);
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete('session');
  return res;
}
