"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Phone, Shield, MapPin, User } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export default function AuthPage() {
  const [step, setStep] = useState<"phone" | "otp" | "profile">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [demoOtp, setDemoOtp] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isExistingUser, setIsExistingUser] = useState(false);
  const router = useRouter();
  const { login, user: authUser, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    // Redirect if user is already logged in
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

    console.log("Sending OTP for phone:", phone);

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      console.log("Send OTP response status:", response.status);

      const data = await response.json();
      console.log("Send OTP response data:", data);

      if (data.success) {
        // Set whether this is an existing user or new user
        setIsExistingUser(!data.isNewUser);
        setStep("otp");
        // For demo purposes, show the OTP
        if (data.otp) {
          setDemoOtp(data.otp);
        }
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch (error) {
      console.error('Send OTP error:', error);
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

    console.log("Verifying OTP for phone:", phone, "OTP:", otp);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, otp }),
      });

      console.log("Verify OTP response status:", response.status);

      const data = await response.json();
      console.log("Verify OTP response data:", data);

      if (data.success && data.token) {
        // ** THE FIX IS HERE **
        // Securely log in using the token from the API response.
        // The auth context will handle decoding the token and setting the user state.
        login(data.token);

        // Check the isNewUser flag from the API to direct the user.
        if (data.isNewUser) {
          setIsExistingUser(false);
          setStep("profile");
        } else {
          setIsExistingUser(true);
          router.push("/");
        }
      } else {
        setError(data.error || "Failed to verify OTP");
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProfile = async () => {
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // This API call is now authenticated by the secure httpOnly cookie
      const response = await fetch('/api/auth/complete-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          neighborhood
        }),
      });

      console.log("Complete profile response status:", response.status);

      const data = await response.json();
      console.log("Complete profile response data:", data);

      if (data.success && data.token) {
        // ** THE FIX IS HERE **
        // Log in with the new token that contains the updated user details.
        login(data.token);
        router.push("/");
      } else {
        setError(data.error || "Failed to complete profile");
      }
    } catch (error) {
      console.error('Complete profile error:', error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
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
                <Label htmlFor="neighborhood">Neighborhood</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="neighborhood"
                    type="text"
                    placeholder="Sector 2, Salt Lake, Kolkata"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Start typing your neighborhood name, or enter a new one
                </p>
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