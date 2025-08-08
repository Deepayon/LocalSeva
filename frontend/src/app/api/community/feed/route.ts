import { NextRequest, NextResponse } from 'next/server';
// import { db } from '@/lib/db-real';

interface ActivityItem {
  id: string;
  type: 'water' | 'power' | 'lost' | 'found' | 'skill' | 'parking' | 'queue';
  title: string;
  description: string;
  time: string;
  user: {
    name: string;
    avatar?: string;
  };
  verified: boolean;
  neighborhoodId?: string;
  createdAt: Date;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Mock activities for stable operation
    const mockActivities: ActivityItem[] = [
      {
        id: 'water-1',
        type: 'water',
        title: 'Water Supply Available',
        description: 'Water available from 06:00 to 08:00 with good pressure',
        time: '2 hours ago',
        user: {
          name: 'Rajesh Kumar',
          avatar: ''
        },
        verified: true,
        neighborhoodId: '1',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 'power-1',
        type: 'power',
        title: 'Power Outage Alert',
        description: 'Unexpected power outage due to transformer maintenance',
        time: '4 hours ago',
        user: {
          name: 'Priya Sharma',
          avatar: ''
        },
        verified: true,
        neighborhoodId: '1',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        id: 'lost-1',
        type: 'lost',
        title: 'Lost: Black Leather Wallet',
        description: 'Lost black leather wallet near City Center, contains driving license and debit cards',
        time: '1 day ago',
        user: {
          name: 'Amit Patel',
          avatar: ''
        },
        verified: true,
        neighborhoodId: '2',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        id: 'skill-1',
        type: 'skill',
        title: 'Offering: Mathematics Tuition',
        description: 'Experienced math teacher offering tuition for classes 8-10. Specialized in algebra and geometry.',
        time: '3 hours ago',
        user: {
          name: 'Sunita Reddy',
          avatar: ''
        },
        verified: true,
        neighborhoodId: '1',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
      },
      {
        id: 'parking-1',
        type: 'parking',
        title: 'Parking Space Available',
        description: 'Covered parking space available near City Center, 24/7 security',
        time: '5 hours ago',
        user: {
          name: 'Vikram Singh',
          avatar: ''
        },
        verified: true,
        neighborhoodId: '1',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
      }
    ];

    // Filter activities based on type
    const filteredActivities = filter === 'all' 
      ? mockActivities 
      : mockActivities.filter(activity => activity.type === filter);

    // Sort by creation time
    filteredActivities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Apply pagination
    const paginatedActivities = filteredActivities.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      activities: paginatedActivities,
      total: filteredActivities.length,
      hasMore: filteredActivities.length > limit
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        'CDN-Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
      }
    });

  } catch (error) {
    console.error('Error fetching community feed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch community feed' },
      { status: 500 }
    );
  }
}