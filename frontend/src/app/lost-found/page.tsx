"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus, 
  MapPin, 
  Calendar,
  Camera,
  Gift,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

interface LostItem {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  lostAt: string;
  lostLocation: string;
  reward?: number;
  status: string;
  user: {
    name: string;
    phone: string;
    avatar?: string;
  };
  neighborhood: {
    name: string;
  };
  createdAt: string;
}

interface FoundItem {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  foundAt: string;
  foundLocation: string;
  status: string;
  user: {
    name: string;
    phone: string;
    avatar?: string;
  };
  neighborhood: {
    name: string;
  };
  createdAt: string;
}

export default function LostFoundPage() {
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [foundItems, setFoundItems] = useState<FoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("lost");
  const [formData, setFormData] = useState({
    type: "lost",
    title: "",
    description: "",
    category: "",
    location: "",
    reward: "",
    image: null as File | null
  });
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const [lostResponse, foundResponse] = await Promise.all([
        fetch('/api/lost-found/lost'),
        fetch('/api/lost-found/found')
      ]);

      if (lostResponse.ok) {
        const lostData = await lostResponse.json();
        setLostItems(lostData.items || []);
      }

      if (foundResponse.ok) {
        const foundData = await foundResponse.json();
        setFoundItems(foundData.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('type', formData.type);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('location', formData.location);
      if (formData.reward) {
        formDataToSend.append('reward', formData.reward);
      }
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch('/api/lost-found', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        setIsDialogOpen(false);
        setFormData({
          type: "lost",
          title: "",
          description: "",
          category: "",
          location: "",
          reward: "",
          image: null
        });
        fetchItems();
      }
    } catch (error) {
      console.error('Failed to create item:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleContact = (userName: string, userPhone: string, itemTitle: string, itemType: 'lost' | 'found') => {
    // Open WhatsApp with pre-filled message based on item type
    let message = '';
    if (itemType === 'lost') {
      message = encodeURIComponent(`Hi ${userName}, I saw your lost item "${itemTitle}" on PadosHelp. I might have some information about it. Can we discuss?`);
    } else {
      message = encodeURIComponent(`Hi ${userName}, I saw your found item "${itemTitle}" on PadosHelp. I think it might be something I lost. Can we discuss the details?`);
    }
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const categories = [
    "Electronics", "Documents", "Keys", "Wallet", "Jewelry",
    "Clothing", "Bag", "Phone", "Tablet", "Laptop", "Other"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lost & Found</h1>
          <p className="text-gray-600">Help your community find lost items</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Report Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Report {formData.type === 'lost' ? 'Lost' : 'Found'} Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Item Type</Label>
                <Tabs value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="lost">Lost Item</TabsTrigger>
                    <TabsTrigger value="found">Found Item</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the item"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of the item..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Where was it lost/found?"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
              {formData.type === 'lost' && (
                <div className="space-y-2">
                  <Label htmlFor="reward">Reward (Optional)</Label>
                  <Input
                    id="reward"
                    type="number"
                    placeholder="Reward amount"
                    value={formData.reward}
                    onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="image">Photo (Optional)</Label>
                <div className="flex items-center space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image')?.click()}
                    className="flex items-center space-x-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Choose Photo</span>
                  </Button>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {formData.image && (
                    <span className="text-sm text-gray-600">{formData.image.name}</span>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="lost">Lost Items ({lostItems.length})</TabsTrigger>
            <TabsTrigger value="found">Found Items ({foundItems.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="lost" className="mt-4">
            {lostItems.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Search className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No lost items reported</h3>
                  <p className="text-gray-600 mb-4">No items have been reported lost in your area</p>
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Report Lost Item
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lostItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <Badge variant={item.status === 'resolved' ? 'default' : 'secondary'}>
                          {item.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{item.category}</Badge>
                        {item.reward && item.reward > 0 && (
                          <Badge className="bg-green-100 text-green-700">
                            <Gift className="w-3 h-3 mr-1" />
                            ₹{item.reward}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {item.imageUrl && (
                        <div className="w-full h-40 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                          <Camera className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{item.lostLocation}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(item.lostAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t">
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={item.user.avatar} alt={item.user.name} />
                            <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-600">{item.user.name}</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleContact(item.user.name, item.user.phone, item.title, 'lost')}
                        >
                          Contact
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="found" className="mt-4">
            {foundItems.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No found items reported</h3>
                  <p className="text-gray-600 mb-4">No items have been found and reported in your area</p>
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Report Found Item
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {foundItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <Badge variant={item.status === 'resolved' ? 'default' : 'secondary'}>
                          {item.status}
                        </Badge>
                      </div>
                      <Badge variant="outline">{item.category}</Badge>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {item.imageUrl && (
                        <div className="w-full h-40 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                          <Camera className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{item.foundLocation}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(item.foundAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t">
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={item.user.avatar} alt={item.user.name} />
                            <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-600">{item.user.name}</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleContact(item.user.name, item.user.phone, item.title, 'found')}
                        >
                          Contact
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}