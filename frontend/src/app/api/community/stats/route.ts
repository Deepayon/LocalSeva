import { NextRequest, NextResponse } from 'next/server';
// import { db } from '@/lib/db-real';

export async function GET(request: NextRequest) {
  try {
    // Mock data for stable operation
    const mockStats = {
      totalUsers: 6,
      activeUsers: 4,
      totalNeighborhoods: 5,
      recentActivity: {
        waterSchedules: 2,
        powerOutages: 2,
        lostItems: 2,
        foundItems: 2,
        skills: 3,
        parkingSpots: 2,
        total: 13
      },
      activityPercentage: 65,
      activityStatus: 'Normal'
    };

    return NextResponse.json({
      success: true,
      stats: mockStats
    });

  } catch (error) {
    console.error('Error fetching community stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch community statistics' },
      { status: 500 }
    );
  }
}