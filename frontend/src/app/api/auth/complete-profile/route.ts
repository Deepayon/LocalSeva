import { NextRequest, NextResponse } from 'next/server';

// This route now only forwards the request to the backend.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = request.cookies.get('token')?.value;

    // Forward the request to the backend, including the token and request body.
    const backendResponse = await fetch('http://localhost:3001/api/auth/complete-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });

  } catch (error) {
    console.error('Profile completion proxy error:', error);
    return NextResponse.json({ success: false, error: 'Failed to proxy profile request.' }, { status: 500 });
  }
}