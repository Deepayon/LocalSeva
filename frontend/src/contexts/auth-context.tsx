"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

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

interface AuthContextType {
  user: User | null;
  sessionToken: string | null;
  login: (userData: User, sessionToken: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on page load
    const checkAuth = () => {
      const storedSessionToken = localStorage.getItem('sessionToken');
      const storedUser = localStorage.getItem('user');
      
      if (storedSessionToken && storedUser) {
        try {
          setSessionToken(storedSessionToken);
          setUser(JSON.parse(storedUser));
          // Set cookie for middleware
          document.cookie = `session-token=${storedSessionToken}; path=/; max-age=2592000; secure; samesite=lax`;
        } catch (error) {
          console.error('Failed to parse user data:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('sessionToken');
          // Clear cookie
          document.cookie = 'session-token=; path=/; max-age=0; secure; samesite=lax';
        }
      }
      setIsLoading(false);
    };

    // Use setTimeout to ensure this runs after the initial render
    const timer = setTimeout(checkAuth, 0);
    return () => clearTimeout(timer);
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    setSessionToken(token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('sessionToken', token);
    // Set cookie for middleware
    document.cookie = `session-token=${token}; path=/; max-age=2592000; secure; samesite=lax`;
  };

  const logout = async () => {
    try {
      if (sessionToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sessionToken}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setSessionToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('sessionToken');
      // Clear cookie
      document.cookie = 'session-token=; path=/; max-age=0; secure; samesite=lax';
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