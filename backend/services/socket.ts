import { Server } from 'socket.io';
import { db } from './db';

declare module 'socket.io' {
  interface Socket {
    userId?: string;
  }
}

interface UserSocket {
  userId: string;
  socketId: string;
}

const connectedUsers = new Map<string, string>(); // userId -> socketId

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Handle user authentication
    socket.on('authenticate', async (data: { userId: string; sessionToken: string }) => {
      try {
        // Validate session
        const session = await db.session.findUnique({
          where: { sessionToken: data.sessionToken },
          include: { user: true }
        });

        if (session && session.userId === data.userId && session.expires > new Date()) {
          // Store user connection
          connectedUsers.set(data.userId, socket.id);
          socket.userId = data.userId;
          
          // Join user to their neighborhood room
          if (session.user.neighborhoodId) {
            socket.join(`neighborhood:${session.user.neighborhoodId}`);
          }
          
          // Join user to their personal room
          socket.join(`user:${data.userId}`);
          
          console.log(`User ${data.userId} authenticated and connected`);
          
          socket.emit('authenticated', { success: true });
        } else {
          socket.emit('authenticated', { success: false, error: 'Invalid session' });
        }
      } catch (error) {
        console.error('Authentication error:', error);
        socket.emit('authenticated', { success: false, error: 'Authentication failed' });
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
        if (!socket.userId) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        const user = await db.user.findUnique({
          where: { id: socket.userId },
          include: { neighborhood: true }
        });

        if (!user) {
          socket.emit('error', { message: 'User not found' });
          return;
        }

        const neighborhoodId = data.neighborhoodId || user.neighborhoodId;
        
        if (neighborhoodId) {
          // Broadcast to neighborhood
          io.to(`neighborhood:${neighborhoodId}`).emit('new_alert', {
            id: Math.random().toString(36).substring(7),
            type: data.type,
            title: data.title,
            message: data.message,
            userId: socket.userId,
            userName: user.name || 'Anonymous',
            neighborhoodId,
            timestamp: new Date().toISOString()
          });
        }

        // Send confirmation to sender
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
        if (!socket.userId) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        const recipientSocketId = connectedUsers.get(data.recipientId);
        
        if (recipientSocketId) {
          // Send to specific user
          io.to(recipientSocketId).emit('new_message', {
            id: Math.random().toString(36).substring(7),
            senderId: socket.userId,
            recipientId: data.recipientId,
            message: data.message,
            type: data.type,
            timestamp: new Date().toISOString()
          });
        }

        // Send confirmation to sender
        socket.emit('message_sent', { success: true, recipientId: data.recipientId });
      } catch (error) {
        console.error('Message sending error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle subscription to alert updates
    socket.on('subscribe_alert', (alertId: string) => {
      socket.join(`alert:${alertId}`);
      console.log(`User ${socket.userId} subscribed to alert ${alertId}`);
    });

    // Handle unsubscribe from alert updates
    socket.on('unsubscribe_alert', (alertId: string) => {
      socket.leave(`alert:${alertId}`);
      console.log(`User ${socket.userId} unsubscribed from alert ${alertId}`);
    });

    // Handle alert updates
    socket.on('update_alert', async (data: {
      alertId: string;
      update: string;
      status?: string;
    }) => {
      try {
        if (!socket.userId) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        const user = await db.user.findUnique({
          where: { id: socket.userId }
        });

        if (!user) {
          socket.emit('error', { message: 'User not found' });
          return;
        }

        // Broadcast update to all subscribed users
        io.to(`alert:${data.alertId}`).emit('alert_updated', {
          alertId: data.alertId,
          update: data.update,
          status: data.status,
          updatedBy: socket.userId,
          updatedByName: user.name || 'Anonymous',
          timestamp: new Date().toISOString()
        });

        socket.emit('alert_update_sent', { success: true });
      } catch (error) {
        console.error('Alert update error:', error);
        socket.emit('error', { message: 'Failed to update alert' });
      }
    });

    // Handle messages (legacy support)
    socket.on('message', (msg: { text: string; senderId: string }) => {
      socket.emit('message', {
        text: `Echo: ${msg.text}`,
        senderId: 'system',
        timestamp: new Date().toISOString(),
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      
      // Remove from connected users
      if (socket.userId) {
        connectedUsers.delete(socket.userId);
        console.log(`User ${socket.userId} disconnected`);
      }
    });

    // Send welcome message
    socket.emit('message', {
      text: 'Welcome to PadosHelp Real-time Server!',
      senderId: 'system',
      timestamp: new Date().toISOString(),
    });
  });
};