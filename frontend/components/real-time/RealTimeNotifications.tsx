'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, X, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';
import { useRealTime } from '@/hooks/useRealTime';
import { useAuth } from '@/contexts/auth-context';

export function RealTimeNotifications() {
  const { user } = useAuth();
  const { 
    isConnected, 
    alerts, 
    messages, 
    alertUpdates, 
    clearAlerts, 
    clearMessages, 
    clearAlertUpdates 
  } = useRealTime();
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'alerts' | 'messages' | 'updates'>('alerts');

  if (!user) return null;

  const totalNotifications = alerts.length + messages.length + alertUpdates.length;

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'water':
        return '💧';
      case 'power':
        return '⚡';
      case 'lost_found':
        return '🔍';
      case 'skill':
        return '🛠️';
      case 'queue':
        return '📋';
      case 'parking':
        return '🚗';
      default:
        return '📢';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'water':
        return 'bg-blue-100 text-blue-800';
      case 'power':
        return 'bg-yellow-100 text-yellow-800';
      case 'lost_found':
        return 'bg-purple-100 text-purple-800';
      case 'skill':
        return 'bg-green-100 text-green-800';
      case 'queue':
        return 'bg-orange-100 text-orange-800';
      case 'parking':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2"
      >
        <Bell className="h-5 w-5" />
        {totalNotifications > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {totalNotifications}
          </span>
        )}
        <span className="sr-only">Notifications</span>
      </Button>

      {/* Connection Status */}
      <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${
        isConnected ? 'bg-green-500' : 'bg-red-500'
      }`} />

      {/* Notification Panel */}
      {isOpen && (
        <Card className="absolute right-0 top-12 w-96 z-50 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Real-time Updates</CardTitle>
              <div className="flex items-center space-x-2">
                <div className={`h-2 w-2 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-xs text-gray-500">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex space-x-1">
              <Button
                variant={activeTab === 'alerts' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('alerts')}
                className="flex-1"
              >
                Alerts ({alerts.length})
              </Button>
              <Button
                variant={activeTab === 'messages' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('messages')}
                className="flex-1"
              >
                Messages ({messages.length})
              </Button>
              <Button
                variant={activeTab === 'updates' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('updates')}
                className="flex-1"
              >
                Updates ({alertUpdates.length})
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {/* Alerts Tab */}
              {activeTab === 'alerts' && (
                <div className="p-4 space-y-3">
                  {alerts.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No new alerts</p>
                  ) : (
                    alerts.map((alert) => (
                      <div key={alert.id} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getAlertIcon(alert.type)}</span>
                            <Badge className={getAlertColor(alert.type)}>
                              {alert.type.replace('_', ' ')}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{alert.title}</h4>
                          <p className="text-sm text-gray-600">{alert.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            by {alert.userName}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  {alerts.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAlerts}
                      className="w-full"
                    >
                      Clear All Alerts
                    </Button>
                  )}
                </div>
              )}

              {/* Messages Tab */}
              {activeTab === 'messages' && (
                <div className="p-4 space-y-3">
                  {messages.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No new messages</p>
                  ) : (
                    messages.map((message) => (
                      <div key={message.id} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <MessageSquare className="h-4 w-4 text-blue-500" />
                            <Badge variant="outline">
                              {message.type.replace('_', ' ')}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm">{message.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            From user {message.senderId}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  {messages.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearMessages}
                      className="w-full"
                    >
                      Clear All Messages
                    </Button>
                  )}
                </div>
              )}

              {/* Updates Tab */}
              {activeTab === 'updates' && (
                <div className="p-4 space-y-3">
                  {alertUpdates.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No new updates</p>
                  ) : (
                    alertUpdates.map((update) => (
                      <div key={update.alertId} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <Badge variant="outline">Alert Update</Badge>
                            {update.status && (
                              <Badge variant="secondary">{update.status}</Badge>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(update.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm">{update.update}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Updated by {update.updatedByName}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  {alertUpdates.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAlertUpdates}
                      className="w-full"
                    >
                      Clear All Updates
                    </Button>
                  )}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}