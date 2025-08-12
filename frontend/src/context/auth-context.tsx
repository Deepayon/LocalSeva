"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  verified: boolean;
  trustScore: number;
  role?: string;
  neighborhood?: {
    id: string;
    name: string;
    city: string;
    state: string;
  };
}

// This interface defines the expected shape of the decoded JWT payload
interface DecodedToken {
  userId: string;
  role: string;
  name?: string; // Add optional fields from your token
  iat: number;
  exp: number;
}

interface AuthContextType {
  user: User | null;
  sessionToken: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On initial page load, securely check for an existing session
    // by calling our dedicated API endpoint.
    const validateSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        if (!res.ok) {
          throw new Error('No active session found on server');
        }
        const data = await res.json();
        if (data.sessionToken) {
          login(data.sessionToken);
        } else {
          throw new Error('Session token not found in response');
        }
      } catch (error) {
        console.log('No valid session on initial load.');
        setUser(null);
        setSessionToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, []); // The empty array ensures this runs only once.

  const login = (token: string) => {
    // ** THE FIX IS HERE **
    // This function now correctly handles a string token.
    if (typeof token !== 'string' || !token) {
        console.error("Login function called with invalid token:", token);
        return; // Exit if the token is not a valid string
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);

      const userData: User = {
        id: decoded.userId,
        role: decoded.role,
        name: decoded.name,
        // For properties not in the token, you might fetch them from a /api/me endpoint
        // or use placeholders.
        phone: '', // This should ideally come from another source after login
        verified: true,
        trustScore: 0,
      };

      setUser(userData);
      setSessionToken(token);
    } catch (error) {
      console.error('Failed to decode token during login:', error);
      logout(); // If the token is invalid, ensure the user is logged out.
    }
  };

  const logout = async () => {
    try {
      // Tell the server to clear its httpOnly cookie
      await fetch('/api/auth/logout', { method: 'GET' });
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear client-side state
      setUser(null);
      setSessionToken(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, sessionToken, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
