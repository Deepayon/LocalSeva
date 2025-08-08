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
import { 
  Droplets, 
  Plus, 
  Clock, 
  MapPin, 
  Calendar,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

interface WaterSchedule {
  id: string;
  startTime: string;
  endTime: string;
  waterPressure?: number;
  notes?: string;
  verified: boolean;
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

export default function WaterSchedulesPage() {
  const [schedules, setSchedules] = useState<WaterSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
    waterPressure: "",
    notes: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await fetch('/api/water-schedules');
      if (response.ok) {
        const data = await response.json();
        setSchedules(data.schedules || []);
      }
    } catch (error) {
      console.error('Failed to fetch water schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/water-schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          waterPressure: formData.waterPressure ? parseInt(formData.waterPressure) : null
        }),
      });

      if (response.ok) {
        setIsDialogOpen(false);
        setFormData({ startTime: "", endTime: "", waterPressure: "", notes: "" });
        fetchSchedules();
      }
    } catch (error) {
      console.error('Failed to create water schedule:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const isActiveSchedule = (startTime: string, endTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    return now >= start && now <= end;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Water Schedules</h1>
          <p className="text-gray-600">Community updates on water supply timings</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Water Schedule</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="waterPressure">Water Pressure (1-10)</Label>
                <Select value={formData.waterPressure} onValueChange={(value) => setFormData({ ...formData, waterPressure: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pressure" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Very Low</SelectItem>
                    <SelectItem value="2">2 - Low</SelectItem>
                    <SelectItem value="3">3 - Low</SelectItem>
                    <SelectItem value="4">4 - Medium</SelectItem>
                    <SelectItem value="5">5 - Medium</SelectItem>
                    <SelectItem value="6">6 - Good</SelectItem>
                    <SelectItem value="7">7 - Good</SelectItem>
                    <SelectItem value="8">8 - High</SelectItem>
                    <SelectItem value="9">9 - High</SelectItem>
                    <SelectItem value="10">10 - Very High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information about the water supply..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Adding..." : "Add Schedule"}
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
        <div className="space-y-4">
          {schedules.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Droplets className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No water schedules yet</h3>
                <p className="text-gray-600 mb-4">Be the first to share water supply information with your community</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Schedule
                </Button>
              </CardContent>
            </Card>
          ) : (
            schedules.map((schedule) => (
              <Card key={schedule.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={schedule.user.avatar} alt={schedule.user.name} />
                          <AvatarFallback>{schedule.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-gray-900">{schedule.user.name}</h3>
                          {schedule.verified && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          {isActiveSchedule(schedule.startTime, schedule.endTime) && (
                            <Badge className="bg-blue-100 text-blue-700">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Active Now
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{schedule.neighborhood.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(schedule.createdAt)}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <div>
                              <div className="text-sm font-medium">Start Time</div>
                              <div className="text-sm text-gray-600">{formatTime(schedule.startTime)}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-red-500" />
                            <div>
                              <div className="text-sm font-medium">End Time</div>
                              <div className="text-sm text-gray-600">{formatTime(schedule.endTime)}</div>
                            </div>
                          </div>
                          {schedule.waterPressure && (
                            <div className="flex items-center space-x-2">
                              <Droplets className="w-4 h-4 text-cyan-500" />
                              <div>
                                <div className="text-sm font-medium">Pressure</div>
                                <div className="text-sm text-gray-600">{schedule.waterPressure}/10</div>
                              </div>
                            </div>
                          )}
                        </div>
                        {schedule.notes && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-700">{schedule.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}