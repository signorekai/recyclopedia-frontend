import { NextResponse } from 'next/server';
import { decode } from 'next-auth/jwt';

export async function middleware(req) {
  if (req.nextUrl.pathname.startsWith('/account')) {
    const sessionToken =
      req.headers.get('authorization') ||
      req.cookies.get('next-auth.session-token') ||
      req.cookies.get('__Secure-next-auth.session-token');
    console.log('cookies', req.cookies.entries());

    const token = await decode({
      token: sessionToken,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (token === null) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/account/:path*'],
};
