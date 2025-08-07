import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!sessionToken) {
      return NextResponse.json(
        { error: 'No session token provided' },
        { status: 401 }
      );
    }

    // Find session and validate
    const session = await db.session.findUnique({
      where: { sessionToken },
      include: {
        user: {
          include: {
            neighborhood: true
          }
        }
      }
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    if (session.expires < new Date()) {
      // Delete expired session
      await db.session.delete({
        where: { id: session.id }
      });
      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: session.user.id,
        phone: session.user.phone,
        name: session.user.name,
        email: session.user.email,
        verified: session.user.verified,
        trustScore: session.user.trustScore,
        role: session.user.role,
        neighborhood: session.user.neighborhood
      }
    });

  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate session' },
      { status: 500 }
    );
  }
}