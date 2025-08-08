import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'lost' or 'found'
    const neighborhoodId = searchParams.get('neighborhoodId');

    if (type === 'lost') {
      const items = await db.lostItem.findMany({
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
        take: 50
      });

      return NextResponse.json({
        success: true,
        items
      });
    } else if (type === 'found') {
      const items = await db.foundItem.findMany({
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
        take: 50
      });

      return NextResponse.json({
        success: true,
        items
      });
    }

    return NextResponse.json(
      { error: 'Invalid type parameter' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Get lost/found items error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const type = formData.get('type') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const location = formData.get('location') as string;
    const reward = formData.get('reward') as string;
    const image = formData.get('image') as File;

    if (!type || !title || !description || !category || !location) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
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

    // Handle image upload (simplified for demo)
    let imageUrl = null;
    if (image && image.size > 0) {
      // In production, you would upload to a cloud storage service
      // For demo purposes, we'll just store a placeholder
      imageUrl = `/uploads/${image.name}`;
    }

    let result;
    if (type === 'lost') {
      result = await db.lostItem.create({
        data: {
          userId: user.id,
          neighborhoodId: neighborhood.id,
          title,
          description,
          category,
          imageUrl,
          lostAt: new Date(),
          lostLocation: location,
          reward: reward ? parseFloat(reward) : 0,
          status: 'lost'
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
    } else if (type === 'found') {
      result = await db.foundItem.create({
        data: {
          userId: user.id,
          neighborhoodId: neighborhood.id,
          title,
          description,
          category,
          imageUrl,
          foundAt: new Date(),
          foundLocation: location,
          status: 'available'
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
    } else {
      return NextResponse.json(
        { error: 'Invalid type' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${type === 'lost' ? 'Lost' : 'Found'} item created successfully`,
      item: result
    });

  } catch (error) {
    console.error('Create lost/found item error:', error);
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}