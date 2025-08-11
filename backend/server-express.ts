import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { setupSocket } from './services/socket';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  path: '/api/socketio',
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = Number(process.env.PORT) || 8001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'LocalSeva Backend is running' });
});

// Setup Socket.IO
setupSocket(io);

// Start server
server.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 LocalSeva Backend server running on port ${PORT}`);
  console.log(`📡 Socket.IO server running at ws://localhost:${PORT}/api/socketio`);
  console.log(`💚 Health check available at http://localhost:${PORT}/health`);
});

export default app;