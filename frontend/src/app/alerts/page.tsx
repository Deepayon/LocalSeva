"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  MapPin,
  Clock,
  AlertTriangle,
  Zap,
  Droplets,
  Car,
  Users,
  Filter,
  Loader2,
  Plus,
} from "lucide-react";
import { RealTimeAlertCreator } from "@/components/real-time/RealTimeAlertCreator";

const alertTypes = [
  { name: "All", icon: AlertTriangle, color: "bg-gray-100 text-gray-700" },
  { name: "Power", icon: Zap, color: "bg-yellow-100 text-yellow-700" },
  { name: "Water", icon: Droplets, color: "bg-blue-100 text-blue-700" },
  { name: "Traffic", icon: Car, color: "bg-red-100 text-red-700" },
  { name: "Services", icon: Users, color: "bg-green-100 text-green-700" },
];

const severityLevels = [
  { name: "All", value: "all" },
  { name: "Low", value: "low" },
  { name: "Medium", value: "medium" },
  { name: "High", value: "high" },
];

const statuses = [
  { name: "All", value: "all" },
  { name: "Active", value: "active" },
  { name: "Scheduled", value: "scheduled" },
  { name: "Resolved", value: "resolved" },
];

interface Alert {
  id: string;
  title: string;
  description: string;
  type: string;
  severity: string;
  status: string;
  location: string;
  affectedPeople: number;
  expectedResolution?: string;
  reportedAt: string;
  reporter: {
    name: string;
    avatar?: string;
  };
  neighborhood: {
    name: string;
    city: string;
  };
}

export default function AlertsPage() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    if (user) {
      fetchAlerts();
    }
  }, [user]);

  useEffect(() => {
    filterAlerts();
  }, [alerts, searchQuery, selectedType, selectedSeverity, selectedStatus]);

  const fetchAlerts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/alerts');
      if (response.ok) {
        const data = await response.json();
        setAlerts(data.alerts || []);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setAlerts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAlerts = () => {
    let filtered = alerts;

    // Filter by type
    if (selectedType !== "All") {
      filtered = filtered.filter(alert => alert.type.toLowerCase() === selectedType.toLowerCase());
    }

    // Filter by severity
    if (selectedSeverity !== "all") {
      filtered = filtered.filter(alert => alert.severity.toLowerCase() === selectedSeverity);
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter(alert => alert.status.toLowerCase() === selectedStatus);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(alert =>
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by severity and reported date
    filtered.sort((a, b) => {
      const severityOrder = { high: 3, medium: 2, low: 1 };
      const aSeverity = severityOrder[a.severity as keyof typeof severityOrder] || 0;
      const bSeverity = severityOrder[b.severity as keyof typeof severityOrder] || 0;
      
      if (aSeverity !== bSeverity) {
        return bSeverity - aSeverity;
      }
      
      return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
    });

    setFilteredAlerts(filtered);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high": return "bg-red-100 text-red-700 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "bg-red-100 text-red-700 border-red-200";
      case "scheduled": return "bg-blue-100 text-blue-700 border-blue-200";
      case "resolved": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "power": return Zap;
      case "water": return Droplets;
      case "traffic": return Car;
      case "services": return Users;
      default: return AlertTriangle;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return diffInMinutes <= 1 ? "Just now" : `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view alerts</p>
          <Button onClick={() => window.location.href = "/auth"}>
            Login / Sign Up
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Community Alerts</h1>
              <p className="text-gray-600 mt-1">
                Stay informed about what's happening in {user.neighborhood?.name || 'your neighborhood'}
              </p>
            </div>
            <Button 
              onClick={() => document.getElementById('create-alert-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Alert
            </Button>
          </div>
        </div>
      </div>

      {/* Create Alert Section */}
      <div id="create-alert-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <RealTimeAlertCreator />
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search alerts by title, description, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>

          {/* Filter Options */}
          <div className="flex flex-wrap gap-4">
            {/* Alert Types */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Type:</span>
              <div className="flex gap-1">
                {alertTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Button
                      key={type.name}
                      variant={selectedType === type.name ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedType(type.name)}
                      className="flex items-center gap-1"
                    >
                      <Icon className="w-3 h-3" />
                      {type.name}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Severity Levels */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Severity:</span>
              <div className="flex gap-1">
                {severityLevels.map((level) => (
                  <Button
                    key={level.value}
                    variant={selectedSeverity === level.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSeverity(level.value)}
                  >
                    {level.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <div className="flex gap-1">
                {statuses.map((status) => (
                  <Button
                    key={status.value}
                    variant={selectedStatus === status.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus(status.value)}
                  >
                    {status.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-4">
          {filteredAlerts.map((alert) => {
            const TypeIcon = getTypeIcon(alert.type);
            return (
              <Card key={alert.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${alertTypes.find(t => t.name.toLowerCase() === alert.type.toLowerCase())?.color || 'bg-gray-100 text-gray-700'}`}>
                        <TypeIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{alert.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(alert.status)}>
                            {alert.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {formatTimeAgo(alert.reportedAt)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">{alert.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{alert.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{alert.affectedPeople} people affected</span>
                    </div>
                    {alert.expectedResolution && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Expected: {alert.expectedResolution}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={alert.reporter.avatar} />
                        <AvatarFallback className="text-xs">
                          {alert.reporter.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-600">
                        Reported by {alert.reporter.name}
                      </span>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
            <p className="text-gray-600">
              {alerts.length === 0 
                ? "No alerts available in your area."
                : "Try adjusting your search or filter criteria"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}