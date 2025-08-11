import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db-real';

interface Alert {
  id: string;
  title: string;
  description: string;
  type: string;
  severity: string;
  status: string;
  location: string;
  affectedPeople: number;
  expectedResolution?: string;
  reportedAt: string;
  reporter: {
    name: string;
    avatar?: string;
  };
  neighborhood: {
    name: string;
    city: string;
  };
}

// Mock alerts data based on the examples provided
const mockAlerts: Alert[] = [
  {
    id: "1",
    title: "Power Outage in Indiranagar",
    description: "Power outage reported in Indiranagar 1st and 2nd stages. BESCOM teams are working on it.",
    type: "power",
    severity: "high",
    status: "active",
    location: "Indiranagar, Bangalore",
    affectedPeople: 250,
    expectedResolution: "4 hours",
    reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    reporter: {
      name: "Ramesh Kumar",
      avatar: ""
    },
    neighborhood: {
      name: "Indiranagar",
      city: "Bangalore"
    }
  },
  {
    id: "2",
    title: "Water Supply Disruption - Koramangala",
    description: "Water supply will be disrupted tomorrow from 9 AM to 2 PM for pipeline maintenance.",
    type: "water",
    severity: "medium",
    status: "scheduled",
    location: "Koramangala, Bangalore",
    affectedPeople: 500,
    expectedResolution: "Tomorrow 2 PM",
    reportedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    reporter: {
      name: "BWSSB",
      avatar: ""
    },
    neighborhood: {
      name: "Koramangala",
      city: "Bangalore"
    }
  },
  {
    id: "3",
    title: "Heavy Traffic on Outer Ring Road",
    description: "Accident near Marathahalli bridge causing heavy traffic. Avoid this route if possible.",
    type: "traffic",
    severity: "medium",
    status: "active",
    location: "Outer Ring Road, Bangalore",
    affectedPeople: 1000,
    expectedResolution: "2 hours",
    reportedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    reporter: {
      name: "Traffic Police",
      avatar: ""
    },
    neighborhood: {
      name: "Outer Ring Road",
      city: "Bangalore"
    }
  },
  {
    id: "4",
    title: "Plumbing Services Available",
    description: "Experienced plumber available for emergency repairs in Salt Lake area.",
    type: "services",
    severity: "low",
    status: "active",
    location: "Salt Lake, Kolkata",
    affectedPeople: 50,
    reportedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    reporter: {
      name: "Rajesh Kumar",
      avatar: ""
    },
    neighborhood: {
      name: "Salt Lake",
      city: "Kolkata"
    }
  },
  {
    id: "5",
    title: "Water Maintenance Scheduled",
    description: "Scheduled water maintenance in Sector 2 tomorrow. Please store water accordingly.",
    type: "water",
    severity: "medium",
    status: "scheduled",
    location: "Sector 2, Salt Lake",
    affectedPeople: 300,
    expectedResolution: "Tomorrow 6 PM",
    reportedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    reporter: {
      name: "Municipal Corporation",
      avatar: ""
    },
    neighborhood: {
      name: "Sector 2",
      city: "Kolkata"
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    // Get session token from cookies
    const sessionToken = request.cookies.get('session-token')?.value;
    let userNeighborhood = null;
    
    if (sessionToken) {
      // Find session and user to get user's neighborhood
      const session = await db.session.findUnique({
        where: { sessionToken },
        include: { user: { include: { neighborhood: true } } }
      });

      if (session && session.expires >= new Date()) {
        userNeighborhood = session.user.neighborhood;
      }
    }

    // Filter alerts based on user's location
    let filteredAlerts = mockAlerts;
    
    if (userNeighborhood) {
      // If user has a neighborhood, prioritize alerts from the same city
      const userCity = userNeighborhood.city.toLowerCase();
      const userNeighborhoodName = userNeighborhood.name.toLowerCase();
      
      // Sort alerts by relevance to user's location
      filteredAlerts = [...mockAlerts].sort((a, b) => {
        const aCity = a.neighborhood.city.toLowerCase();
        const bCity = b.neighborhood.city.toLowerCase();
        const aNeighborhood = a.neighborhood.name.toLowerCase();
        const bNeighborhood = b.neighborhood.name.toLowerCase();
        
        // Exact neighborhood match gets highest priority
        const aExactMatch = aNeighborhood === userNeighborhoodName;
        const bExactMatch = bNeighborhood === userNeighborhoodName;
        
        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;
        
        // Same city match gets second priority
        const aCityMatch = aCity === userCity;
        const bCityMatch = bCity === userCity;
        
        if (aCityMatch && !bCityMatch) return -1;
        if (!aCityMatch && bCityMatch) return 1;
        
        // Otherwise sort by severity and time
        return 0;
      });
    }

    return NextResponse.json({
      success: true,
      alerts: filteredAlerts,
      userLocation: userNeighborhood ? {
        neighborhood: userNeighborhood.name,
        city: userNeighborhood.city
      } : null
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=30',
        'CDN-Cache-Control': 'public, s-maxage=120, stale-while-revalidate=30'
      }
    });

  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, type, severity, location, affectedPeople, expectedResolution } = await request.json();

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
      include: { user: { include: { neighborhood: true } } }
    });

    if (!session || session.expires < new Date()) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Validate required fields
    if (!title || !description || !type || !severity || !location) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Create a new alert (in a real app, this would be stored in the database)
    const newAlert: Alert = {
      id: Date.now().toString(),
      title,
      description,
      type,
      severity,
      status: "active",
      location,
      affectedPeople: affectedPeople || 0,
      expectedResolution,
      reportedAt: new Date().toISOString(),
      reporter: {
        name: session.user.name || "Anonymous",
        avatar: session.user.avatar || ""
      },
      neighborhood: session.user.neighborhood || {
        name: location.split(',')[0].trim(),
        city: location.split(',').slice(1).join(',').trim()
      }
    };

    // Add to mock alerts (in production, this would be a database insert)
    mockAlerts.unshift(newAlert);

    return NextResponse.json({
      success: true,
      message: 'Alert created successfully',
      alert: newAlert
    });

  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    );
  }
}