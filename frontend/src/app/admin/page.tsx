"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Search,
  TrendingUp,
  UserCheck,
  UserX,
  Shield,
  Activity,
  Loader2,
  AlertTriangle
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  avatar?: string;
  verified: boolean;
  trustScore: number;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  role?: string;
  neighborhood?: {
    id: string;
    name: string;
    city: string;
    state: string;
  };
  _count: {
    waterSchedules: number;
    powerOutages: number;
    lostItems: number;
    foundItems: number;
    skills: number;
    parkingSpots: number;
    reviews: number;
  };
}

interface Neighborhood {
  id: string;
  name: string;
  city: string;
  state: string;
  pincode: string;
  _count: {
    users: number;
  };
}

interface AdminData {
  users: User[];
  neighborhoods: Neighborhood[];
  summary: {
    totalUsers: number;
    activeUsers: number;
    verifiedUsers: number;
    adminUsers: number;
    totalNeighborhoods: number;
  };
}

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    // Check if user is admin
    if (user && user.role !== 'admin') {
      router.push('/');
      return;
    }
    
    if (user && user.role === 'admin') {
      fetchAdminData();
    }
  }, [user, router]);

  const fetchAdminData = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        console.log('Admin data received:', data);
        setAdminData(data);
      } else if (response.status === 401) {
        // Unauthorized, redirect to home
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = adminData?.users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm) ||
    user.neighborhood?.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Check if user is not admin
  if (user && user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            <CardTitle className="text-xl">Unauthorized Access</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              You don't have permission to access the admin panel.
            </p>
            <Button onClick={() => router.push('/')}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Please log in to access the admin panel.
            </p>
            <Button onClick={() => router.push('/auth')}>
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users and monitor community activity</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminData?.summary.totalUsers || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{adminData?.summary.activeUsers || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{adminData?.summary.verifiedUsers || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{adminData?.summary.adminUsers || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Neighborhoods</CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{adminData?.summary.totalNeighborhoods || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="neighborhoods">Neighborhoods</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Users</CardTitle>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  <Button variant="outline" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Neighborhood</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Trust Score</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>
                                {user.name ? user.name.split(' ').map(n => n[0]).join('') : user.phone.slice(-2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {user.name || 'Unnamed User'}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {user.id.slice(-8)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1">
                              <Phone className="w-3 h-3" />
                              <span className="text-sm">{user.phone}</span>
                            </div>
                            {user.email && (
                              <div className="flex items-center space-x-1">
                                <Mail className="w-3 h-3" />
                                <span className="text-sm">{user.email}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.neighborhood ? (
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span className="text-sm">{user.neighborhood.name}</span>
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">Not assigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Badge variant={user.isActive ? "default" : "secondary"}>
                              {user.isActive ? "Active" : "Inactive"}
                            </Badge>
                            {user.verified && (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                Verified
                              </Badge>
                            )}
                            {user.role === 'admin' && (
                              <Badge variant="outline" className="text-purple-600 border-purple-600">
                                Admin
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm font-medium">{user.trustScore}</span>
                            <TrendingUp className="w-3 h-3 text-green-600" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex space-x-1">
                              <span>{user._count.waterSchedules + user._count.powerOutages + user._count.lostItems + user._count.foundItems + user._count.skills + user._count.parkingSpots}</span>
                              <span className="text-gray-500">posts</span>
                            </div>
                            <div className="flex space-x-1">
                              <span>{user._count.reviews}</span>
                              <span className="text-gray-500">reviews</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span className="text-sm">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="neighborhoods" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Neighborhoods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {adminData?.neighborhoods.map((neighborhood) => (
                  <Card key={neighborhood.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{neighborhood.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">City:</span>
                          <span className="text-sm font-medium">{neighborhood.city}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">State:</span>
                          <span className="text-sm font-medium">{neighborhood.state}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Pincode:</span>
                          <span className="text-sm font-medium">{neighborhood.pincode}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Users:</span>
                          <Badge variant="outline">{neighborhood._count.users}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}