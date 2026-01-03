"use client";
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// 🔄 Component chính xử lý Google OAuth callback
function GoogleAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');

    console.log('Google callback received:', { code: !!code, error, state });

    if (error) {
      console.error('Google OAuth error:', error);
      // Send error to parent window
      window.opener?.postMessage({
        type: 'GOOGLE_LOGIN_ERROR',
        error: error
      }, window.location.origin);
      window.close();
      return;
    }

    if (code) {
      console.log('Google authorization code received, sending to parent...');
      // Send success with code to parent window
      window.opener?.postMessage({
        type: 'GOOGLE_LOGIN_SUCCESS',
        payload: {
          code: code,
          state: state
        }
      }, window.location.origin);
      window.close();
    } else {
      // No code or error, something went wrong
      console.error('No authorization code received from Google');
      window.opener?.postMessage({
        type: 'GOOGLE_LOGIN_ERROR',
        error: 'No authorization code received'
      }, window.location.origin);
      window.close();
    }
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang xử lý đăng nhập Google...</p>
        <p className="text-xs text-gray-400 mt-2">Cửa sổ này sẽ tự động đóng</p>
      </div>
    </div>
  );
}

// 🎯 Loading fallback component
function AuthCallbackLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải...</p>
      </div>
    </div>
  );
}

// 🚀 Main export với Suspense wrapper
export default function GoogleAuthCallback() {
  return (
    <Suspense fallback={<AuthCallbackLoading />}>
      <GoogleAuthCallbackContent />
    </Suspense>
  );
}