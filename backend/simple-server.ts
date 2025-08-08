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

const PORT = process.env.PORT || 9003;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Simple Backend with Socket.IO setup is running' });
});

// Setup Socket.IO
setupSocket(io);

// Start server
server.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 Simple Backend server running on port ${PORT}`);
  console.log(`💚 Health check available at http://localhost:${PORT}/health`);
});

export default app;