# LocalSeva Project Structure

A clean, organized project structure with separate frontend and backend applications at the root level.

## 📁 Directory Structure

```
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   │   ├── layout.tsx  # Root layout
│   │   │   ├── page.tsx    # Home page
│   │   │   ├── about/      # About page
│   │   │   ├── auth/       # Authentication pages
│   │   │   ├── alerts/     # Alert management
│   │   │   ├── admin/      # Admin dashboard
│   │   │   ├── contact/    # Contact page
│   │   │   ├── lost-found/ # Lost & Found pages
│   │   │   ├── notifications/ # Notifications page
│   │   │   ├── parking/    # Parking pages
│   │   │   ├── profile/    # Profile pages
│   │   │   ├── services/   # Services pages
│   │   │   ├── settings/   # Settings pages
│   │   │   ├── water-schedules/ # Water schedule pages
│   │   │   ├── globals.css # Global styles
│   │   │   └── favicon.ico # Favicon
│   │   ├── components/     # React components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   ├── real-time/  # Real-time components
│   │   │   ├── auth-sync.tsx
│   │   │   ├── navbar.tsx
│   │   │   ├── bottom-nav.tsx
│   │   │   └── footer.tsx
│   │   ├── hooks/          # Custom React hooks
│   │   │   ├── useRealTime.ts
│   │   │   ├── use-toast.ts
│   │   │   └── use-mobile.ts
│   │   ├── contexts/       # React contexts
│   │   │   └── auth-context.tsx
│   │   └── lib/            # Frontend utilities
│   │       └── utils.ts
│   ├── package.json        # Frontend dependencies
│   ├── tsconfig.json       # TypeScript config
│   ├── next.config.ts      # Next.js config
│   ├── tailwind.config.ts  # Tailwind CSS config
│   ├── components.json     # shadcn/ui config
│   ├── postcss.config.mjs  # PostCSS config
│   └── eslint.config.mjs   # ESLint config
│
├── backend/                 # Node.js/Express backend API
│   ├── src/
│   │   ├── api/            # API routes
│   │   │   ├── auth/       # Authentication endpoints
│   │   │   │   ├── send-otp/route.ts
│   │   │   │   ├── verify-otp/route.ts
│   │   │   │   ├── session/route.ts
│   │   │   │   ├── logout/route.ts
│   │   │   │   └── complete-profile/route.ts
│   │   │   ├── community/  # Community endpoints
│   │   │   │   ├── stats/route.ts
│   │   │   │   └── feed/route.ts
│   │   │   ├── admin/      # Admin endpoints
│   │   │   │   └── users/route.ts
│   │   │   ├── alerts/route.ts
│   │   │   ├── lost-found/route.ts
│   │   │   ├── lost-found/lost/route.ts
│   │   │   ├── lost-found/found/route.ts
│   │   │   ├── skills/route.ts
│   │   │   ├── water-schedules/route.ts
│   │   │   └── health/route.ts
│   │   ├── middleware/     # Express middleware
│   │   │   └── admin.ts
│   │   └── lib/            # Backend utilities
│   ├── prisma/             # Database schema
│   │   ├── schema.prisma   # Prisma schema
│   │   └── seed.ts         # Database seed
│   ├── db/                 # Database files
│   │   └── custom.db       # SQLite database
│   ├── server.ts           # Express server
│   ├── package.json        # Backend dependencies
│   └── tsconfig.json       # TypeScript config
│
├── public/                 # Static assets
│   ├── avatars/            # User avatars
│   ├── logo.svg           # Application logo
│   ├── robots.txt         # SEO configuration
│   └── placeholder-avatar-*.jpg # Placeholder images
│
├── scripts/                # Utility scripts
│   ├── check-admin.js     # Admin verification
│   └── test-otp.js        # OTP testing script
│
├── examples/               # Example implementations
│   └── websocket/          # WebSocket example
│       └── page.tsx
│
├── package.json            # Root package.json
├── README.md               # Project documentation
├── PROJECT_STRUCTURE.md    # This file
├── DEVELOPMENT.md          # Development guide
├── AUTH_FLOW.md           # Authentication flow
├── ADMIN_SECURITY.md      # Admin security
└── ADMIN.md               # Admin documentation
```

## 🚀 Development Commands

### Running Applications

```bash
# Install all dependencies
npm run install:all

# Run both frontend and backend
npm run dev

# Run frontend only (port 3000)
npm run dev:frontend

# Run backend only (port 3001)
npm run dev:backend
```

### Building and Deployment

```bash
# Build both applications
npm run build

# Build specific application
npm run build:frontend
npm run build:backend

# Start production servers
npm run start
```

### Database Operations

```bash
# Push schema changes to database
npm run db:push

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Reset database
npm run db:reset

# Seed database with initial data
npm run db:seed
```

### Code Quality

```bash
# Lint all code
npm run lint

# Lint specific application
npm run lint:frontend
npm run lint:backend
```

## 🎯 Key Features

### Frontend (Next.js)
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context and custom hooks
- **Real-time**: WebSocket integration for live updates
- **Authentication**: OTP-based authentication system
- **Responsive**: Mobile-first design with bottom navigation

### Backend (Express.js)
- **API**: RESTful API endpoints for all features
- **Database**: SQLite with Prisma ORM
- **Real-time**: Socket.io for WebSocket connections
- **Authentication**: JWT-based authentication
- **Middleware**: Admin authentication and request validation
- **Performance**: Caching and optimized database queries

## 📱 Application Features

### Core Features
- **Community Feed**: Real-time neighborhood updates
- **Alert System**: Water, power, and security alerts
- **Lost & Found**: Community-driven item recovery
- **Service Exchange**: Skill sharing and local services
- **Water Schedules**: Municipal water supply information
- **Authentication**: OTP-based secure login

### Technical Features
- **Real-time Updates**: WebSocket-powered live notifications
- **Mobile Responsive**: Optimized for all screen sizes
- **Type Safety**: Full TypeScript implementation
- **Performance**: Optimized bundles and caching
- **Security**: JWT authentication and input validation

## 🔧 Import Path Conventions

### Frontend Imports
```typescript
// Components
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";

// Hooks
import { useAuth } from "@/hooks/use-auth";

// Contexts
import { AuthProvider } from "@/contexts/auth-context";

// Utilities
import { formatDate } from "@/lib/utils";
```

### Backend Imports
```typescript
// API routes
import { db } from "@/lib/db";

// Middleware
import { authMiddleware } from "@/middleware/auth";
```

## 🌐 Environment Setup

### Frontend Environment (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

### Backend Environment (`.env`)
```
PORT=3001
DATABASE_URL="file:./db/custom.db"
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=http://localhost:3000
```

## 📊 Architecture Benefits

### Separation of Concerns
- **Frontend**: Focus on UI/UX and user interactions
- **Backend**: Focus on business logic and data management
- **Clear Boundaries**: Well-defined API contracts

### Scalability
- **Independent Deployment**: Each app can be deployed separately
- **Technology Flexibility**: Different tech stacks for frontend/backend
- **Performance Optimization**: Optimized for each application's needs

### Development Experience
- **Parallel Development**: Teams can work independently
- **Hot Reload**: Fast development with instant feedback
- **Type Safety**: Full TypeScript support across both applications

## 🔄 Data Flow

```
Frontend (Next.js)
    ↓ (HTTP/WebSocket)
Backend (Express)
    ↓ (Prisma ORM)
Database (SQLite)
```

## 🎨 Design System

### UI Components
- **shadcn/ui**: Modern, accessible component library
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Consistent icon library
- **Responsive Design**: Mobile-first approach

### Color Scheme
- **Primary**: Orange-based theme for community feel
- **Secondary**: Neutral grays for text and backgrounds
- **Accent**: Colors for different alert types and categories

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
npm run start
```

### Backend Deployment
```bash
cd backend
npm run build
npm run start
```

### Production Considerations
- **Environment Variables**: Proper configuration for production
- **Database**: Production database configuration
- **Security**: HTTPS, CORS, and security headers
- **Monitoring**: Logging and error tracking

## 📝 Development Guidelines

### Code Organization
- **Components**: Reusable, single-purpose components
- **Hooks**: Custom hooks for complex logic
- **APIs**: RESTful endpoints with proper error handling
- **Types**: TypeScript interfaces for all data structures

### Best Practices
- **Type Safety**: Use TypeScript throughout
- **Error Handling**: Proper error handling and user feedback
- **Performance**: Optimize images, bundles, and database queries
- **Accessibility**: WCAG compliant components and navigation
- **Testing**: Unit and integration tests for critical features

## 🔍 Troubleshooting

### Common Issues
1. **Port Conflicts**: Ensure ports 3000 and 3001 are available
2. **Database Connection**: Check DATABASE_URL environment variable
3. **CORS Issues**: Verify CORS_ORIGIN configuration
4. **Import Errors**: Check file paths and TypeScript configuration

### Debug Commands
```bash
# Check TypeScript types
npm run type-check

# Check database connection
npm run db:push

# View logs
npm run dev
```