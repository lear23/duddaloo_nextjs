// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json(
    { message: 'Logged out successfully' },
    { status: 200 }
  );

  response.cookies.set(SESSION_COOKIE_NAME, '', {
    maxAge: 0,
    path: '/',
  });

  return response;
}

export async function GET() {
  const response = NextResponse.redirect(
    new URL('/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
    302
  );

  response.cookies.set(SESSION_COOKIE_NAME, '', {
    maxAge: 0,
    path: '/',
  });

  return response;
}
