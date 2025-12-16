"use client";
import { useEffect, useState } from 'react';
import { useNotificationData } from '@/hooks/useData/useNotificationData';
import { LoadingEffect } from '@/components/ui/LoadingEffect';
import NotFoundDiv from '@/components/ui/NotFoundDiv';

export default function NotificationTab() {
  const { 
    notifications,
    unreadCount,
    loading,
    error,
    pagination,
    markAsRead,
    markAllAsRead,
    loadMoreNotifications,
    getNotificationIcon,
    getNotificationColor,
    refreshNotifications
  } = useNotificationData();

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  // Load data on component mount
  useEffect(() => {
    refreshNotifications();
  }, []);

  // Filter notifications based on current filter
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    return true; // 'all'
  });

  const handleNotificationClick = async (notificationId: string, isRead: boolean) => {
    if (!isRead) {
      await markAsRead(notificationId);
    }
    // Here you could add navigation logic based on notification type
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} ngày trước`;
    } else if (diffHours > 0) {
      return `${diffHours} giờ trước`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} phút trước`;
    } else {
      return 'Vừa xong';
    }
  };

  const getNotificationTypeText = (type: string): string => {
    const typeMap: Record<string, string> = {
      'NEW_EPISODE': 'Tập mới',
      'ACTOR_UPDATE': 'Diễn viên',
      'RECOMMENDATION': 'Đề xuất',
      'SYSTEM': 'Hệ thống',
      'FAVORITE_UPDATE': 'Yêu thích'
    };
    return typeMap[type] || 'Thông báo';
  };

  if (loading && notifications.length === 0) {
    return <LoadingEffect message="Đang tải thông báo..." />;
  }

  if (error && notifications.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-red-400 mb-4">Lỗi: {error}</div>
        <button 
          onClick={refreshNotifications}
          className="px-4 py-2 bg-(--primary) text-white rounded-lg hover:bg-(--primary)/80 transition"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Thông báo</h2>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>{notifications.length} thông báo</span>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                {unreadCount} chưa đọc
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Filter buttons */}
          <div className="flex bg-(--surface) rounded-lg p-1">
            {(['all', 'unread', 'read'] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-3 py-1 text-sm rounded-md transition ${
                  filter === filterType
                    ? 'bg-(--primary) text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {filterType === 'all' ? 'Tất cả' : filterType === 'unread' ? 'Chưa đọc' : 'Đã đọc'}
              </button>
            ))}
          </div>

          {/* Mark all as read button */}
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 text-sm bg-(--primary)/20 text-(--primary) rounded-lg hover:bg-(--primary)/30 transition"
            >
              Đánh dấu tất cả đã đọc
            </button>
          )}

          {/* Refresh button */}
          <button
            onClick={refreshNotifications}
            disabled={loading}
            className="p-2 bg-(--surface) text-white rounded-lg hover:bg-(--primary)/20 transition disabled:opacity-50"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-6">
            <img 
              src="/icons/Bell.png" 
              alt="No notifications" 
              className="w-16 h-16 mx-auto opacity-50 mb-4"
            />
          </div>
          <NotFoundDiv message={
            filter === 'unread' ? 'Không có thông báo chưa đọc nào.' :
            filter === 'read' ? 'Không có thông báo đã đọc nào.' :
            'Chưa có thông báo nào.'
          } />
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification.id, notification.isRead)}
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                notification.isRead
                  ? 'bg-(--surface)/50 border-(--border-blue)/30 hover:bg-(--surface)/70'
                  : 'bg-(--primary)/10 border-(--primary)/30 hover:bg-(--primary)/15'
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className={`shrink-0 p-2 rounded-full ${
                  notification.isRead ? 'bg-(--surface)' : 'bg-(--primary)/20'
                }`}>
                  <img 
                    src={getNotificationIcon(notification.type)} 
                    alt={notification.type}
                    className="w-5 h-5"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${getNotificationColor(notification.type)} bg-current/20`}>
                      {getNotificationTypeText(notification.type)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(notification.createdAt)}
                    </span>
                  </div>
                  
                  <p className={`text-sm ${
                    notification.isRead ? 'text-gray-300' : 'text-white font-medium'
                  }`}>
                    {notification.message}
                  </p>

                  {/* Actor info if available */}
                  {notification.actorName && (
                    <div className="flex items-center space-x-2 mt-2">
                      {notification.actorAvatar && (
                        <img 
                          src={notification.actorAvatar} 
                          alt={notification.actorName}
                          className="w-6 h-6 rounded-full"
                        />
                      )}
                      <span className="text-xs text-gray-400">{notification.actorName}</span>
                    </div>
                  )}

                  {/* Unread indicator */}
                  {!notification.isRead && (
                    <div className="flex items-center justify-end mt-2">
                      <div className="w-2 h-2 bg-(--primary) rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {pagination.hasNext && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMoreNotifications}
            disabled={loading}
            className="px-6 py-3 bg-(--primary) text-white rounded-lg hover:bg-(--primary)/80 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Đang tải...</span>
              </>
            ) : (
              <>
                <span>Xem thêm</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
