import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const neighborhoodId = searchParams.get('neighborhoodId');

    const schedules = await db.waterSchedule.findMany({
      where: neighborhoodId ? { neighborhoodId } : {},
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            avatar: true
          }
        },
        neighborhood: {
          select: {
            id: true,
            name: true,
            city: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limit to last 50 schedules
    });

    return NextResponse.json({
      success: true,
      schedules
    });

  } catch (error) {
    console.error('Get water schedules error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch water schedules' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { startTime, endTime, waterPressure, notes } = await request.json();

    if (!startTime || !endTime) {
      return NextResponse.json(
        { error: 'Start time and end time are required' },
        { status: 400 }
      );
    }

    // For demo purposes, we'll use a fixed user ID
    // In production, get this from authentication
    const userId = "demo-user-id";
    
    // For demo purposes, use a fixed neighborhood
    // In production, get this from user's profile
    const neighborhoodId = "demo-neighborhood-id";

    // Create or get neighborhood
    let neighborhood = await db.neighborhood.findUnique({
      where: { id: neighborhoodId }
    });

    if (!neighborhood) {
      neighborhood = await db.neighborhood.create({
        data: {
          id: neighborhoodId,
          name: "Demo Neighborhood",
          city: "Demo City",
          state: "Demo State",
          pincode: "000000",
          latitude: 0,
          longitude: 0,
          radius: 0.5
        }
      });
    }

    // Create or get user
    let user = await db.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      user = await db.user.create({
        data: {
          id: userId,
          phone: "+919876543210",
          name: "Demo User",
          verified: true,
          trustScore: 5,
          neighborhoodId: neighborhood.id
        }
      });
    }

    const schedule = await db.waterSchedule.create({
      data: {
        userId: user.id,
        neighborhoodId: neighborhood.id,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        waterPressure: waterPressure || null,
        notes: notes || null,
        verified: false
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            avatar: true
          }
        },
        neighborhood: {
          select: {
            id: true,
            name: true,
            city: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Water schedule created successfully',
      schedule
    });

  } catch (error) {
    console.error('Create water schedule error:', error);
    return NextResponse.json(
      { error: 'Failed to create water schedule' },
      { status: 500 }
    );
  }
}