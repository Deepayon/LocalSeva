import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the request body from the client (e.g., the phone number)
    const body = await request.json();

    // Forward the request to your backend server
    const res = await fetch('http://localhost:3001/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    // Check if the backend call was successful
    if (!res.ok) {
      // If not, forward the backend's error message and status
      const errorData = await res.json();
      return NextResponse.json(errorData, { status: res.status });
    }

    // If successful, forward the backend's response
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });

  } catch (error) {
    console.error('Proxy Error:', error);
    return NextResponse.json(
        { success: false, error: 'Failed to proxy request to the backend.' }, 
        { status: 500 }
    );
  }
}