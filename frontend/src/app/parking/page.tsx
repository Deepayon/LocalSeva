"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Car,
  Search,
  MapPin,
  Clock,
  Star,
  Shield,
  CreditCard,
  Plus,
  Filter,
  Users,
  Camera,
  Home,
} from "lucide-react";

const parkingTypes = [
  { name: "All", icon: Car },
  { name: "Residential", icon: Home },
  { name: "Commercial", icon: Car },
  { name: "Driveway", icon: Car },
];

const mockParkingSpots = [
  {
    id: 1,
    title: "Covered Parking - Indiranagar",
    type: "Residential",
    address: "12th Main Road, Indiranagar, Bangalore",
    price: 50,
    priceUnit: "hour",
    rating: 4.8,
    reviews: 45,
    features: ["Covered", "Security", "CCTV", "24/7 Access"],
    availability: "available",
    owner: "Vikram Reddy",
    ownerPhone: "+91 98765 43210",
    distance: "0.5 km",
    coordinates: { lat: 12.9719, lng: 77.6412 },
    images: ["/parking1.jpg", "/parking2.jpg"],
  },
  {
    id: 2,
    title: "Driveway Parking - Koramangala",
    type: "Driveway",
    address: "5th Block, Koramangala, Bangalore",
    price: 30,
    priceUnit: "hour",
    rating: 4.6,
    reviews: 23,
    features: ["Open", "Residential", "Street Parking"],
    availability: "limited",
    owner: "Priya Sharma",
    ownerPhone: "+91 87654 32109",
    distance: "1.2 km",
    coordinates: { lat: 12.9279, lng: 77.6271 },
    images: ["/parking3.jpg"],
  },
  {
    id: 3,
    title: "Commercial Parking - HSR Layout",
    type: "Commercial",
    address: "27th Main, HSR Layout, Bangalore",
    price: 80,
    priceUnit: "hour",
    rating: 4.9,
    reviews: 89,
    features: ["Covered", "Security", "EV Charging", "Valet"],
    availability: "available",
    owner: "Parking Solutions Ltd",
    ownerPhone: "+91 76543 21098",
    distance: "2.1 km",
    coordinates: { lat: 12.9145, lng: 77.6386 },
    images: ["/parking4.jpg", "/parking5.jpg", "/parking6.jpg"],
  },
  {
    id: 4,
    title: "Shared Parking - Jayanagar",
    type: "Residential",
    address: "4th T Block, Jayanagar, Bangalore",
    price: 40,
    priceUnit: "hour",
    rating: 4.5,
    reviews: 12,
    features: ["Shared", "Security", "Well Lit"],
    availability: "available",
    owner: "Ramesh Kumar",
    ownerPhone: "+91 65432 10987",
    distance: "3.5 km",
    coordinates: { lat: 12.9304, lng: 77.5806 },
    images: ["/parking7.jpg"],
  },
];

const getAvailabilityColor = (availability: string) => {
  switch (availability) {
    case "available": return "bg-green-100 text-green-800 border-green-200";
    case "limited": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "full": return "bg-red-100 text-red-800 border-red-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function ParkingPage() {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSpots, setFilteredSpots] = useState(mockParkingSpots);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterSpots(query, selectedType);
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    filterSpots(searchQuery, type);
  };

  const handleBookNow = (spot: any) => {
    if (spot.availability === "full") {
      alert("This parking spot is currently full. Please try again later.");
      return;
    }
    
    // Simulate booking process
    const isConfirmed = confirm(`Book ${spot.title} for ₹${spot.price}/${spot.priceUnit}?\n\nLocation: ${spot.address}\nOwner: ${spot.owner}`);
    
    if (isConfirmed) {
      // In a real app, this would call a booking API
      alert(`Booking confirmed! 🎉\n\nSpot: ${spot.title}\nPrice: ₹${spot.price}/${spot.priceUnit}\nOwner: ${spot.owner}\nPhone: ${spot.ownerPhone}\n\nPlease contact the owner to complete the booking.`);
      
      // Open WhatsApp to contact owner
      const message = encodeURIComponent(`Hi ${spot.owner}, I'd like to book your parking spot "${spot.title}" for ₹${spot.price}/${spot.priceUnit}. Please confirm availability.`);
      window.open(`https://wa.me/?text=${message}`, '_blank');
    }
  };

  const handleContact = (ownerName: string, ownerPhone: string, spotTitle: string) => {
    // Open WhatsApp with pre-filled message
    const message = encodeURIComponent(`Hi ${ownerName}, I'm interested in your parking spot "${spotTitle}". Could you please provide more details about availability and booking?`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const filterSpots = (query: string, type: string) => {
    let filtered = mockParkingSpots;

    if (type !== "All") {
      filtered = filtered.filter(spot => spot.type === type);
    }

    if (query) {
      filtered = filtered.filter(spot =>
        spot.title.toLowerCase().includes(query.toLowerCase()) ||
        spot.address.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredSpots(filtered);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view parking spots</p>
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Parking Spaces</h1>
              <p className="text-gray-600 mt-1">Find and book parking spots in your neighborhood</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              List Your Space
            </Button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search parking spots by location or title..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>
      </div>

      {/* Parking Types */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {parkingTypes.map((type) => {
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

      {/* Parking Spots List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSpots.map((spot) => (
            <Card key={spot.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{spot.title}</CardTitle>
                    <p className="text-sm text-gray-600">{spot.type}</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={getAvailabilityColor(spot.availability)}
                  >
                    {spot.availability.charAt(0).toUpperCase() + spot.availability.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Image Gallery */}
                <div className="relative h-32 bg-gray-200 rounded-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-600" />
                  </div>
                  {spot.images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      {spot.images.length} photos
                    </div>
                  )}
                </div>

                {/* Price and Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-gray-900">₹{spot.price}</span>
                    <span className="text-sm text-gray-600">/{spot.priceUnit}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{spot.rating}</span>
                    <span className="text-sm text-gray-600">({spot.reviews})</span>
                  </div>
                </div>

                {/* Location and Distance */}
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="flex-1">{spot.address}</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{spot.distance}</span>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-1">
                  {spot.features.slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {spot.features.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{spot.features.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Owner Info */}
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback>{spot.owner.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-600">{spot.owner}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    className="flex-1" 
                    disabled={spot.availability === "full"}
                    onClick={() => handleBookNow(spot)}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Book Now
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleContact(spot.owner, spot.ownerPhone, spot.title)}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSpots.length === 0 && (
          <div className="text-center py-12">
            <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No parking spots found</h3>
            <p className="text-gray-600">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </div>
  );
}