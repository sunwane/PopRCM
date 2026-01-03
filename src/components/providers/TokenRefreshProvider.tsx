'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import AuthService from '@/services/AuthService';

interface TokenRefreshProviderProps {
  children: React.ReactNode;
}

export default function TokenRefreshProvider({ children }: TokenRefreshProviderProps) {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    console.log('🔄 Token refresh provider initialized - checking every 50 minutes');

    // Check token mỗi 50 phút
    const interval = setInterval(async () => {
      try {
        console.log('⏰ Periodic token check (50 minutes interval)');
        await AuthService.ensureValidToken();
      } catch (error) {
        console.error('❌ Periodic token check failed:', error);
      }
    }, 50 * 60 * 1000); // 50 minutes = 50 * 60 * 1000 milliseconds

    // Cleanup interval when component unmounts or user logs out
    return () => {
      console.log('🧹 Cleaning up token refresh interval');
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  return <>{children}</>;
}

export { TokenRefreshProvider };