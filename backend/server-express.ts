import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { setupSocket } from './ws/socket';

// --- IMPORTANT: Use require for CommonJS route files ---
const authRoutes = require('./routes/auth');
const communityRoutes = require('./routes/community');

// Initialize Express app and Prisma Client
const app = express();
const db = new PrismaClient();
const httpServer = createServer(app);

// Setup Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
setupSocket(io);

// Middleware setup
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000" }));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// --- API Routes ---

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is healthy' });
});

// ** THE FIX IS HERE **
// Correctly extract the router from the required module.
// The actual router function might be on the .default property.
const authRouter = authRoutes.default || authRoutes;
const communityRouter = communityRoutes.default || communityRoutes;

// Use the extracted routers
app.use('/api/auth', authRouter);
app.use('/api/community', communityRouter);
app.use('/api', communityRouter); // Handles /api/alerts


// --- Server Startup ---
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Backend server with WebSocket running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await db.$disconnect();
  httpServer.close(() => {
    console.log('Server has been gracefully shut down.');
    process.exit(0);
  });
});
