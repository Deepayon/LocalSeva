'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/contexts/auth-context';

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
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [alerts, setAlerts] = useState<RealTimeAlert[]>([]);
  const [messages, setMessages] = useState<RealTimeMessage[]>([]);
  const [alertUpdates, setAlertUpdates] = useState<AlertUpdate[]>([]);

  useEffect(() => {
    if (!user || !sessionToken) return;

    const socket = io({
      path: '/api/socketio',
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      
      // Authenticate with the server
      socket.emit('authenticate', {
        userId: user.id,
        sessionToken
      });
    });

    socket.on('authenticated', (data: { success: boolean; error?: string }) => {
      if (data.success) {
        console.log('Socket authenticated successfully');
      } else {
        console.error('Socket authentication failed:', data.error);
      }
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Listen for new alerts
    socket.on('new_alert', (alert: RealTimeAlert) => {
      setAlerts(prev => [alert, ...prev]);
    });

    // Listen for new messages
    socket.on('new_message', (message: RealTimeMessage) => {
      setMessages(prev => [message, ...prev]);
    });

    // Listen for alert updates
    socket.on('alert_updated', (update: AlertUpdate) => {
      setAlertUpdates(prev => [update, ...prev]);
    });

    // Handle errors
    socket.on('error', (error: { message: string }) => {
      console.error('Socket error:', error.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [user, sessionToken]);

  const createAlert = (data: {
    type: 'water' | 'power' | 'lost_found' | 'skill' | 'queue' | 'parking';
    title: string;
    message: string;
    neighborhoodId?: string;
  }) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('create_alert', data);
    }
  };

  const sendMessage = (data: {
    recipientId: string;
    message: string;
    type: 'text' | 'alert_update' | 'booking_request';
  }) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('send_message', data);
    }
  };

  const subscribeToAlert = (alertId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('subscribe_alert', alertId);
    }
  };

  const unsubscribeFromAlert = (alertId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('unsubscribe_alert', alertId);
    }
  };

  const updateAlert = (data: {
    alertId: string;
    update: string;
    status?: string;
  }) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('update_alert', data);
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