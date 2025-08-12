"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Droplets,
  Zap,
  Search,
  Car,
  Users,
  MapPin,
  Clock,
  Plus,
  Bell,
  TrendingUp,
  Loader2,
  CheckCircle,
  MessageCircle,
  Heart,
  Share,
  Filter
} from "lucide-react";
import { useAuth } from "../context/auth-context";
import { useRealTime } from "../hooks/useRealTime";

interface CommunityStats {
  totalUsers: number;
  activeUsers: number;
  totalNeighborhoods: number;
  recentActivity: {
    waterSchedules: number;
    powerOutages: number;
    lostItems: number;
    foundItems: number;
    skills: number;
    parkingSpots: number;
    total: number;
  };
  activityPercentage: number;
  activityStatus: string;
}

interface ActivityItem {
  id: string;
  type: 'water' | 'power' | 'lost' | 'found' | 'skill' | 'parking' | 'queue';
  title: string;
  description: string;
  time: string;
  user: {
    name: string;
    avatar?: string;
  };
  verified: boolean;
  neighborhoodId?: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("all");
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { isConnected } = useRealTime();
  const [communityStats, setCommunityStats] = useState<CommunityStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [localAlerts, setLocalAlerts] = useState<any[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const activitiesPerPage = 5;

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user && !isLoading) {
      // Fetch all data in parallel for better performance
      const fetchAllData = async () => {
        try {
          const [statsResponse, feedResponse, alertsResponse] = await Promise.all([
            fetch('/api/community/stats'),
            fetch('/api/community/feed'),
            fetch('/api/alerts')
          ]);

          // Process responses in parallel
          const [statsData, feedData, alertsData] = await Promise.all([
            statsResponse.json(),
            feedResponse.json(),
            alertsResponse.json()
          ]);

          if (statsResponse.ok) {
            setCommunityStats(statsData.stats);
          }
          if (feedResponse.ok) {
            setActivities(feedData.activities);
          }
          if (alertsResponse.ok) {
            // Show only first 3 alerts on homepage
            setLocalAlerts((alertsData.alerts || []).slice(0, 3));
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoadingStats(false);
          setIsLoadingActivities(false);
          setIsLoadingAlerts(false);
        }
      };

      fetchAllData();
    }
  }, [user, isLoading]);

  // Reset current page when active tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "water": return <Droplets className="w-4 h-4" />;
      case "power": return <Zap className="w-4 h-4" />;
      case "lost": return <Search className="w-4 h-4" />;
      case "found": return <Search className="w-4 h-4" />;
      case "skill": return <Users className="w-4 h-4" />;
      case "parking": return <Car className="w-4 h-4" />;
      case "queue": return <Clock className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "water": return "bg-blue-100 text-blue-700";
      case "power": return "bg-yellow-100 text-yellow-700";
      case "lost": return "bg-red-100 text-red-700";
      case "found": return "bg-green-100 text-green-700";
      case "skill": return "bg-purple-100 text-purple-700";
      case "parking": return "bg-indigo-100 text-indigo-700";
      case "queue": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // Skeleton loading component
  const SkeletonCard = () => (
    <div className="border-b animate-pulse">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 bg-gray-200 rounded-full ring-2 ring-gray-100"></div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-300 rounded-full ring-2 ring-white"></div>
          </div>
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-3"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-12"></div>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Skeleton loading component for alerts
  const AlertSkeleton = () => (
    <div className="border rounded-lg p-4 animate-pulse">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-2">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          <div className="flex items-center space-x-4">
            <div className="h-2 bg-gray-200 rounded w-12"></div>
            <div className="h-2 bg-gray-200 rounded w-16"></div>
            <div className="h-2 bg-gray-200 rounded w-14"></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Skeleton loading component for stats
  const StatsSkeleton = () => (
    <div className="bg-white/20 rounded-lg p-4 animate-pulse">
      <div className="flex items-center space-x-2 mb-2">
        <div className="w-5 h-5 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 rounded w-32"></div>
      </div>
      <div className="h-8 bg-gray-300 rounded w-16 mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-24"></div>
    </div>
  );

  const filteredActivities = activeTab === "all"
    ? activities
    : activities.filter(activity => activity.type === activeTab);

  // Pagination logic
  const indexOfLastActivity = currentPage * activitiesPerPage;
  const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
  const currentActivities = filteredActivities.slice(indexOfFirstActivity, indexOfLastActivity);
  const totalPages = Math.ceil(filteredActivities.length / activitiesPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg p-6 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Welcome to PadosHelp
            </h1>
            <p className="text-orange-100 mb-4">
              Your neighborhood community platform for sharing services and information
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{user?.neighborhood?.name || 'Your Neighborhood'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>
                  {isLoadingStats ? (
                    <div className="h-4 bg-gray-300 rounded w-16 animate-pulse inline-block"></div>
                  ) : (
                    `${communityStats?.activeUsers || 0} active neighbors`
                  )}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-xs">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            {isLoadingStats ? (
              <StatsSkeleton />
            ) : (
              <div className="bg-white/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-medium">Community Activity</span>
                </div>
                <div className="text-2xl font-bold">
                  {communityStats?.activityPercentage || 0}%
                </div>
                <div className="text-sm text-orange-100">
                  {communityStats?.activityStatus || 'Normal'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Local Alerts */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Local Alerts</CardTitle>
              <Link href="/alerts">
                <Button variant="outline" size="sm">
                  View All Alerts
                </Button>
              </Link>
            </div>
            <p className="text-gray-600">
              Important updates in {user?.neighborhood?.name || 'your area'}
            </p>
          </CardHeader>
          <CardContent>
            {isLoadingAlerts ? (
              // Show skeleton loading states for alerts
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <AlertSkeleton key={index} />
                ))}
              </div>
            ) : localAlerts.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No active alerts in your area</p>
              </div>
            ) : (
              <div className="space-y-4">
                {localAlerts.map((alert) => {
                  const getSeverityColor = (severity: string) => {
                    switch (severity.toLowerCase()) {
                      case "high": return "bg-red-100 text-red-700 border-red-200";
                      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
                      case "low": return "bg-green-100 text-green-700 border-green-200";
                      default: return "bg-gray-100 text-gray-700 border-gray-200";
                    }
                  };

                  const getTypeIcon = (type: string) => {
                    switch (type.toLowerCase()) {
                      case "power": return Zap;
                      case "water": return Droplets;
                      case "traffic": return Car;
                      case "services": return Users;
                      default: return Bell;
                    }
                  };

                  const TypeIcon = getTypeIcon(alert.type);
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

                  return (
                    <div key={alert.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                          <TypeIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{alert.title}</h4>
                            <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                              {alert.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{alert.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>{alert.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatTimeAgo(alert.reportedAt)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>{alert.affectedPeople} affected</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Link href="/water-schedules">
          <Button variant="outline" className="h-20 w-full flex-col space-y-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200">
            <Droplets className="w-6 h-6" />
            <span className="text-sm font-medium">Water Update</span>
          </Button>
        </Link>
        <Link href="/alerts">
          <Button variant="outline" className="h-20 w-full flex-col space-y-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200">
            <Zap className="w-6 h-6" />
            <span className="text-sm font-medium">Power Alert</span>
          </Button>
        </Link>
        <Link href="/lost-found">
          <Button variant="outline" className="h-20 w-full flex-col space-y-2 bg-red-50 hover:bg-red-100 text-red-700 border-red-200">
            <Search className="w-6 h-6" />
            <span className="text-sm font-medium">Lost & Found</span>
          </Button>
        </Link>
        <Link href="/services">
          <Button variant="outline" className="h-20 w-full flex-col space-y-2 bg-green-50 hover:bg-green-100 text-green-700 border-green-200">
            <Users className="w-6 h-6" />
            <span className="text-sm font-medium">Skills</span>
          </Button>
        </Link>
        <Link href="/parking">
          <Button variant="outline" className="h-20 w-full flex-col space-y-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200">
            <Car className="w-6 h-6" />
            <span className="text-sm font-medium">Parking</span>
          </Button>
        </Link>
      </div>

      {/* Community Feed */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-pink-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                  <Users className="h-5 w-5 text-white" />
                </div>
                Community Feed
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Stay connected with your neighborhood updates
              </p>
            </div>
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              Post Update
            </Button>
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search community updates..." className="pl-10 pr-4" />
            </div>
            <Button variant="outline" size="icon" className="bg-white border-gray-300">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-8 rounded-none border-b bg-gray-50">
              <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-white">
                All
              </TabsTrigger>
              <TabsTrigger value="water" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-white">
                <Droplets className="w-4 h-4 mr-1" />
                Water
              </TabsTrigger>
              <TabsTrigger value="power" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-white">
                <Zap className="w-4 h-4 mr-1" />
                Power
              </TabsTrigger>
              <TabsTrigger value="lost" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-white">
                <Search className="w-4 h-4 mr-1" />
                Lost
              </TabsTrigger>
              <TabsTrigger value="found" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-white">
                <Search className="w-4 h-4 mr-1" />
                Found
              </TabsTrigger>
              <TabsTrigger value="skill" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-white">
                <Users className="w-4 h-4 mr-1" />
                Skills
              </TabsTrigger>
              <TabsTrigger value="parking" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-white">
                <Car className="w-4 h-4 mr-1" />
                Parking
              </TabsTrigger>
              <TabsTrigger value="queue" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-white">
                <Clock className="w-4 h-4 mr-1" />
                Queue
              </TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-0">
              <div className="space-y-0">
                {isLoadingActivities ? (
                  // Show skeleton loading states
                  Array.from({ length: activitiesPerPage }).map((_, index) => (
                    <SkeletonCard key={index} />
                  ))
                ) : currentActivities.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Activities</h3>
                    <p className="text-gray-500">Be the first to share an update with your community!</p>
                  </div>
                ) : (
                  <>
                    {currentActivities.map((activity, index) => (
                      <div key={activity.id} className={`border-b hover:bg-gray-50 transition-all duration-200 ${index === 0 ? 'border-t-0' : ''}`}>
                        <div className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="relative flex-shrink-0">
                              <Avatar className="w-12 h-12 ring-2 ring-orange-100 shadow-sm">
                                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                                <AvatarFallback className="bg-orange-500 text-white font-medium text-sm">
                                  {activity.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              {activity.verified && (
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">
                                  <CheckCircle className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              {/* User Info and Meta */}
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                  <h5 className="font-medium text-gray-900 text-sm">{activity.user.name}</h5>
                                  <span className="text-gray-400 text-xs">•</span>
                                  <span className="text-gray-500 text-xs">{activity.time}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3 text-gray-400" />
                                  <span className="text-gray-500 text-xs">{user?.neighborhood?.name || 'Your Area'}</span>
                                </div>
                              </div>

                              {/* Content */}
                              <div className="mb-4">
                                <h4 className="font-semibold text-gray-900 text-lg mb-2 leading-tight">{activity.title}</h4>
                                <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">{activity.description}</p>
                              </div>

                              {/* Type Badge and Actions */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Badge variant="secondary" className={`${getTypeColor(activity.type)} flex items-center space-x-1 text-xs px-2 py-1`}>
                                    {getTypeIcon(activity.type)}
                                    <span className="capitalize">{activity.type}</span>
                                  </Badge>
                                  {activity.verified && (
                                    <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50 text-xs px-2 py-1">
                                      ✓ Verified
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-full p-2">
                                    <Heart className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-full p-2">
                                    <MessageCircle className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-full p-2">
                                    <Share className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center space-x-2 p-4 border-t bg-gray-50">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="text-gray-600"
                        >
                          Previous
                        </Button>
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }

                            return (
                              <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePageChange(pageNum)}
                                className={`w-8 h-8 ${currentPage === pageNum ? 'bg-orange-500 hover:bg-orange-600' : 'text-gray-600'}`}
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="text-gray-600"
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
