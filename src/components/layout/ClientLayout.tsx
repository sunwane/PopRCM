"use client";
import { ReactNode } from 'react';
import { useAutoTokenRefresh } from '@/hooks/useAutoTokenRefresh';

interface ClientLayoutProps {
  children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  // Tự động refresh token ngầm mỗi 50 phút
  useAutoTokenRefresh();
  
  return <>{children}</>;
}