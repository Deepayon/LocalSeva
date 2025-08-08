# Development Guide

This guide provides detailed instructions for developing with the LocalSeva monorepo.

## 🏗️ Development Environment

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd localseva

# Install all dependencies
npm run install:all

# Set up environment variables
cp .env.example .env
```

### Environment Variables

Create environment files for each application:

#### Root `.env`
```
# Database
DATABASE_URL="file:./packages/db/db/custom.db"

# JWT
JWT_SECRET=your-super-secret-jwt-key

# API URLs
API_URL=http://localhost:3001
WEB_URL=http://localhost:3000
```

#### Web App (`apps/web/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### API App (`apps/api/.env`)
```
PORT=3001
NODE_ENV=development
DATABASE_URL="file:./../packages/db/db/custom.db"
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=http://localhost:3000
```

## 🚀 Development Commands

### Running Applications

```bash
# Development - both apps
npm run dev

# Development - web app only
npm run dev:web

# Development - API only
npm run dev:api

# Production
npm run start
```

### Database Operations

```bash
# Push schema to database
npm run db:push

# Generate Prisma client
npm run db:generate

# Create and run migrations
npm run db:migrate

# Reset database
npm run db:reset

# Seed database with test data
npm run db:seed
```

### Building and Testing

```bash
# Build all applications
npm run build

# Build specific application
npm run build:web
npm run build:api

# Lint all code
npm run lint

# Lint specific application
npm run lint:web
npm run lint:api
```

## 📁 Code Organization

### Package Structure

#### Web Application (`apps/web`)
```
src/
├── app/              # Next.js App Router
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Home page
│   ├── about/        # About page
│   ├── auth/         # Authentication pages
│   ├── alerts/       # Alert management
│   ├── admin/        # Admin dashboard
│   └── ...
├── components/       # React components
│   ├── ui/           # shadcn/ui components
│   ├── layout/       # Layout components
│   └── forms/        # Form components
├── hooks/           # Custom React hooks
├── contexts/        # React contexts
└── lib/             # Web-specific utilities
```

#### API Application (`apps/api`)
```
src/
├── routes/          # API endpoints
│   ├── auth/        # Authentication routes
│   ├── community/   # Community features
│   ├── alerts/      # Alert management
│   └── ...
├── middleware/      # Express middleware
└── lib/            # API utilities
```

#### Shared Packages

```
packages/
├── ui/             # UI components library
├── types/          # TypeScript definitions
├── utils/          # Shared utilities
└── db/             # Database schema and migrations
```

## 🔧 Development Workflow

### 1. Adding New Features

#### Step 1: Define Types
```typescript
// packages/types/src/index.ts
export interface NewFeature {
  id: string;
  title: string;
  // ... other properties
}
```

#### Step 2: Backend Implementation
```typescript
// apps/api/src/routes/new-feature/route.ts
import { NewFeature } from '@localseva/types';

export const createNewFeature = async (data: NewFeature) => {
  // Implementation
};
```

#### Step 3: Frontend Implementation
```typescript
// apps/web/src/components/NewFeature.tsx
import { NewFeature } from '@localseva/types';

export const NewFeature = ({ data }: { data: NewFeature }) => {
  // Component implementation
};
```

### 2. Database Changes

```bash
# 1. Update schema
cd packages/db
# Edit prisma/schema.prisma

# 2. Push changes
npm run db:push

# 3. Generate client
npm run db:generate

# 4. Update types if needed
cd ../types
# Update type definitions
```

### 3. Adding UI Components

```typescript
// packages/ui/src/ui/new-component.tsx
import { cn } from '../lib/utils';
import { forwardRef } from 'react';

export const NewComponent = forwardRef<HTMLDivElement, NewComponentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('base-styles', className)} {...props} />
    );
  }
);

// Export from index
export { NewComponent };
```

## 🎨 Styling Guidelines

### Tailwind CSS Configuration

The project uses Tailwind CSS with custom configuration:

```typescript
// apps/web/tailwind.config.ts
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        // ... other custom colors
      },
    },
  },
};
```

### Component Styling

```typescript
// Use consistent styling patterns
import { cn } from '@localseva/ui';

export const MyComponent = ({ className }) => (
  <div className={cn(
    'bg-white rounded-lg border shadow-sm',
    className
  )}>
    {/* Content */}
  </div>
);
```

## 🔒 Authentication Flow

### OTP Authentication

1. **Send OTP**: User enters phone number
2. **Verify OTP**: User enters received OTP
3. **Complete Profile**: User sets up profile
4. **JWT Token**: Server returns access token

### Usage in Components

```typescript
// apps/web/src/hooks/use-auth.ts
export const useAuth = () => {
  const { user, login, logout } = useAuthContext();
  return { user, login, logout };
};
```

## 🌐 Real-time Features

### WebSocket Integration

```typescript
// apps/web/src/lib/socket.ts
import { io } from 'socket.io-client';

export const socket = io(process.env.NEXT_PUBLIC_WS_URL!);

// apps/api/src/lib/socket.ts
import { Server } from 'socket.io';

const io = new Server(server, {
  cors: { origin: process.env.CORS_ORIGIN }
});
```

### Real-time Events

```typescript
// Listen for events
socket.on('community-update', (data) => {
  // Handle update
});

// Emit events
socket.emit('join-community', communityId);
```

## 📊 Performance Optimization

### Frontend Optimization

```typescript
// Use dynamic imports for large components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
});

// Use React Query for data fetching
const { data, isLoading } = useQuery({
  queryKey: ['community-feed'],
  queryFn: fetchCommunityFeed,
});
```

### Backend Optimization

```typescript
// Database query optimization
const users = await db.user.findMany({
  select: {
    id: true,
    name: true,
    avatar: true,
  },
  take: 20,
  skip: 0,
});

// API response caching
app.get('/api/community/stats', cache('5m'), async (req, res) => {
  // Implementation
});
```

## 🧪 Testing

### Unit Testing

```bash
# Run tests
npm test

# Run tests for specific package
cd packages/ui && npm test
```

### Integration Testing

```bash
# Run integration tests
npm run test:integration

# Test API endpoints
npm run test:api
```

## 🚀 Deployment

### Frontend Deployment

```bash
cd apps/web
npm run build
npm run start
```

### Backend Deployment

```bash
cd apps/api
npm run build
npm run start
```

### Environment Setup

```bash
# Production environment variables
NODE_ENV=production
DATABASE_URL="production-database-url"
JWT_SECRET="production-jwt-secret"
```

## 🔍 Debugging

### Common Issues

1. **Import Errors**: Ensure proper workspace configuration
2. **Database Connection**: Check DATABASE_URL environment variable
3. **CORS Issues**: Verify CORS_ORIGIN configuration
4. **Type Errors**: Run TypeScript compiler to check types

### Debug Commands

```bash
# Check TypeScript types
npm run type-check

# Lint code
npm run lint

# Check database connection
npm run db:push
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)