import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

// Define a custom interface for the decoded JWT payload for type safety
interface JwtPayload {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

// Extend the Socket.IO Socket interface to include our custom user property
declare module 'socket.io' {
  interface Socket {
    user?: {
      id: string;
      role: string;
    };
  }
}

const connectedUsers = new Map<string, string>(); // Maps userId to socketId

export const setupSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    // --- AUTHENTICATION LOGIC (THE FIX) ---
    // This now verifies the JWT token instead of looking for a database session.
    socket.on('authenticate', async (data: { sessionToken: string }) => {
      try {
        if (!data.sessionToken) {
          throw new Error('No session token provided');
        }
        if (!process.env.JWT_SECRET) {
          throw new Error('JWT_SECRET is not defined on the server.');
        }

        const decoded = jwt.verify(data.sessionToken, process.env.JWT_SECRET) as JwtPayload;

        if (!decoded || !decoded.userId) {
          throw new Error('Invalid token payload');
        }

        const user = await db.user.findUnique({
          where: { id: decoded.userId },
        });

        if (!user) {
          throw new Error('User not found');
        }

        socket.user = { id: user.id, role: user.role };
        connectedUsers.set(user.id, socket.id);

        if (user.neighborhoodId) {
          socket.join(`neighborhood:${user.neighborhoodId}`);
        }
        socket.join(`user:${user.id}`);

        console.log(`User ${user.id} authenticated and connected via WebSocket`);
        socket.emit('authenticated', { success: true });

      } catch (error: any) {
        console.error('WebSocket Authentication error:', error.message);
        socket.emit('authenticated', { success: false, error: 'Invalid session' });
        socket.disconnect();
      }
    });

    // Handle alert creation
    socket.on('create_alert', async (data: {
      type: 'water' | 'power' | 'lost_found' | 'skill' | 'queue' | 'parking';
      title: string;
      message: string;
      neighborhoodId?: string;
    }) => {
      try {
        if (!socket.user) {
          return socket.emit('error', { message: 'Not authenticated' });
        }

        const user = await db.user.findUnique({
          where: { id: socket.user.id },
        });

        if (!user || !user.neighborhoodId) {
          return socket.emit('error', { message: 'User or neighborhood not found' });
        }

        const neighborhoodId = data.neighborhoodId || user.neighborhoodId;
        
        io.to(`neighborhood:${neighborhoodId}`).emit('new_alert', {
          id: Math.random().toString(36).substring(7),
          type: data.type,
          title: data.title,
          message: data.message,
          userId: socket.user.id,
          userName: user.name || 'Anonymous',
          neighborhoodId,
          timestamp: new Date().toISOString()
        });

        socket.emit('alert_created', { success: true });
      } catch (error) {
        console.error('Alert creation error:', error);
        socket.emit('error', { message: 'Failed to create alert' });
      }
    });

    // Handle direct messages
    socket.on('send_message', async (data: {
      recipientId: string;
      message: string;
      type: 'text' | 'alert_update' | 'booking_request';
    }) => {
      try {
        if (!socket.user) {
          return socket.emit('error', { message: 'Not authenticated' });
        }

        const recipientSocketId = connectedUsers.get(data.recipientId);
        
        if (recipientSocketId) {
          io.to(recipientSocketId).emit('new_message', {
            id: Math.random().toString(36).substring(7),
            senderId: socket.user.id,
            recipientId: data.recipientId,
            message: data.message,
            type: data.type,
            timestamp: new Date().toISOString()
          });
        }

        socket.emit('message_sent', { success: true, recipientId: data.recipientId });
      } catch (error) {
        console.error('Message sending error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle subscription to alert updates
    socket.on('subscribe_alert', (alertId: string) => {
        if (socket.user) {
            socket.join(`alert:${alertId}`);
            console.log(`User ${socket.user.id} subscribed to alert ${alertId}`);
        }
    });

    // Handle unsubscribe from alert updates
    socket.on('unsubscribe_alert', (alertId: string) => {
        if (socket.user) {
            socket.leave(`alert:${alertId}`);
            console.log(`User ${socket.user.id} unsubscribed from alert ${alertId}`);
        }
    });

    // Handle alert updates
    socket.on('update_alert', async (data: {
      alertId: string;
      update: string;
      status?: string;
    }) => {
      try {
        if (!socket.user) {
          return socket.emit('error', { message: 'Not authenticated' });
        }

        const user = await db.user.findUnique({
          where: { id: socket.user.id }
        });

        if (!user) {
          return socket.emit('error', { message: 'User not found' });
        }

        io.to(`alert:${data.alertId}`).emit('alert_updated', {
          alertId: data.alertId,
          update: data.update,
          status: data.status,
          updatedBy: socket.user.id,
          updatedByName: user.name || 'Anonymous',
          timestamp: new Date().toISOString()
        });

        socket.emit('alert_update_sent', { success: true });
      } catch (error) {
        console.error('Alert update error:', error);
        socket.emit('error', { message: 'Failed to update alert' });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      if (socket.user) {
        connectedUsers.delete(socket.user.id);
        console.log(`User ${socket.user.id} disconnected`);
      }
    });

    // Send a welcome message on initial connection
    socket.emit('message', {
      text: 'Welcome to PadosHelp Real-time Server!',
      senderId: 'system',
      timestamp: new Date().toISOString(),
    });
  });
};
