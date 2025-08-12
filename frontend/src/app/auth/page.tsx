"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Phone, Shield, User, Mail, MapPin } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// A list of Indian states for the dropdown menu
const indianStates = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function AuthPage() {
  const [step, setStep] = useState<"phone" | "otp" | "profile">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [demoOtp, setDemoOtp] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isExistingUser, setIsExistingUser] = useState(false);
  const router = useRouter();
  const { login, user: authUser, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    // Redirect logged-in users to the homepage
    if (!isAuthLoading && authUser) {
      router.push("/");
    }
  }, [authUser, isAuthLoading, router]);

  const handleSendOTP = async () => {
    if (!phone || phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();
      if (data.success) {
        setIsExistingUser(!data.isNewUser);
        setStep("otp");
        if (data.otp) setDemoOtp(data.otp);
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch (err) {
      console.error('Send OTP error:', err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await response.json();
      if (data.success && data.token) {
        // The login function from context securely handles the token
        login(data.token);
        if (data.isNewUser) {
          setStep("profile");
        } else {
          router.push("/");
        }
      } else {
        setError(data.error || "Failed to verify OTP");
      }
    } catch (err) {
      console.error('Verify OTP error:', err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProfile = async () => {
    if (!name.trim() || !city.trim() || !state || !pincode.trim()) {
      setError("Please fill in all required location fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // This API call is now authenticated by the secure cookie
      const response = await fetch('/api/auth/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, city, state, pincode }),
      });
      const data = await response.json();
      if (data.success && data.token) {
        // Login with the new token containing the updated user info
        login(data.token);
        router.push("/");
      } else {
        setError(data.error || "Failed to complete profile");
      }
    } catch (err) {
      console.error('Complete profile error:', err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthLoading || (!isAuthLoading && authUser)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Welcome to LocalSeva
          </CardTitle>
          <p className="text-gray-600">
            Connect with your neighborhood community
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === "phone" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex">
                  <div className="flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50">
                    <span className="text-sm text-gray-600">+91</span>
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    maxLength={10}
                    className="rounded-l-none"
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleSendOTP} 
                disabled={loading}
                className="w-full"
              >
                {loading ? "Sending..." : "Send OTP"}
              </Button>
            </div>
          )}

          {step === "otp" && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Enter the 6-digit OTP sent to +91 {phone}
                </p>
                <p className="text-xs text-orange-600 font-medium">
                  {isExistingUser ? "Welcome back! Logging you in..." : "New user! Please complete your profile after OTP verification."}
                </p>
                {demoOtp && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 my-4">
                    <p className="text-sm font-medium text-blue-800">Demo OTP:</p>
                    <p className="text-2xl font-bold text-blue-600 tracking-widest">{demoOtp}</p>
                    <p className="text-xs text-blue-600 mt-1">(This is only shown in development mode)</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="otp">One-Time Password</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                />
              </div>
              
              <Button 
                onClick={handleVerifyOTP} 
                disabled={loading}
                className="w-full"
              >
                {loading ? "Verifying..." : isExistingUser ? "Login" : "Verify & Continue"}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  setStep("phone");
                  setDemoOtp("");
                  setIsExistingUser(false);
                }}
                className="w-full"
              >
                Change Phone Number
              </Button>
            </div>
          )}

          {step === "profile" && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <User className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Complete Your Profile</h3>
                <p className="text-sm text-gray-600">
                  Welcome to LocalSeva! Please tell us a bit about yourself.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>State *</Label>
                <Select onValueChange={setState} required>
                    <SelectTrigger><SelectValue placeholder="Select your state" /></SelectTrigger>
                    <SelectContent>
                        {indianStates.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                  <Label htmlFor="city">City / Town *</Label>
                  <Input id="city" type="text" placeholder="e.g., Asansol, Kolkata" value={city} onChange={(e) => setCity(e.target.value)} required />
              </div>
              
              <div className="space-y-2">
                  <Label htmlFor="pincode">PIN Code *</Label>
                  <Input id="pincode" type="text" placeholder="Enter your 6-digit PIN code" value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))} maxLength={6} required />
              </div>
              
              <Button 
                onClick={handleCompleteProfile} 
                disabled={loading}
                className="w-full"
              >
                {loading ? "Creating Profile..." : "Complete Setup"}
              </Button>
            </div>
          )}

          <div className="text-center text-sm text-gray-600">
            <p>
              By continuing, you agree to our{" "}
              <a href="#" className="text-orange-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-orange-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}