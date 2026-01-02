"use client";
import { ReactNode } from 'react';
import { useNotificationData } from '@/hooks/useData/useNotificationData';

interface NotificationBadgeProps {
  children: ReactNode;
}

export default function NotificationBadge({ children }: NotificationBadgeProps) {
  const { unreadCount } = useNotificationData();

  return (
    <div className="relative">
      {children}
      {unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {unreadCount > 99 ? '99+' : unreadCount}
        </div>
      )}
    </div>
  );
}