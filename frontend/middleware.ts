import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { adminMiddleware } from '@/middleware/admin';

export async function middleware(request: NextRequest) {
  // Apply admin middleware to admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return adminMiddleware(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};