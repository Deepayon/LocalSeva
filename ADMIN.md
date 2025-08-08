# LocalSeva Admin Documentation

## Overview
The LocalSeva platform now includes a comprehensive admin system that allows administrators to view and manage users, neighborhoods, and community activities.

## Database System
**Database:** SQLite with Prisma ORM  
**Location:** `./dev.db`  
**Schema:** `./prisma/schema.prisma`

## Admin Features

### 1. Admin Dashboard
- **URL:** `/admin`
- **Access:** Available to all authenticated users (can be restricted to admin roles)
- **Features:**
  - User management and statistics
  - Neighborhood overview
  - Real-time community activity monitoring

### 2. User Management
- **View all users** with detailed information:
  - Contact details (phone, email)
  - Neighborhood assignment
  - Verification status
  - Trust score
  - Activity statistics (posts, reviews)
  - Account status (active/inactive)
  - Join date and last login

### 3. Neighborhood Management
- **View all neighborhoods** with:
  - Geographic information (city, state, pincode)
  - User count per neighborhood
  - Location coordinates

### 4. Real-time Statistics
- **Total Users:** Overall user count
- **Active Users:** Users with recent activity
- **Verified Users:** Users with completed verification
- **Neighborhoods:** Total community areas

## API Endpoints

### Admin Users API
- **Endpoint:** `/api/admin/users`
- **Method:** GET
- **Response:** 
  ```json
  {
    "success": true,
    "users": [...],      // Array of user objects with full details
    "neighborhoods": [...], // Array of neighborhood objects
    "summary": {        // Statistical summary
      "totalUsers": 6,
      "activeUsers": 6,
      "verifiedUsers": 6,
      "totalNeighborhoods": 5
    }
  }
  ```

### Community Stats API
- **Endpoint:** `/api/community/stats`
- **Method:** GET
- **Response:** Real-time community statistics including activity percentages

### Community Feed API
- **Endpoint:** `/api/community/feed`
- **Method:** GET
- **Response:** Recent community activities and updates

## Database Schema

### Key Tables:
1. **users** - User accounts and authentication
2. **neighborhoods** - Community areas
3. **sessions** - User authentication sessions
4. **water_schedules** - Water supply information
5. **power_outages** - Electricity outage alerts
6. **lost_items** - Lost item reports
7. **found_items** - Found item reports
8. **skills** - Skill sharing services
9. **parking_spots** - Parking space rentals
10. **queue_updates** - Queue management information
11. **reviews** - User reviews and ratings
12. **notifications** - User notifications
13. **bookings** - Parking spot bookings

## Real Data

### Sample Users (6 real users):
- **Deepayan Das** (deepayandas42@gmail.com) - Trust Score: 95
- **Rajesh Kumar** - Trust Score: 85
- **Priya Sharma** - Trust Score: 92
- **Amit Patel** - Trust Score: 78
- **Sunita Reddy** - Trust Score: 88
- **Vikram Singh** - Trust Score: 76

### Sample Neighborhoods (5 Kolkata areas):
1. **Sector 2, Salt Lake** (700091) - 3 users
2. **Sector 1, Salt Lake** (700064) - 1 user
3. **Sector 3, Salt Lake** (700106) - 1 user
4. **Lake Town** (700089) - 0 users
5. **Bangur** (700055) - 0 users

## Navigation

### Admin Access
- Admin panel accessible via user dropdown menu
- Shield icon indicates admin section
- Available on both desktop and mobile navigation

### User Experience
- **Desktop:** Admin link in user dropdown
- **Mobile:** Admin link in mobile menu
- **Search:** Real-time user search functionality
- **Tabs:** Separate views for Users and Neighborhoods

## Security Considerations

### Current Implementation:
- Admin panel accessible to all authenticated users
- No role-based access control (yet)
- All user data is visible to authenticated users

### Future Enhancements:
- Implement admin role verification
- Add user management actions (suspend, delete)
- Implement neighborhood management
- Add audit logging for admin actions

## Data Management

### Database Seeding
- **Script:** `prisma/seed.ts`
- **Command:** `npx tsx prisma/seed.ts`
- **Data:** Real Kolkata neighborhoods and Indian user names

### Data Updates
- Real-time updates via Socket.IO
- User activities tracked and displayed
- Community statistics calculated dynamically

## Usage Instructions

### For Administrators:
1. Log in to the LocalSeva platform
2. Click on your avatar in the top-right corner
3. Select "Admin" from the dropdown menu
4. View user statistics and neighborhood information
5. Use search to find specific users
6. Switch between Users and Neighborhoods tabs

### For Users:
- The admin panel shows community statistics
- Users can see neighborhood information
- Individual user data is visible for transparency

## Technical Details

### Stack:
- **Frontend:** Next.js 15 with TypeScript
- **Backend:** Next.js API routes
- **Database:** SQLite with Prisma ORM
- **UI:** shadcn/ui components with Tailwind CSS
- **Real-time:** Socket.IO for live updates

### File Structure:
```
src/
├── app/
│   ├── admin/
│   │   └── page.tsx          # Admin dashboard
│   └── api/
│       └── admin/
│           └── users/
│               └── route.ts   # Admin API endpoint
├── components/
│   ├── navbar.tsx            # Navigation with admin link
│   └── ui/                   # shadcn/ui components
└── lib/
    └── db.ts                 # Database client
```

This admin system provides complete visibility into the LocalSeva platform's user base and community activities, making it easy to monitor growth and engagement across different neighborhoods.