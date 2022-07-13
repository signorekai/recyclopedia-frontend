import { NextResponse, userAgent, NextRequest } from 'next/server';
import { decode } from 'next-auth/jwt';

export async function middleware(req) {
  console.log('running middleware');
  const response = NextResponse.next();
  let visitorId = req.cookies.get('v_id');
  let date = new Date();
  if (visitorId === undefined) {
    visitorId =
      date.getTime().toString(16) +
      Math.floor(Math.random() * (999999 - 100000) + 100000).toString(16);
  }

  date.setTime(date.getTime() + 2 * 365 * 24 * 60 * 60 * 1000);
  response.cookies.set('v_id', visitorId, {
    expires: date,
    sameSite: 'strict',
  });

  if (req.nextUrl.pathname.startsWith('/items')) {
    console.log(visitorId, 'visiting', req.nextUrl);
  }

  if (req.nextUrl.pathname.startsWith('/account')) {
    const sessionToken =
      req.headers.get('authorization') ||
      req.cookies.get('next-auth.session-token');

    const token = await decode({
      token: sessionToken,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (token !== null) {
      return response;
    } else {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', req.nextUrl.pathname);
      return response.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: '/',
};
