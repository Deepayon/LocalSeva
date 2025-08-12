import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the request body from the client (phone and OTP)
    const body = await request.json();

    // Forward the request to your backend server
    const res = await fetch('http://localhost:3001/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    // If the backend responds with an error, forward it
    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(errorData, { status: res.status });
    }

    // If successful, forward the backend's data and set the cookie
    const data = await res.json();
    const response = NextResponse.json(data, { status: res.status });

    // IMPORTANT: The JWT token is created by the backend,
    // but the cookie is set by the Next.js frontend for the browser.
    if (data.token) {
      response.cookies.set('token', data.token, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
      });
    }

    return response;

  } catch (error) {
    console.error('Proxy Error:', error);
    return NextResponse.json(
        { success: false, error: 'Failed to proxy request to the backend.' },
        { status: 500 }
    );
  }
}