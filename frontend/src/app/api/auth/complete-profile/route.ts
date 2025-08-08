import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { userId, name, email, neighborhood } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Validate email format if provided
    if (email && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      }
    }

    // Find user by ID
    const user = await db.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Find or create neighborhood
    let neighborhoodRecord = null;
    if (neighborhood && neighborhood.trim()) {
      neighborhoodRecord = await db.neighborhood.findFirst({
        where: {
          name: {
            contains: neighborhood.trim()
          }
        }
      });

      if (!neighborhoodRecord) {
        // For demo purposes, create a simple neighborhood
        // In production, you would use geocoding to get coordinates
        const neighborhoodName = neighborhood.trim();
        const city = neighborhoodName.toLowerCase().includes('kolkata') ? 'Kolkata' : 'Unknown';
        const state = 'West Bengal';
        
        neighborhoodRecord = await db.neighborhood.create({
          data: {
            name: neighborhoodName,
            city,
            state,
            pincode: '700000', // Default Kolkata pincode
            latitude: 22.5726, // Kolkata coordinates
            longitude: 88.3639,
            radius: 0.5
          }
        });
      }
    }

    // Update user profile
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        name: name.trim(),
        email: email ? email.trim() : null,
        neighborhoodId: neighborhoodRecord ? neighborhoodRecord.id : null
      },
      include: {
        neighborhood: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Profile completed successfully',
      user: {
        id: updatedUser.id,
        phone: updatedUser.phone,
        name: updatedUser.name,
        email: updatedUser.email,
        verified: updatedUser.verified,
        trustScore: updatedUser.trustScore,
        role: updatedUser.role,
        neighborhood: updatedUser.neighborhood
      }
    });

  } catch (error) {
    console.error('Complete profile error:', error);
    
    // Handle specific Prisma errors
    if (error instanceof Error && error.name === 'PrismaClientValidationError') {
      return NextResponse.json(
        { error: 'Invalid data format. Please check your input.' },
        { status: 400 }
      );
    }
    
    if (error instanceof Error && error.name === 'PrismaClientKnownRequestError') {
      return NextResponse.json(
        { error: 'Database error. Please try again.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to complete profile. Please try again.' },
      { status: 500 }
    );
  }
}