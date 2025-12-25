"use client";
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthService from '@/services/AuthService';

/**
 * Hook quản lý auto refresh token
 * Chỉ chạy khi user đã authenticated
 * Sử dụng AuthService thay vì trực tiếp TokenManager để đảm bảo consistency
 */
export function useAutoTokenRefresh() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Chỉ chạy trong browser environment
    if (typeof window === 'undefined') return;

    if (isAuthenticated) {
      // Kiểm tra xem đã có auto refresh chưa
      if (!AuthService.isAutoRefreshActive()) {
        console.log('🔄 Starting auto token refresh from useAutoTokenRefresh...');
        AuthService.startAutoTokenRefresh();
      } else {
        console.log('✅ Auto token refresh already active');
      }
    } else {
      // User logged out - stop auto refresh
      if (AuthService.isAutoRefreshActive()) {
        console.log('⏹️ Stopping auto token refresh (user logged out)');
        AuthService.stopAutoTokenRefresh();
      }
    }

    // Cleanup khi component unmount
    return () => {
      // Không stop auto refresh vì nó cần chạy global cho tất cả page
      // Chỉ stop khi user logout (handled ở trên)
    };
  }, [isAuthenticated]); // Re-run khi auth state thay đổi

  // Hook này không return gì, chỉ chạy ngầm
  return null;
}