import { NextRequest, NextResponse } from 'next/server';
// Make sure you are importing PrismaClient correctly
import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
import { requireAdmin } from '@/middleware/admin';

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const adminCheck = await requireAdmin(request);
    if (!adminCheck.success) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Get all users with their neighborhood information
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
        createdAt: "desc",
      },
    });

    // Get neighborhood statistics
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
        adminUsers: users.filter((u) => u.role === "admin").length,
        totalNeighborhoods: neighborhoods.length,
      },
    });
  } catch (error) {
    console.error("Error fetching admin users data:", error);
    return NextResponse.json(
      { error: "Failed to fetch users data" },
      { status: 500 }
    );
  }
}