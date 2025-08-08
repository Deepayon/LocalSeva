"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  CheckCircle,
  X,
  Settings,
  MapPin,
  Clock,
  Droplets,
  Zap,
  Search,
  Car,
  Users,
  Filter,
} from "lucide-react";

const notificationTypes = [
  { name: "All", icon: Bell },
  { name: "Water", icon: Droplets },
  { name: "Power", icon: Zap },
  { name: "Lost & Found", icon: Search },
  { name: "Services", icon: Users },
  { name: "Parking", icon: Car },
];

const mockNotifications = [
  {
    id: 1,
    type: "water",
    title: "Water Supply Available",
    message: "Water supply has started in your area. Expected to last for 2 hours.",
    time: "5 minutes ago",
    read: false,
    priority: "high",
    action: "/water-schedules",
    user: { name: "Water Board", avatar: "/water-board.png" },
  },
  {
    id: 2,
    type: "power",
    title: "Power Outage Alert",
    message: "Unscheduled power outage reported in your neighborhood. Restoration expected in 1 hour.",
    time: "15 minutes ago",
    read: false,
    priority: "high",
    action: "/alerts",
    user: { name: "Power Dept", avatar: "/power-dept.png" },
  },
  {
    id: 3,
    type: "lost",
    title: "Found: Black Wallet",
    message: "Someone found a black wallet matching your lost item report. Check details.",
    time: "1 hour ago",
    read: true,
    priority: "medium",
    action: "/lost-found",
    user: { name: "Priya Sharma", avatar: "/avatars/02.png" },
  },
  {
    id: 4,
    type: "service",
    title: "Service Request Accepted",
    message: "Rajesh Kumar has accepted your plumbing repair request. Expected arrival: 2 PM.",
    time: "2 hours ago",
    read: true,
    priority: "medium",
    action: "/services",
    user: { name: "Rajesh Kumar", avatar: "/avatars/01.png" },
  },
  {
    id: 5,
    type: "parking",
    title: "Parking Spot Available",
    message: "A covered parking spot is now available near your location at ₹50/hour.",
    time: "3 hours ago",
    read: true,
    priority: "low",
    action: "/parking",
    user: { name: "Vikram Singh", avatar: "/avatars/05.png" },
  },
  {
    id: 6,
    type: "community",
    title: "Community Meeting",
    message: "Annual community meeting scheduled for this Sunday at 5 PM in the community center.",
    time: "1 day ago",
    read: true,
    priority: "low",
    action: null,
    user: { name: "Community Admin", avatar: "/community-admin.png" },
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "water": return <Droplets className="w-4 h-4" />;
    case "power": return <Zap className="w-4 h-4" />;
    case "lost": return <Search className="w-4 h-4" />;
    case "service": return <Users className="w-4 h-4" />;
    case "parking": return <Car className="w-4 h-4" />;
    case "community": return <Bell className="w-4 h-4" />;
    default: return <Bell className="w-4 h-4" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "water": return "bg-blue-100 text-blue-700";
    case "power": return "bg-yellow-100 text-yellow-700";
    case "lost": return "bg-red-100 text-red-700";
    case "service": return "bg-green-100 text-green-700";
    case "parking": return "bg-purple-100 text-purple-700";
    case "community": return "bg-gray-100 text-gray-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high": return "bg-red-500";
    case "medium": return "bg-yellow-500";
    case "low": return "bg-green-500";
    default: return "bg-gray-500";
  }
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState("All");
  const [filteredNotifications, setFilteredNotifications] = useState(mockNotifications);

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    if (type === "All") {
      setFilteredNotifications(mockNotifications);
    } else {
      setFilteredNotifications(mockNotifications.filter(n => n.type === type));
    }
  };

  const markAsRead = (id: number) => {
    const updated = mockNotifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setFilteredNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = mockNotifications.map(n => ({ ...n, read: true }));
    setFilteredNotifications(updated);
  };

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view notifications</p>
          <Button onClick={() => window.location.href = "/auth"}>
            Login / Sign Up
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600 mt-1">Stay updated with community activities</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark all as read
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Types */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {notificationTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Button
                  key={type.name}
                  variant={selectedType === type.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTypeSelect(type.name)}
                  className="flex items-center gap-2 whitespace-nowrap flex-shrink-0"
                >
                  <Icon className="w-4 h-4" />
                  {type.name}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`hover:shadow-lg transition-shadow cursor-pointer ${!notification.read ? 'border-l-4 border-l-blue-500' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                        <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1">
                        {getTypeIcon(notification.type)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{notification.title}</h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          <Badge variant="secondary" className={getTypeColor(notification.type)}>
                            {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{notification.time}</span>
                          </div>
                          <span>by {notification.user.name}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        {notification.priority === "high" && (
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`}></div>
                        )}
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="w-6 h-6"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {notification.action && (
                      <div className="mt-3 pt-3 border-t">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-600">Try selecting a different notification type</p>
          </div>
        )}
      </div>
    </div>
  );
}