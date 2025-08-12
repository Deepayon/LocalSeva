import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Extract the token cookie to send it to the backend
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Forward the request to your backend server, including the token for validation
    const backendResponse = await fetch('http://localhost:3001/api/auth/session', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await backendResponse.json();

    // Return the backend's response to the client
    return NextResponse.json(data, { status: backendResponse.status });

  } catch (error) {
    console.error('Session proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to proxy session request.' },
      { status: 500 }
    );
  }
}