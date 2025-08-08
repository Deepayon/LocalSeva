"use client";

import { useEffect } from 'react';
import { useAuth } from '../context/auth-context';

export default function AuthSync() {
  const { sessionToken } = useAuth();

  useEffect(() => {
    // Sync session token from localStorage to cookie for middleware
    if (sessionToken) {
      document.cookie = `session-token=${sessionToken}; path=/; max-age=2592000; secure; samesite=lax`;
    } else {
      // Clear cookie if no session token
      document.cookie = 'session-token=; path=/; max-age=0; secure; samesite=lax';
    }
  }, [sessionToken]);

  return null;
}