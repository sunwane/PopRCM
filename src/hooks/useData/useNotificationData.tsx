"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { NotificationService } from '@/services/NotificationService';
import { Notification, PageResponse } from '@/types/User';

export function useNotificationData() {
  const { isAuthenticated, user } = useAuth();
  
  // Notifications state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    hasNext: false,
    hasPrev: false
  });

  /**
   * NOTIFICATION FUNCTIONS
   */

  // Load notifications
  const loadNotifications = async (page: number = 0, size: number = 20, resetData: boolean = false) => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError('');

      const response = await NotificationService.getNotifications(page, size);
      if (response) {
        const newNotifications = response.content;
        
        if (resetData || page === 0) {
          setNotifications(newNotifications);
        } else {
          setNotifications(prev => [...prev, ...newNotifications]);
        }

        setPagination({
          currentPage: response.number,
          totalPages: response.totalPages,
          totalElements: response.totalElements,
          hasNext: response.number < response.totalPages - 1,
          hasPrev: response.number > 0
        });
      }
    } catch (error: any) {
      setError(error.message || 'Lỗi khi tải thông báo');
    } finally {
      setLoading(false);
    }
  };

  // Load unread count
  const loadUnreadCount = async () => {
    if (!isAuthenticated) return;

    try {
      const count = await NotificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error: any) {
      console.error('Error loading unread count:', error);
    }
  };

  // Mark single notification as read
  const markAsRead = async (notificationId: string): Promise<boolean> => {
    if (!isAuthenticated) return false;

    try {
      const success = await NotificationService.markAsRead(notificationId);
      if (success) {
        // Update local state
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, isRead: true }
              : notification
          )
        );
        
        // Update unread count
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      return success;
    } catch (error: any) {
      setError(error.message || 'Lỗi khi đánh dấu đã đọc');
      return false;
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async (): Promise<boolean> => {
    if (!isAuthenticated) return false;

    try {
      const success = await NotificationService.markAllAsRead();
      if (success) {
        // Update local state - mark all as read
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, isRead: true }))
        );
        
        // Reset unread count
        setUnreadCount(0);
      }
      return success;
    } catch (error: any) {
      setError(error.message || 'Lỗi khi đánh dấu tất cả đã đọc');
      return false;
    }
  };

  // Load more notifications (pagination)
  const loadMoreNotifications = async () => {
    if (pagination.hasNext && !loading) {
      await loadNotifications(pagination.currentPage + 1, 20, false);
    }
  };

  // Get notifications by type
  const getNotificationsByType = (type: string): Notification[] => {
    return notifications.filter(notification => notification.type === type);
  };

  // Get unread notifications
  const getUnreadNotifications = (): Notification[] => {
    return notifications.filter(notification => !notification.isRead);
  };

  // Get read notifications
  const getReadNotifications = (): Notification[] => {
    return notifications.filter(notification => notification.isRead);
  };

  /**
   * UTILITY FUNCTIONS
   */

  // Clear error
  const clearError = () => {
    setError('');
  };

  // Refresh notifications data
  const refreshNotifications = async () => {
    if (isAuthenticated) {
      await Promise.all([
        loadNotifications(0, 20, true),
        loadUnreadCount()
      ]);
    }
  };

  // Format notification message for display
  const getNotificationIcon = (type: string): string => {
    const iconMap: Record<string, string> = {
      'NEW_EPISODE': '/icons/Play.png',
      'ACTOR_UPDATE': '/icons/Account.png',
      'RECOMMENDATION': '/icons/Sparkles.png',
      'SYSTEM': '/icons/Bell.png',
      'FAVORITE_UPDATE': '/icons/Heart.png'
    };
    
    return iconMap[type] || '/icons/Bell.png';
  };

  // Get notification color based on type
  const getNotificationColor = (type: string): string => {
    const colorMap: Record<string, string> = {
      'NEW_EPISODE': 'text-green-400',
      'ACTOR_UPDATE': 'text-blue-400',
      'RECOMMENDATION': 'text-yellow-400',
      'SYSTEM': 'text-orange-400',
      'FAVORITE_UPDATE': 'text-red-400'
    };
    
    return colorMap[type] || 'text-gray-400';
  };

  // Auto-load data when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshNotifications();
    } else {
      // Clear data when user logs out
      setNotifications([]);
      setUnreadCount(0);
      setPagination({ currentPage: 0, totalPages: 0, totalElements: 0, hasNext: false, hasPrev: false });
    }
  }, [isAuthenticated, user]);

  // Periodically refresh unread count (every 30 seconds)
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      loadUnreadCount();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return {
    // Data
    notifications,
    unreadCount,
    loading,
    error,
    pagination,

    // Actions
    loadNotifications,
    loadUnreadCount,
    markAsRead,
    markAllAsRead,
    loadMoreNotifications,

    // Getters
    getNotificationsByType,
    getUnreadNotifications,
    getReadNotifications,
    getNotificationIcon,
    getNotificationColor,

    // Utility
    clearError,
    refreshNotifications
  };
}
