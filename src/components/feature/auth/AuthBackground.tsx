"use client";
import { useState, useEffect } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import Message from "@/components/ui/Message";

export type AuthMode = 'login' | 'register' | 'forgot-password';

interface AuthBackgroundProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
}

export function AuthBackground({ isOpen, onClose, initialMode = 'login' }: AuthBackgroundProps) {
  const [currentMode, setCurrentMode] = useState<AuthMode>(initialMode);
  const [successMessage, setSuccessMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  
  // Close overlay when auth succeeds
  useEffect(() => {
    const handleAuthSuccess = () => {
      if (isOpen) {
        onClose();
      }
    };

    window.addEventListener('authChanged', handleAuthSuccess);
    return () => {
      window.removeEventListener('authChanged', handleAuthSuccess);
    };
  }, [isOpen, onClose]);

  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      
      // Prevent scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore scrolling
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const goHome = () => {
    onClose();
    window.location.href = "/";
  };

  const handleSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowMessage(true);
    
    // Switch to login form after showing success message
    setTimeout(() => {
      setCurrentMode('login'); // Reset to login mode
      setShowMessage(false);
    }, 2000);
  };

  const handleLoginSuccess = () => {
    // Only close modal on actual login success
    onClose();
  };

  const renderForm = () => {
    switch (currentMode) {
      case 'login':
        return (
          <LoginForm 
            onSwitchToRegister={() => setCurrentMode('register')}
            onSwitchToForgotPassword={() => setCurrentMode('forgot-password')}
            onSuccess={handleLoginSuccess}
          />
        );
      case 'register':
        return (
          <RegisterForm 
            onSwitchToLogin={() => setCurrentMode('login')}
            onSuccess={() => handleSuccess('Đăng ký thành công, chuyển về đăng nhập...')}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordForm 
            onSwitchToLogin={() => setCurrentMode('login')}
            onSuccess={() => handleSuccess('Đặt lại mật khẩu thành công, chuyển về đăng nhập...')}
          />
        );
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-(--background)"
      onClick={handleOverlayClick}
      style={{ 
        position: 'fixed', 
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 50,
        display: 'flex'
      }}
    >
      {/* Background Image */}
      <div 
        className="absolute top-0 left-0 right-0 bottom-0 bg-cover bg-center bg-no-repeat -rotate-3 scale-110"
        style={{
          backgroundImage: 'url(/bg/AuthBG.png)',
          position: 'absolute',
          inset: 0
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_50%,transparent_0%,#0B112000_50%,#0B1120FF_100%)]"></div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-8 right-6 z-10 text-white hover:text-(--hover) transition-colors"
      >
        <svg className="lg:w-8 lg:h-8 md:w-8 md:h-8 sm:w-6 sm:h-6 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Logo */}
      <button
        onClick={goHome}
        className="absolute top-6 left-6 z-10 flex items-center cursor-pointer hover:opacity-80 transition-opacity"
      >
        <img src="/logo.jpg" alt="PopRCM Logo" className="lg:h-14 md:h-14 sm:h-12 h-10 w-auto" />
      </button>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-[480px] mx-4">
        <div className="bg-(--surface)/80 backdrop-blur-sm rounded-2xl lg:pt-16 lg:pb-10 md:pt-16 md:pb-10 sm:pt-10 sm:pb-6 pt-10 pb-8 lg:px-10 md:px-10 px-8 shadow-2xl">
          {renderForm()}
        </div>
      </div>

      {/* Success Message */}
      <Message
        isVisible={showMessage}
        message={successMessage}
        type="success"
        onClose={() => setShowMessage(false)}
        autoClose={true}
        autoCloseDelay={2000}
        position="bottom-right"
      />
    </div>
  );
}