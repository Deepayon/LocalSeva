import { NextRequest, NextResponse } from 'next/server';

// This route's only job is to forward the request to the backend.
// It does NOT connect to the database.
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Forward the request to the backend, including the token for validation.
    const backendResponse = await fetch('http://localhost:3001/api/auth/session', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });

  } catch (error) {
    console.error('Session proxy error:', error);
    return NextResponse.json({ success: false, error: 'Failed to proxy session request.' }, { status: 500 });
  }
}