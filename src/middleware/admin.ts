import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function adminMiddleware(request: NextRequest) {
  try {
    // Get the session token from cookies
    const sessionToken = request.cookies.get('session-token')?.value;
    
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    // Find the session and user
    const session = await db.session.findUnique({
      where: { sessionToken },
      include: { user: true }
    });

    if (!session || session.expires < new Date()) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    // Check if user is admin
    if (session.user.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // User is admin, allow access
    return NextResponse.next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return NextResponse.redirect(new URL('/auth', request.url));
  }
}

export async function requireAdmin(request: NextRequest) {
  try {
    // Get the session token from cookies
    const sessionToken = request.cookies.get('session-token')?.value;
    
    if (!sessionToken) {
      return { success: false, error: 'No session token' };
    }

    // Find the session and user
    const session = await db.session.findUnique({
      where: { sessionToken },
      include: { user: true }
    });

    if (!session || session.expires < new Date()) {
      return { success: false, error: 'Invalid or expired session' };
    }

    // Check if user is admin
    if (session.user.role !== 'admin') {
      return { success: false, error: 'User is not an admin' };
    }

    // User is admin
    return { success: true, user: session.user };
  } catch (error) {
    console.error('Admin check error:', error);
    return { success: false, error: 'Server error' };
  }
}