'use client';

import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/auth-context';

interface RealTimeAlert {
  id: string;
  type: 'water' | 'power' | 'lost_found' | 'skill' | 'queue' | 'parking';
  title: string;
  message: string;
  userId: string;
  userName: string;
  neighborhoodId: string;
  timestamp: string;
}

interface RealTimeMessage {
  id: string;
  senderId: string;
  recipientId: string;
  message: string;
  type: 'text' | 'alert_update' | 'booking_request';
  timestamp: string;
}

interface AlertUpdate {
  alertId: string;
  update: string;
  status?: string;
  updatedBy: string;
  updatedByName: string;
  timestamp: string;
}

export const useRealTime = () => {
  const { user, sessionToken } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [alerts, setAlerts] = useState<RealTimeAlert[]>([]);
  const [messages, setMessages] = useState<RealTimeMessage[]>([]);
  const [alertUpdates, setAlertUpdates] = useState<AlertUpdate[]>([]);

  useEffect(() => {
    if (user && sessionToken) {
      console.log('Attempting to connect to WebSocket server...');
      // Initialize socket connection
      const newSocket = io('http://localhost:3004', {
        path: '/api/socketio',
        transports: ['websocket', 'polling'],
        timeout: 5000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      newSocket.on('connect', () => {
        console.log('Connected to WebSocket server, authenticating...');
        // Authenticate after connection
        newSocket.emit('authenticate', {
          userId: user.id,
          sessionToken: sessionToken
        });
      });

      newSocket.on('authenticated', (data) => {
        if (data.success) {
          console.log('Authentication successful');
          setIsConnected(true);
        } else {
          console.error('Authentication failed:', data.error);
          setIsConnected(false);
        }
      });

      newSocket.on('disconnect', (reason) => {
        console.log('Disconnected from WebSocket server:', reason);
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Connection error:', error.message);
        setIsConnected(false);
      });

      // Listen for real-time alerts
      newSocket.on('new_alert', (alert: RealTimeAlert) => {
        console.log('Received alert:', alert);
        setAlerts(prev => [alert, ...prev]);
      });

      // Listen for messages
      newSocket.on('new_message', (message: RealTimeMessage) => {
        console.log('Received message:', message);
        setMessages(prev => [message, ...prev]);
      });

      // Listen for alert updates
      newSocket.on('alert_updated', (update: AlertUpdate) => {
        console.log('Received alert update:', update);
        setAlertUpdates(prev => [update, ...prev]);
      });

      // Listen for welcome messages
      newSocket.on('message', (msg: any) => {
        console.log('Received message:', msg);
      });

      setSocket(newSocket);

      return () => {
        console.log('Cleaning up socket connection...');
        newSocket.close();
      };
    } else {
      console.log('No user or session token, skipping WebSocket connection');
    }
  }, [user, sessionToken]);

  const createAlert = (data: {
    type: 'water' | 'power' | 'lost_found' | 'skill' | 'queue' | 'parking';
    title: string;
    message: string;
    neighborhoodId?: string;
  }) => {
    if (socket && isConnected) {
      socket.emit('create_alert', {
        ...data,
        userId: user?.id,
        userName: user?.name,
        timestamp: new Date().toISOString()
      });
    } else {
      console.log('Socket not connected, cannot create alert');
    }
  };

  const sendMessage = (data: {
    recipientId: string;
    message: string;
    type: 'text' | 'alert_update' | 'booking_request';
  }) => {
    if (socket && isConnected) {
      socket.emit('send_message', {
        ...data,
        senderId: user?.id,
        timestamp: new Date().toISOString()
      });
    } else {
      console.log('Socket not connected, cannot send message');
    }
  };

  const subscribeToAlert = (alertId: string) => {
    if (socket && isConnected) {
      socket.emit('subscribe_alert', alertId);
    }
  };

  const unsubscribeFromAlert = (alertId: string) => {
    if (socket && isConnected) {
      socket.emit('unsubscribe_alert', alertId);
    }
  };

  const updateAlert = (data: {
    alertId: string;
    update: string;
    status?: string;
  }) => {
    if (socket && isConnected) {
      socket.emit('update_alert', {
        ...data,
        updatedBy: user?.id,
        updatedByName: user?.name,
        timestamp: new Date().toISOString()
      });
    }
  };

  const clearAlerts = () => setAlerts([]);
  const clearMessages = () => setMessages([]);
  const clearAlertUpdates = () => setAlertUpdates([]);

  return {
    isConnected,
    alerts,
    messages,
    alertUpdates,
    createAlert,
    sendMessage,
    subscribeToAlert,
    unsubscribeFromAlert,
    updateAlert,
    clearAlerts,
    clearMessages,
    clearAlertUpdates
  };
};