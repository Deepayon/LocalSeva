import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// This endpoint's sole purpose is to read the httpOnly cookie
// on the server and return its payload to the client. It does NOT
// connect to the database.
export async function GET(request: NextRequest) {
  try {
    // 1. Get the token from the secure httpOnly cookie
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // 2. Verify the token's integrity (without a db call)
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured on the server.');
    }
    jwt.verify(token, process.env.JWT_SECRET);

    // 3. Return the token in the response body
    return NextResponse.json({ success: true, sessionToken: token });

  } catch (error) {
    // This will catch invalid or expired tokens
    console.error('Session validation error:', error);
    return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
  }
}
