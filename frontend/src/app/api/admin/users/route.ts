import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Correctly import the shared Prisma client

export async function GET(request: NextRequest) {
  try {
    // 1. Get the session token from the request cookies
    const sessionToken = request.cookies.get('session-token')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized: No session token provided' }, { status: 401 });
    }

    // 2. Find the session and the associated user
    const session = await db.session.findUnique({
      where: { sessionToken },
      include: {
        user: true,
      },
    });

    // 3. Verify the session and check if the user is an admin
    if (!session || session.expires < new Date() || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // 4. If the user is an admin, proceed to fetch data
    const users = await db.user.findMany({
      include: {
        neighborhood: true,
        _count: {
          select: {
            waterSchedules: true,
            powerOutages: true,
            lostItems: true,
            foundItems: true,
            skills: true,
            parkingSpots: true,
            reviews: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const neighborhoods = await db.neighborhood.findMany({
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      users,
      neighborhoods,
      summary: {
        totalUsers: users.length,
        activeUsers: users.filter((u) => u.isActive).length,
        verifiedUsers: users.filter((u) => u.verified).length,
        adminUsers: users.filter((u) => u.role === 'admin').length,
        totalNeighborhoods: neighborhoods.length,
      },
    });
  } catch (error) {
    console.error('Error fetching admin users data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users data' },
      { status: 500 }
    );
  }
}