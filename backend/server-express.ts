import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { setupSocket } from './ws/socket';

// --- Route Imports ---
// Using 'require' to ensure compatibility with different module export styles.
const authRoutes = require('./routes/auth');
const communityRoutes = require('./routes/community');
const adminRoutes = require('./routes/admin'); // Added the admin route import

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

// ** Module Compatibility Fix **
// This logic correctly extracts the router function from the imported module,
// whether it's a CommonJS module (module.exports) or an ES module (export default).
const authRouter = authRoutes.default || authRoutes;
const communityRouter = communityRoutes.default || communityRoutes;
const adminRouter = adminRoutes.default || adminRoutes; // Added the admin router

// Use the extracted routers
app.use('/api/auth', authRouter);
app.use('/api/community', communityRouter);
app.use('/api/admin', adminRouter); // Added the admin router usage
app.use('/api', communityRouter); // Handles routes like /api/alerts


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