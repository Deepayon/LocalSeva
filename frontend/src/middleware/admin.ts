// frontend/src/middleware/admin.ts
import { NextRequest, NextResponse } from 'next/server';

export async function adminMiddleware(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Call your backend API to verify admin role
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${token}` }
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.next();
  } catch (err) {
    console.error('Frontend adminMiddleware error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
