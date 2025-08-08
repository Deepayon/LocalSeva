import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get overall statistics
    const totalUsers = await db.user.count({
      where: { isActive: true }
    });

    const totalNeighborhoods = await db.neighborhood.count();

    // Get recent activity counts
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const recentWaterSchedules = await db.waterSchedule.count({
      where: {
        createdAt: { gte: last24Hours }
      }
    });

    const recentPowerOutages = await db.powerOutage.count({
      where: {
        createdAt: { gte: last24Hours }
      }
    });

    const recentLostItems = await db.lostItem.count({
      where: {
        createdAt: { gte: last24Hours }
      }
    });

    const recentFoundItems = await db.foundItem.count({
      where: {
        createdAt: { gte: last24Hours }
      }
    });

    const recentSkills = await db.skill.count({
      where: {
        createdAt: { gte: last24Hours }
      }
    });

    const recentParkingSpots = await db.parkingSpot.count({
      where: {
        createdAt: { gte: last24Hours }
      }
    });

    const totalRecentActivity = recentWaterSchedules + recentPowerOutages + recentLostItems + recentFoundItems + recentSkills + recentParkingSpots;

    // Calculate activity percentage (compared to baseline)
    const baselineActivity = 10; // Assume baseline of 10 activities per day
    const activityPercentage = Math.min(100, Math.max(0, (totalRecentActivity / baselineActivity) * 100));

    // Get active users count (users who logged in or created content in last 7 days)
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const activeUsersCount = await db.user.count({
      where: {
        OR: [
          { lastLoginAt: { gte: last7Days } },
          {
            OR: [
              { waterSchedules: { some: { createdAt: { gte: last7Days } } } },
              { powerOutages: { some: { createdAt: { gte: last7Days } } } },
              { lostItems: { some: { createdAt: { gte: last7Days } } } },
              { foundItems: { some: { createdAt: { gte: last7Days } } } },
              { skills: { some: { createdAt: { gte: last7Days } } } },
              { parkingSpots: { some: { createdAt: { gte: last7Days } } } },
              { queueUpdates: { some: { createdAt: { gte: last7Days } } } }
            ]
          }
        ]
      }
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers: activeUsersCount,
        totalNeighborhoods,
        recentActivity: {
          waterSchedules: recentWaterSchedules,
          powerOutages: recentPowerOutages,
          lostItems: recentLostItems,
          foundItems: recentFoundItems,
          skills: recentSkills,
          parkingSpots: recentParkingSpots,
          total: totalRecentActivity
        },
        activityPercentage: Math.round(activityPercentage),
        activityStatus: activityPercentage > 80 ? 'Higher than usual' : 
                       activityPercentage > 50 ? 'Normal' : 'Lower than usual'
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
        'CDN-Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60'
      }
    });

  } catch (error) {
    console.error('Error fetching community stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch community statistics' },
      { status: 500 }
    );
  }
}