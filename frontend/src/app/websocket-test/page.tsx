'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Message = {
  text: string;
  senderId: string;
  timestamp: string;
}

type Alert = {
  id: string;
  type: 'water' | 'power' | 'lost_found' | 'skill' | 'queue' | 'parking';
  title: string;
  message: string;
  userId: string;
  userName: string;
  neighborhoodId: string;
  timestamp: string;
}

export default function WebSocketTestPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Not Connected');

  useEffect(() => {
    const socketInstance = io('http://localhost:3002', {
      path: '/api/socketio',
      transports: ['websocket', 'polling'],
      timeout: 5000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      setIsConnected(true);
      setConnectionStatus('Connected');
      console.log('Connected to WebSocket server');
    });

    socketInstance.on('disconnect', (reason) => {
      setIsConnected(false);
      setConnectionStatus(`Disconnected: ${reason}`);
      console.log('Disconnected from WebSocket server:', reason);
    });

    socketInstance.on('connect_error', (error) => {
      setIsConnected(false);
      setConnectionStatus(`Connection Error: ${error.message}`);
      console.error('Connection error:', error.message);
    });

    socketInstance.on('message', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
      console.log('Received message:', msg);
    });

    socketInstance.on('new_alert', (alert: Alert) => {
      setAlerts(prev => [alert, ...prev]);
      console.log('Received alert:', alert);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (socket && inputMessage.trim()) {
      const message = {
        text: inputMessage.trim(),
        senderId: socket.id || 'user',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, message]);
      socket.emit('message', message);
      setInputMessage('');
    }
  };

  const sendTestAlert = () => {
    if (socket) {
      const alert = {
        type: 'water' as const,
        title: 'Test Water Alert',
        message: 'This is a test water alert from WebSocket test page',
        neighborhoodId: '1'
      };
      
      socket.emit('create_alert', alert);
      console.log('Sent test alert:', alert);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            WebSocket Connection Test
            <Badge variant={isConnected ? "default" : "destructive"}>
              {connectionStatus}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <span className="font-medium">Server URL:</span>
              <div className="text-gray-600">http://localhost:3002</div>
            </div>
            <div className="space-y-2">
              <span className="font-medium">Socket Path:</span>
              <div className="text-gray-600">/api/socketio</div>
            </div>
            <div className="space-y-2">
              <span className="font-medium">Connection ID:</span>
              <div className="text-gray-600 font-mono text-xs">
                {socket?.id || 'N/A'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Message Testing
                <Button variant="outline" size="sm" onClick={clearMessages}>
                  Clear Messages
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScrollArea className="h-80 w-full border rounded-md p-4">
                <div className="space-y-2">
                  {messages.length === 0 ? (
                    <p className="text-gray-500 text-center">No messages yet</p>
                  ) : (
                    messages.map((msg, index) => (
                      <div key={index} className="border-b pb-2 last:border-b-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-700">
                              {msg.senderId}
                            </p>
                            <p className="text-gray-900">{msg.text}</p>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>

              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  disabled={!isConnected}
                  className="flex-1"
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={!isConnected || !inputMessage.trim()}
                >
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Alert Testing
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={clearAlerts}>
                    Clear Alerts
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={sendTestAlert}
                    disabled={!isConnected}
                  >
                    Send Test Alert
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80 w-full border rounded-md p-4">
                <div className="space-y-2">
                  {alerts.length === 0 ? (
                    <p className="text-gray-500 text-center">No alerts yet</p>
                  ) : (
                    alerts.map((alert, index) => (
                      <div key={index} className="border rounded-lg p-3 space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge variant="outline">{alert.type}</Badge>
                              <h4 className="font-medium">{alert.title}</h4>
                            </div>
                            <p className="text-sm text-gray-600">{alert.message}</p>
                            <div className="text-xs text-gray-500 mt-1">
                              By: {alert.userName} | {new Date(alert.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}