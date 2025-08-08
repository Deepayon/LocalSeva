import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

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

    // Get recent activities from all tables
    const activities: ActivityItem[] = [];

    // Water schedules
    if (filter === 'all' || filter === 'water') {
      const waterSchedules = await db.waterSchedule.findMany({
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              avatar: true
            }
          },
          neighborhood: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      waterSchedules.forEach(schedule => {
        activities.push({
          id: `water-${schedule.id}`,
          type: 'water',
          title: 'Water Supply Available',
          description: schedule.notes || `Water available from ${schedule.startTime.toLocaleTimeString()} to ${schedule.endTime.toLocaleTimeString()}`,
          time: schedule.createdAt.toISOString(),
          user: {
            name: schedule.user.name,
            avatar: schedule.user.avatar
          },
          verified: schedule.verified,
          neighborhoodId: schedule.neighborhoodId,
          createdAt: schedule.createdAt
        });
      });
    }

    // Power outages
    if (filter === 'all' || filter === 'power') {
      const powerOutages = await db.powerOutage.findMany({
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              avatar: true
            }
          },
          neighborhood: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      powerOutages.forEach(outage => {
        activities.push({
          id: `power-${outage.id}`,
          type: 'power',
          title: outage.isPlanned ? 'Planned Power Outage' : 'Power Outage Alert',
          description: outage.reason || 'Power outage reported in the area',
          time: outage.createdAt.toISOString(),
          user: {
            name: outage.user.name,
            avatar: outage.user.avatar
          },
          verified: outage.verified,
          neighborhoodId: outage.neighborhoodId,
          createdAt: outage.createdAt
        });
      });
    }

    // Lost items
    if (filter === 'all' || filter === 'lost') {
      const lostItems = await db.lostItem.findMany({
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              avatar: true
            }
          },
          neighborhood: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      lostItems.forEach(item => {
        activities.push({
          id: `lost-${item.id}`,
          type: 'lost',
          title: `Lost: ${item.title}`,
          description: item.description,
          time: item.createdAt.toISOString(),
          user: {
            name: item.user.name,
            avatar: item.user.avatar
          },
          verified: true,
          neighborhoodId: item.neighborhoodId,
          createdAt: item.createdAt
        });
      });
    }

    // Found items
    if (filter === 'all' || filter === 'found') {
      const foundItems = await db.foundItem.findMany({
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              avatar: true
            }
          },
          neighborhood: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      foundItems.forEach(item => {
        activities.push({
          id: `found-${item.id}`,
          type: 'found',
          title: `Found: ${item.title}`,
          description: item.description,
          time: item.createdAt.toISOString(),
          user: {
            name: item.user.name,
            avatar: item.user.avatar
          },
          verified: true,
          neighborhoodId: item.neighborhoodId,
          createdAt: item.createdAt
        });
      });
    }

    // Skills
    if (filter === 'all' || filter === 'skill') {
      const skills = await db.skill.findMany({
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              avatar: true
            }
          },
          neighborhood: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      skills.forEach(skill => {
        activities.push({
          id: `skill-${skill.id}`,
          type: 'skill',
          title: skill.isOffering ? `Offering: ${skill.title}` : `Seeking: ${skill.title}`,
          description: skill.description,
          time: skill.createdAt.toISOString(),
          user: {
            name: skill.user.name,
            avatar: skill.user.avatar
          },
          verified: true,
          neighborhoodId: skill.neighborhoodId,
          createdAt: skill.createdAt
        });
      });
    }

    // Parking spots
    if (filter === 'all' || filter === 'parking') {
      const parkingSpots = await db.parkingSpot.findMany({
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              avatar: true
            }
          },
          neighborhood: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      parkingSpots.forEach(spot => {
        activities.push({
          id: `parking-${spot.id}`,
          type: 'parking',
          title: `Parking: ${spot.title}`,
          description: spot.description,
          time: spot.createdAt.toISOString(),
          user: {
            name: spot.user.name,
            avatar: spot.user.avatar
          },
          verified: true,
          neighborhoodId: spot.neighborhoodId,
          createdAt: spot.createdAt
        });
      });
    }

    // Queue updates
    if (filter === 'all' || filter === 'queue') {
      const queueUpdates = await db.queueUpdate.findMany({
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              avatar: true
            }
          },
          neighborhood: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      queueUpdates.forEach(update => {
        activities.push({
          id: `queue-${update.id}`,
          type: 'queue',
          title: `Queue Update: ${update.locationName}`,
          description: `Current number: ${update.currentNumber}, Estimated time: ${update.estimatedTime} mins`,
          time: update.createdAt.toISOString(),
          user: {
            name: update.user.name,
            avatar: update.user.avatar
          },
          verified: true,
          neighborhoodId: update.neighborhoodId,
          createdAt: update.createdAt
        });
      });
    }

    // Sort all activities by creation time
    activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Take only the requested number of items
    const paginatedActivities = activities.slice(0, limit);

    // Format time strings for display
    const formattedActivities = paginatedActivities.map(activity => ({
      ...activity,
      time: formatTimeAgo(activity.createdAt)
    }));

    return NextResponse.json({
      success: true,
      activities: formattedActivities,
      total: activities.length,
      hasMore: activities.length > limit
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

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
}