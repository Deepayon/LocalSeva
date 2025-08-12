import { NextRequest, NextResponse } from 'next/server';

// This route now only acts as a secure proxy to the backend.
// It does NOT contain any database logic.
export async function GET(request: NextRequest) {
  try {
    // 1. Get the authentication token from the user's secure cookie.
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // 2. Forward the request to the backend's admin data endpoint.
    // The backend will handle authentication and database queries.
    const backendResponse = await fetch('http://localhost:3001/api/admin/data', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // 3. Return the backend's response directly to the admin page.
    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });

  } catch (error) {
    console.error('Admin users proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to proxy request to the backend.' },
      { status: 500 }
    );
  }
}