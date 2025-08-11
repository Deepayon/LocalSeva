"use client";

import { useState, useEffect, lazy, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDebounce, usePerformanceMonitor } from "../../../lib/performance";
import {
  ArrowLeft,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
  Share2,
  MessageCircle,
  Phone,
  ExternalLink,
  Zap,
  Droplets,
  Car,
  Bell,
  BellOff,
  Copy,
  Map,
} from "lucide-react";

// Lazy load heavy components
const Dialog = lazy(() => import("@/components/ui/dialog"));
const DialogHeader = lazy(() => import("@/components/ui/dialog").then(mod => ({ default: mod.DialogHeader })));
const DialogTitle = lazy(() => import("@/components/ui/dialog").then(mod => ({ default: mod.DialogTitle })));
const DialogContent = lazy(() => import("@/components/ui/dialog").then(mod => ({ default: mod.DialogContent })));
const Input = lazy(() => import("@/components/ui/input"));
const Textarea = lazy(() => import("@/components/ui/textarea"));
const Label = lazy(() => import("@/components/ui/label"));

// Mock data for demonstration - in real app this would come from API
const mockAlerts = [
  {
    id: "1",
    type: "power",
    title: "Power Outage in Indiranagar",
    description: "Power outage reported in Indiranagar 1st and 2nd stages. BESCOM teams are working on it. The outage was caused by a transformer failure and repair work is underway.",
    area: "Indiranagar, Bangalore",
    severity: "high",
    status: "active",
    reportedBy: "Ramesh Kumar",
    reportedAt: "2 hours ago",
    estimatedResolution: "4 hours",
    affectedPeople: 250,
    coordinates: { lat: 12.9719, lng: 77.6412 },
    updates: [
      {
        time: "2 hours ago",
        message: "Power outage first reported by multiple residents",
        author: "System",
        type: "reported"
      },
      {
        time: "1 hour ago", 
        message: "BESCOM team arrived at the location",
        author: "BESCOM Team",
        type: "update"
      },
      {
        time: "30 minutes ago",
        message: "Transformer identified as the issue, repair work started",
        author: "BESCOM Team",
        type: "progress"
      }
    ],
    contacts: [
      { name: "BESCOM Helpline", phone: "+91 80 22873333", type: "emergency" },
      { name: "Local Engineer", phone: "+91 98765 43210", type: "technical" }
    ],
    relatedAlerts: [
      { id: "2", title: "Traffic Signal Outage - 100ft Road", type: "traffic" },
      { id: "3", title: "Water Pump Shutdown", type: "water" }
    ]
  },
  {
    id: "2",
    type: "water",
    title: "Water Supply Disruption - Koramangala",
    description: "Water supply will be disrupted tomorrow from 9 AM to 2 PM for pipeline maintenance. BWSSB will be replacing old pipelines in the area to improve water pressure and reduce leakage.",
    area: "Koramangala, Bangalore",
    severity: "medium",
    status: "scheduled",
    reportedBy: "BWSSB",
    reportedAt: "5 hours ago",
    estimatedResolution: "Tomorrow 2 PM",
    affectedPeople: 500,
    coordinates: { lat: 12.9279, lng: 77.6271 },
    updates: [
      {
        time: "5 hours ago",
        message: "Maintenance work scheduled announced",
        author: "BWSSB",
        type: "scheduled"
      },
      {
        time: "3 hours ago",
        message: "Alternative water tankers arranged for emergency supply",
        author: "BWSSB",
        type: "arrangement"
      }
    ],
    contacts: [
      { name: "BWSSB Control Room", phone: "+91 80 22238888", type: "emergency" },
      { name: "Area Supervisor", phone: "+91 87654 32109", type: "supervisor" }
    ],
    relatedAlerts: [
      { id: "4", title: "Road Work - 80ft Road", type: "traffic" },
      { id: "5", title: "Water Tanker Available", type: "water" }
    ]
  },
  {
    id: "3",
    type: "traffic",
    title: "Heavy Traffic on Outer Ring Road",
    description: "Accident near Marathahalli bridge causing heavy traffic. Avoid this route if possible. Traffic police are on site and diverting vehicles. Clearing operations are underway.",
    area: "Outer Ring Road, Bangalore",
    severity: "medium",
    status: "active",
    reportedBy: "Traffic Police",
    reportedAt: "30 minutes ago",
    estimatedResolution: "2 hours",
    affectedPeople: 1000,
    coordinates: { lat: 12.9569, lng: 77.7011 },
    updates: [
      {
        time: "30 minutes ago",
        message: "Accident reported, traffic police dispatched",
        author: "Traffic Control",
        type: "reported"
      },
      {
        time: "15 minutes ago",
        message: "Ambulance arrived, rescue operations in progress",
        author: "Emergency Services",
        type: "emergency"
      }
    ],
    contacts: [
      { name: "Traffic Police", phone: "+91 80 22942345", type: "emergency" },
      { name: "Ambulance", phone: "+91 108", type: "emergency" }
    ],
    relatedAlerts: [
      { id: "6", title: "Alternative Routes Available", type: "information" },
      { id: "7", title: "Metro Service Delayed", type: "transport" }
    ]
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "power": return <Zap className="w-5 h-5" />;
    case "water": return <Droplets className="w-5 h-5" />;
    case "traffic": return <Car className="w-5 h-5" />;
    default: return <AlertTriangle className="w-5 h-5" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "power": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "water": return "bg-blue-100 text-blue-800 border-blue-200";
    case "traffic": return "bg-red-100 text-red-800 border-red-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "high": return "bg-red-100 text-red-800 border-red-200";
    case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low": return "bg-blue-100 text-blue-800 border-blue-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active": return <AlertTriangle className="w-4 h-4 text-red-500" />;
    case "scheduled": return <Clock className="w-4 h-4 text-blue-500" />;
    case "resolved": return <CheckCircle className="w-4 h-4 text-green-500" />;
    default: return <XCircle className="w-4 h-4 text-gray-500" />;
  }
};

export default function AlertDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [alert, setAlert] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showMapDialog, setShowMapDialog] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [copied, setCopied] = useState(false);

  // Performance monitoring
  usePerformanceMonitor('AlertDetailsPage');

  const alertId = searchParams.get('id') || '1'; // Default to first alert if no ID provided
  
  // Memoize the current alert to prevent unnecessary re-renders
  const currentAlert = useMemo(() => alert, [alert]);

  useEffect(() => {
    // Simulate API call to fetch alert details
    const fetchAlert = () => {
      setLoading(true);
      setTimeout(() => {
        const foundAlert = mockAlerts.find(a => a.id === alertId);
        setAlert(foundAlert || mockAlerts[0]); // Fallback to first alert
        setLoading(false);
      }, 500);
    };

    fetchAlert();
  }, [alertId]);

  const handleGetUpdates = () => {
    setIsSubscribed(!isSubscribed);
    // In a real app, this would call an API to subscribe/unsubscribe
    setTimeout(() => {
      alert(isSubscribed ? "You have unsubscribed from updates for this alert" : "You will now receive updates for this alert");
    }, 100);
  };

  const handleShareAlert = () => {
    const alertUrl = window.location.href;
    const message = `${currentAlert?.title} - ${currentAlert?.description}\n\nView more details: ${alertUrl}`;
    setShareMessage(message);
    setShowShareDialog(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareToWhatsApp = () => {
    const alertUrl = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${currentAlert?.title} - ${currentAlert?.description}`);
    window.open(`https://wa.me/?text=${text}%0A%0AView more details: ${alertUrl}`, '_blank');
    setShowShareDialog(false);
  };

  const handleViewOnMap = () => {
    if (currentAlert?.coordinates) {
      const { lat, lng } = currentAlert.coordinates;
      // Open Google Maps with the alert location
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    } else {
      // Fallback to showing a map dialog if no coordinates
      setShowMapDialog(true);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view alert details</p>
          <Button onClick={() => window.location.href = "/auth"}>
            Login / Sign Up
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!currentAlert) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Alert Not Found</h2>
          <p className="text-gray-600 mb-6">The requested alert could not be found</p>
          <Button onClick={() => router.push("/alerts")}>
            Back to Alerts
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
              <Button variant="ghost" size="icon" onClick={() => router.push("/alerts")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Alert Details</h1>
                <p className="text-gray-600 mt-1">Detailed information about this alert</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Alert Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {getTypeIcon(currentAlert.type)}
                <div>
                  <CardTitle className="text-xl">{currentAlert.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className={getTypeColor(currentAlert.type)}>
                      {currentAlert.type.charAt(0).toUpperCase() + currentAlert.type.slice(1)}
                    </Badge>
                    <Badge variant="outline" className={getSeverityColor(currentAlert.severity)}>
                      {currentAlert.severity.charAt(0).toUpperCase() + currentAlert.severity.slice(1)} Severity
                    </Badge>
                    <Badge variant={currentAlert.status === "active" ? "destructive" : "secondary"}>
                      {getStatusIcon(currentAlert.status)}
                      <span className="ml-1">{currentAlert.status.charAt(0).toUpperCase() + currentAlert.status.slice(1)}</span>
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Reported {currentAlert.reportedAt}</div>
                <div className="text-sm text-gray-600">by {currentAlert.reportedBy}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-6">{currentAlert.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{currentAlert.area}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Est. resolution: {currentAlert.estimatedResolution}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{currentAlert.affectedPeople} people affected</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {getStatusIcon(currentAlert.status)}
                <span className="capitalize">{currentAlert.status}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Button 
            onClick={handleGetUpdates}
            className="flex items-center gap-2"
            variant={isSubscribed ? "secondary" : "default"}
          >
            {isSubscribed ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
            {isSubscribed ? "Stop Updates" : "Get Updates"}
          </Button>
          <Button 
            onClick={handleShareAlert}
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share Alert
          </Button>
          <Button 
            onClick={handleViewOnMap}
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Map className="w-4 h-4" />
            View on Map
          </Button>
        </div>

        {/* Updates Timeline */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Updates Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentAlert.updates.map((update: any, index: number) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className={`w-3 h-3 rounded-full ${
                      update.type === 'emergency' ? 'bg-red-500' :
                      update.type === 'progress' ? 'bg-yellow-500' :
                      update.type === 'resolved' ? 'bg-green-500' : 'bg-blue-500'
                    }`}></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{update.author}</span>
                      <span className="text-xs text-gray-500">{update.time}</span>
                    </div>
                    <p className="text-sm text-gray-700">{update.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Emergency Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentAlert.contacts.map((contact: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{contact.name}</div>
                    <div className="text-sm text-gray-600 capitalize">{contact.type}</div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Related Alerts */}
        {currentAlert.relatedAlerts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Related Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentAlert.relatedAlerts.map((relatedAlert: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div>
                      <div className="font-medium">{relatedAlert.title}</div>
                      <div className="text-sm text-gray-600 capitalize">{relatedAlert.type}</div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Share Alert Dialog */}
      <Suspense fallback={<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">Loading...</div>}>
        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share Alert</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="share-message">Alert Details</Label>
                <Textarea
                  id="share-message"
                  value={shareMessage}
                  onChange={(e) => setShareMessage(e.target.value)}
                  rows={4}
                  className="mt-1"
                  readOnly
                />
              </div>
              <div className="flex flex-col gap-2">
                <Button onClick={handleCopyLink} className="flex items-center gap-2">
                  <Copy className="w-4 h-4" />
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
                <Button onClick={handleShareToWhatsApp} variant="outline" className="flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share to WhatsApp
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </Suspense>

      {/* Map View Dialog */}
      <Suspense fallback={<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">Loading...</div>}>
        <Dialog open={showMapDialog} onOpenChange={setShowMapDialog}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Alert Location</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <Map className="w-16 h-16 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600 mb-2">Location: {currentAlert?.area}</p>
                {currentAlert?.coordinates ? (
                  <p className="text-sm text-gray-500">
                    Coordinates: {currentAlert.coordinates.lat}, {currentAlert.coordinates.lng}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">Exact coordinates not available</p>
                )}
              </div>
              <div className="flex gap-2">
                {currentAlert?.coordinates && (
                  <Button 
                    onClick={() => {
                      const { lat, lng } = currentAlert.coordinates;
                      window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
                      setShowMapDialog(false);
                    }}
                    className="flex-1"
                  >
                    Open in Google Maps
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => setShowMapDialog(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </Suspense>
    </div>
  );
}