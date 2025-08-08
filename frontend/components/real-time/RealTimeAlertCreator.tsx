'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useRealTime } from '@/hooks/useRealTime';
import { useAuth } from '@/contexts/auth-context';

interface AlertFormData {
  type: 'water' | 'power' | 'lost_found' | 'skill' | 'queue' | 'parking';
  title: string;
  message: string;
  neighborhoodId?: string;
}

const alertTypes = [
  { value: 'water', label: 'Water Supply', icon: '💧', color: 'bg-blue-100 text-blue-800' },
  { value: 'power', label: 'Power Outage', icon: '⚡', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'lost_found', label: 'Lost & Found', icon: '🔍', color: 'bg-purple-100 text-purple-800' },
  { value: 'skill', label: 'Skill Share', icon: '🛠️', color: 'bg-green-100 text-green-800' },
  { value: 'queue', label: 'Queue Update', icon: '📋', color: 'bg-orange-100 text-orange-800' },
  { value: 'parking', label: 'Parking', icon: '🚗', color: 'bg-indigo-100 text-indigo-800' },
];

export function RealTimeAlertCreator() {
  const { user } = useAuth();
  const { isConnected, createAlert } = useRealTime();
  const [formData, setFormData] = useState<AlertFormData>({
    type: 'water',
    title: '',
    message: '',
    neighborhoodId: user?.neighborhood?.id
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setErrorMessage('Please login to create alerts');
      setSubmitStatus('error');
      return;
    }

    if (!formData.title.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in all required fields');
      setSubmitStatus('error');
      return;
    }

    if (!isConnected) {
      setErrorMessage('Not connected to real-time server');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      createAlert({
        type: formData.type,
        title: formData.title.trim(),
        message: formData.message.trim(),
        neighborhoodId: formData.neighborhoodId
      });

      setSubmitStatus('success');
      setFormData({
        type: 'water',
        title: '',
        message: '',
        neighborhoodId: user?.neighborhood?.id
      });

      // Reset success status after 3 seconds
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (error) {
      console.error('Error creating alert:', error);
      setErrorMessage('Failed to create alert');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedAlertType = alertTypes.find(type => type.value === formData.type);

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please login to create real-time alerts for your neighborhood.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Create Real-time Alert</span>
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-sm text-gray-500">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Send instant alerts to your neighborhood community
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {submitStatus === 'success' && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Alert sent successfully to your neighborhood!
              </AlertDescription>
            </Alert>
          )}

          {submitStatus === 'error' && errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="alertType">Alert Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select alert type" />
              </SelectTrigger>
              <SelectContent>
                {alertTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center space-x-2">
                      <span>{type.icon}</span>
                      <span>{type.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Brief title for your alert"
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Detailed description of your alert..."
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-gray-500">
              {formData.message.length}/500 characters
            </p>
          </div>

          {user.neighborhood && (
            <div className="space-y-2">
              <Label>Neighborhood</Label>
              <Badge variant="secondary">
                {user.neighborhood.name}, {user.neighborhood.city}
              </Badge>
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-2">
              {selectedAlertType && (
                <Badge className={selectedAlertType.color}>
                  {selectedAlertType.icon} {selectedAlertType.label}
                </Badge>
              )}
            </div>
            <Button 
              type="submit" 
              disabled={isSubmitting || !isConnected || !formData.title.trim() || !formData.message.trim()}
            >
              {isSubmitting ? (
                'Sending...'
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Alert
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}