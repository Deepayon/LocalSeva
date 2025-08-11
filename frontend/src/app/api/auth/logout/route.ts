import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const response = NextResponse.json({
      message: 'Logout successful',
      success: true,
    });

    // Set the token cookie with an expiration date in the past,
    // which tells the browser to delete it.
    response.cookies.set('token', '', {
      httpOnly: true,
      expires: new Date(0),
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}