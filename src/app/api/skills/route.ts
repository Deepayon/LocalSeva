import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get all skills with user and neighborhood information
    const skills = await db.skill.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            avatar: true,
            trustScore: true
          }
        },
        neighborhood: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      skills
    });

  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, category, skillLevel, isOffering } = await request.json();

    // Get session token from cookies
    const sessionToken = request.cookies.get('session-token')?.value;
    
    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Find session and user
    const session = await db.session.findUnique({
      where: { sessionToken },
      include: { user: true }
    });

    if (!session || session.expires < new Date()) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Validate required fields
    if (!title || !description || !category || !skillLevel) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create skill
    const skill = await db.skill.create({
      data: {
        userId: session.user.id,
        neighborhoodId: session.user.neighborhoodId || '', // Use user's neighborhood if available
        title,
        description,
        category,
        skillLevel,
        isOffering: isOffering !== false // Default to true (offering service)
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            avatar: true,
            trustScore: true
          }
        },
        neighborhood: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Skill created successfully',
      skill
    });

  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json(
      { error: 'Failed to create skill' },
      { status: 500 }
    );
  }
}