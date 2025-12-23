"use client";
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthService from '@/services/AuthService';
import TokenManager from '@/services/TokenManager';

/**
 * Hook tự động refresh token ngầm mỗi 50 phút
 * Sử dụng trong layout để đảm bảo token luôn valid trên tất cả page
 */
export function useAutoTokenRefresh() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Chỉ chạy trong browser environment
    if (typeof window === 'undefined') return;

    if (isAuthenticated) {
      const token = AuthService.getToken();
      
      // Nếu user đã đăng nhập và chưa có auto refresh, bắt đầu
      if (token && !TokenManager.isAutoRefreshActive()) {
        console.log('🔄 Starting background token refresh (every 50 minutes)...');
        
        TokenManager.startAutoRefresh(
          // onRefreshSuccess - token đã được refresh thành công
          (newToken: string) => {
            const now = new Date().toLocaleTimeString();
            console.log(`✅ Token auto-refreshed at ${now} (background)`);
            
            // Dispatch event để các component khác biết (nếu cần)
            window.dispatchEvent(new CustomEvent('backgroundTokenRefresh', { 
              detail: { token: newToken, timestamp: now } 
            }));
          },
          // onRefreshFailed - token refresh thất bại
          () => {
            console.warn('❌ Background token refresh failed');
            // TokenManager sẽ tự động clear auth data và logout user
          }
        );
      }
    } else {
      // Nếu user logout, dừng auto refresh
      if (TokenManager.isAutoRefreshActive()) {
        console.log('⏹️ Stopping background token refresh (user logged out)');
        TokenManager.stopAutoRefresh();
      }
    }

    // Cleanup khi component unmount hoặc auth state thay đổi
    return () => {
      // Không stop auto refresh vì nó cần chạy global cho tất cả page
    };
  }, [isAuthenticated]); // Re-run khi auth state thay đổi

  // Hook này không return gì, chỉ chạy ngầm
  return null;
}