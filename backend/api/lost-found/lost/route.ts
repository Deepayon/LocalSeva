import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const neighborhoodId = searchParams.get('neighborhoodId');

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

  } catch (error) {
    console.error('Get lost items error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lost items' },
      { status: 500 }
    );
  }
}