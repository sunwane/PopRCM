import { ApiResponse, PageResponse, Notification } from '@/types/User';
import ServiceChecker from './ServiceChecker';

export class NotificationService {
  private static readonly API_BASE_URL = 'https://poprcm-be.onrender.com/api/notifications';
  
  // Kiểm tra service availability từ localStorage
  private static isServiceAvailable(): boolean {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('serviceAvailable') === 'true';
    }
    return true;
  }

  // Get auth token from localStorage
  private static getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  // Chuyển đổi response từ API sang Notification interface
  private static mapNotificationResponse(notificationResponse: any): Notification {
    return {
      id: notificationResponse.id,
      type: notificationResponse.type,
      message: notificationResponse.message,
      isRead: notificationResponse.isRead,
      createdAt: new Date(notificationResponse.createdAt),
      movieId: notificationResponse.movieId,
      relatedId: notificationResponse.relatedId,
      actorName: notificationResponse.actorName,
      actorAvatar: notificationResponse.actorAvatar
    };
  }

  /**
   * GET /api/notifications - Lấy danh sách thông báo của user
   */
  static async getNotifications(page: number = 0, size: number = 20): Promise<PageResponse<Notification> | null> {
    if (!this.isServiceAvailable()) {
      // Mock data for notifications
      return {
        content: this.getMockNotifications(),
        totalElements: 5,
        totalPages: 1,
        size,
        number: page
      };
    }

    try {
      const token = this.getAuthToken();
      if (!token) throw new Error('No authentication token');

      const response = await fetch(`${this.API_BASE_URL}?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const apiResponse: ApiResponse<PageResponse<any>> = await response.json();
      
      if (apiResponse.result) {
        return {
          ...apiResponse.result,
          content: apiResponse.result.content.map(this.mapNotificationResponse)
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return null;
    }
  }

  /**
   * GET /api/notifications/unread-count - Đếm số thông báo chưa đọc
   */
  static async getUnreadCount(): Promise<number> {
    if (!this.isServiceAvailable()) {
      // Mock unread count
      return 3;
    }

    try {
      const token = this.getAuthToken();
      if (!token) throw new Error('No authentication token');

      const response = await fetch(`${this.API_BASE_URL}/unread-count`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch unread count');
      }

      const apiResponse: ApiResponse<number> = await response.json();
      return apiResponse.result || 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  /**
   * PUT /api/notifications/{id}/read - Đánh dấu 1 thông báo đã đọc
   */
  static async markAsRead(notificationId: string): Promise<boolean> {
    if (!this.isServiceAvailable()) {
      // Mock success
      console.log('Mock: Marked notification as read:', notificationId);
      return true;
    }

    try {
      const token = this.getAuthToken();
      if (!token) throw new Error('No authentication token');

      const response = await fetch(`${this.API_BASE_URL}/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  /**
   * PUT /api/notifications/read-all - Đánh dấu tất cả đã đọc
   */
  static async markAllAsRead(): Promise<boolean> {
    if (!this.isServiceAvailable()) {
      // Mock success
      console.log('Mock: Marked all notifications as read');
      return true;
    }

    try {
      const token = this.getAuthToken();
      if (!token) throw new Error('No authentication token');

      const response = await fetch(`${this.API_BASE_URL}/read-all`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }

  /**
   * Mock data for development/fallback
   */
  private static getMockNotifications(): Notification[] {
    return [
      {
        id: '1',
        type: 'NEW_EPISODE',
        message: 'Tập mới của "Thế giới ảo diệu của Gumball" đã được cập nhật!',
        isRead: false,
        createdAt: new Date('2024-12-16T08:00:00'),
        movieId: '1',
        relatedId: 'ep240'
      },
      {
        id: '2',
        type: 'ACTOR_UPDATE', 
        message: 'Diễn viên Emma Stone có phim mới ra mắt',
        isRead: false,
        createdAt: new Date('2024-12-15T14:30:00'),
        actorName: 'Emma Stone',
        actorAvatar: '/placeholder/emma-stone-avatar.jpg'
      },
      {
        id: '3',
        type: 'RECOMMENDATION',
        message: 'Chúng tôi nghĩ bạn sẽ thích "Nữ hoàng Dưa Lưới"',
        isRead: true,
        createdAt: new Date('2024-12-14T10:15:00'),
        movieId: '2'
      },
      {
        id: '4',
        type: 'SYSTEM',
        message: 'Hệ thống sẽ bảo trì từ 2:00 - 4:00 sáng ngày mai',
        isRead: false,
        createdAt: new Date('2024-12-13T18:45:00')
      },
      {
        id: '5',
        type: 'FAVORITE_UPDATE',
        message: 'Phim yêu thích "Spider-Man" có tập mới',
        isRead: true,
        createdAt: new Date('2024-12-12T16:20:00'),
        movieId: '3'
      }
    ];
  }
}
