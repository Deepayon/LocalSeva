# LocalSeva - Hyperlocal Community Platform

A clean, organized project structure for connecting neighborhoods through shared services and information exchange.

## 📁 Project Structure

```
localseva/
├── frontend/                          # Next.js frontend app
│   ├── app/                           # Next.js App Router
│   ├── components/                    # React components
│   ├── context/                       # React Context providers
│   ├── hooks/                         # Custom hooks
│   ├── styles/                        # Tailwind / CSS
│   ├── public/                        # Static assets (images, icons)
│   ├── middleware.ts
│   ├── tailwind.config.ts
│   ├── postcss.config.mjs
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── .gitignore
├── backend/                           # Server, DB, WebSocket, APIs
│   ├── prisma/                        # Prisma schema & DB client
│   │   └── schema.prisma
│   ├── services/                      # DB queries, business logic
│   ├── ws/                            # WebSocket server code
│   ├── scripts/                       # Seeders, reset scripts
│   ├── server.ts                      # Custom server (if used)
│   ├── test-otp.js                    # Test scripts
│   ├── tsconfig.json
│   ├── package.json
│   └── .gitignore
├── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install all dependencies
npm run install:all

# Or install separately
npm install
cd frontend && npm install
cd ../backend && npm install
```

### Development

```bash
# Run both frontend and backend
npm run dev

# Frontend only (http://localhost:3000)
npm run dev:frontend

# Backend only (http://localhost:3001)
npm run dev:backend
```

## 🎯 Features

### Frontend (Next.js)
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context and custom hooks
- **Authentication**: OTP-based authentication system
- **Real-time**: WebSocket integration for live updates
- **Responsive**: Mobile-first design

### Backend (Express.js)
- **API**: RESTful API endpoints
- **Database**: SQLite with Prisma ORM
- **Real-time**: Socket.io for WebSocket connections
- **Authentication**: JWT-based authentication
- **WebSocket**: Real-time communication server

## 📱 Application Features

- **Community Feed**: Real-time neighborhood updates
- **Alert System**: Water, power, and security alerts
- **Lost & Found**: Community-driven item recovery
- **Service Exchange**: Skill sharing and local services
- **Water Schedules**: Municipal water supply information
- **Real-time Updates**: WebSocket-powered notifications

## 🔧 Development Commands

### Frontend
```bash
cd frontend
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # Lint code
```

### Backend
```bash
cd backend
npm run dev          # Development server
npm run start        # Production server
npm run lint         # Lint code
npm run db:push      # Push schema to database
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations
npm run db:reset     # Reset database
npm run db:seed      # Seed database
```

### Root Commands
```bash
npm run dev            # Both frontend and backend
npm run build          # Build both applications
npm run start          # Start both applications
npm run lint           # Lint both applications
npm run install:all    # Install all dependencies
```

## 🌐 Environment Variables

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

### Backend (`.env`)
```
PORT=3001
DATABASE_URL="file:./db/custom.db"
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=http://localhost:3000
```

## 📚 Documentation

- [Project Structure](./PROJECT_STRUCTURE.md) - Detailed structure overview
- [Development Guide](./DEVELOPMENT.md) - Development workflow and practices
- [Authentication Flow](./AUTH_FLOW.md) - Authentication system details
- [Admin Security](./ADMIN_SECURITY.md) - Admin security guidelines
- [Admin Documentation](./ADMIN.md) - Admin features and usage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ for Indian communities