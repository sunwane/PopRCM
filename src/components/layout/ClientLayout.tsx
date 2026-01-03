"use client";
import { ReactNode } from 'react';
import TokenRefreshProvider from '@/components/providers/TokenRefreshProvider';

interface ClientLayoutProps {
  children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <TokenRefreshProvider>
      {children}
    </TokenRefreshProvider>
  );
}