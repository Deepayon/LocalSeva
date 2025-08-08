"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  MapPin,
  Star,
  Clock,
  Phone,
  MessageCircle,
  Loader2,
} from "lucide-react";

const categories = [
  { name: "All", icon: Search },
  { name: "Plumbing", icon: Search },
  { name: "Electrical", icon: Search },
  { name: "Cooking", icon: Search },
  { name: "Driving", icon: Search },
  { name: "Repairs", icon: Search },
  { name: "Beauty", icon: Search },
  { name: "Cleaning", icon: Search },
];

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  skillLevel: string;
  isOffering: boolean;
  isActive: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    phone: string;
    avatar?: string;
    trustScore: number;
  };
  neighborhood: {
    id: string;
    name: string;
    city: string;
    state: string;
  };
}

export default function ServicesPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchServices();
    }
  }, [user]);

  useEffect(() => {
    filterServices();
  }, [services, searchQuery, selectedCategory]);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/skills');
      if (response.ok) {
        const data = await response.json();
        setServices(data.skills || []);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      // Fallback to empty array
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleCallNow = (phoneNumber: string, providerName: string) => {
    // Open phone dialer
    window.open(`tel:${phoneNumber}`, '_blank');
  };

  const handleMessage = (providerName: string, service: string) => {
    // Open WhatsApp with pre-filled message
    const message = encodeURIComponent(`Hi ${providerName}, I'm interested in your ${service} service. Please let me know your availability.`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const filterServices = () => {
    let filtered = services.filter(service => service.isOffering && service.isActive);

    if (selectedCategory !== "All") {
      filtered = filtered.filter(service => 
        service.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.neighborhood.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by trust score and creation date
    filtered.sort((a, b) => {
      // First by trust score (higher is better)
      if (a.user.trustScore !== b.user.trustScore) {
        return b.user.trustScore - a.user.trustScore;
      }
      // Then by creation date (newer is better)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredServices(filtered);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view services</p>
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
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Local Services</h1>
          <p className="text-gray-600 mt-1">
            Find trusted service providers in {user.neighborhood?.name || 'your neighborhood'}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search services, providers, or areas..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.name}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategorySelect(category.name)}
                  className="flex items-center gap-2 whitespace-nowrap flex-shrink-0"
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={service.user.avatar} />
                      <AvatarFallback>{service.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{service.user.name}</CardTitle>
                      <p className="text-sm text-gray-600">{service.title}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge variant={service.isActive ? "default" : "secondary"}>
                      {service.isActive ? "Available" : "Inactive"}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {service.skillLevel}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{service.user.trustScore}</span>
                    <span>Trust Score</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(service.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{service.neighborhood.name}, {service.neighborhood.city}</span>
                </div>

                <p className="text-sm text-gray-700">{service.description}</p>

                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    className="flex-1" 
                    disabled={!service.isActive}
                    onClick={() => handleCallNow(service.user.phone, service.user.name)}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleMessage(service.user.name, service.title)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600">
              {services.length === 0 
                ? "No services available in your area yet. Be the first to offer your skills!"
                : "Try adjusting your search or category filter"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}