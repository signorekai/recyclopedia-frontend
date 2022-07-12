import { NextResponse } from 'next/server';

export function middleware(req) {
  console.log('requesting', req.nextUrl.pathname);
}

export const config = {
  matcher: ['/items/:slug*', '/account/*'],
};
