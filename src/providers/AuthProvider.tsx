"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AuthService from '@/services/AuthService';
import { AuthResponse, LoginRequest } from '@/types/Auth';
import { User } from '@/types/User';

interface AuthContextType {
  // State
  isAuthenticated: boolean;
  user: Omit<User, "password"> | null;
  loading: boolean;
  
  // Auth form states
  authLoading: boolean;
  authError: string;
  
  // Actions
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  loginWithGoogle: (idToken: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: Omit<User, "password">) => void;
  
  // Auth form methods
  clearAuthError: () => void;
  sendVerificationCode: (email: string) => Promise<void>;
  register: (request: any) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, newPassword: string, code: string) => Promise<void>;
  
  // Utility
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<Omit<User, "password"> | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Auth form states
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Initialize auth state - không setup auto refresh ở đây
  useEffect(() => {
    const initializeAuth = () => {
      const token = AuthService.getToken();
      const userData = AuthService.getUser();
      
      if (token && userData) {
        setIsAuthenticated(true);
        setUser(userData);
      }
      setLoading(false);
    };

    initializeAuth();

    // Listen for auth changes từ localStorage (cross-tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' || e.key === 'user') {
        initializeAuth();
      }
    };

    // Listen for auth changes trong cùng tab
    const handleAuthChange = () => {
      initializeAuth();
    };

    // Listen for token refresh events
    const handleTokenRefresh = (event: CustomEvent) => {
      console.log('Token refreshed successfully via AuthProvider');
      // Token đã được refresh, auth state vẫn valid
    };

    // Listen for user updates from other components
    const handleUserUpdate = (event: CustomEvent) => {
      console.log('User updated via AuthProvider');
      const updatedUser = event.detail;
      if (updatedUser) {
        setUser(updatedUser);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChanged', handleAuthChange);
    window.addEventListener('tokenRefreshed', handleTokenRefresh as EventListener);
    window.addEventListener('userUpdated', handleUserUpdate as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChanged', handleAuthChange);
      window.removeEventListener('tokenRefreshed', handleTokenRefresh as EventListener);
      window.removeEventListener('userUpdated', handleUserUpdate as EventListener);
    };
  }, []);

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      setAuthLoading(true);
      setAuthError('');
      
      const response = await AuthService.login(credentials);
      console.log('Login response:', response);
      
      if (response.token && response.user) {
        // Lưu vào localStorage và bắt đầu auto refresh
        AuthService.setAuth(response.token, response.user, response.refreshToken);
        
        // Cập nhật state
        setIsAuthenticated(true);
        setUser(response.user);
      }
      
      return response;
    } catch (error) {
      setAuthError((error as Error).message || 'Đăng nhập thất bại');
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const loginWithGoogle = async (idToken: string): Promise<AuthResponse> => {
    try {
      setAuthLoading(true);
      setAuthError('');
      
      const response = await AuthService.loginWithGoogle(idToken);
      console.log('Google login response:', response);
      
      if (response.token && response.user) {
        // Lưu vào localStorage và bắt đầu auto refresh
        AuthService.setAuth(response.token, response.user, response.refreshToken);
        
        // Cập nhật state
        setIsAuthenticated(true);
        setUser(response.user);
      }
      
      return response;
    } catch (error) {
      setAuthError((error as Error).message || 'Đăng nhập Google thất bại');
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const token = AuthService.getToken();
      await AuthService.logout(token || undefined);
      
      // Cập nhật state
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Vẫn clear state ngay cả khi có lỗi
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Send verification code for register or forgot password
  const sendVerificationCode = async (email: string): Promise<void> => {
    try {
      setAuthError('');
      await AuthService.sendVerificationCode(email);
    } catch (err: any) {
      setAuthError(err.message || 'Gửi mã xác thực thất bại');
      throw err;
    }
  };

  // Register new user
  const register = async (request: any): Promise<void> => {
    try {
      setAuthLoading(true);
      setAuthError('');
      await AuthService.register(request);
    } catch (err: any) {
      setAuthError(err.message || 'Đăng ký thất bại');
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  // Forgot password
  const forgotPassword = async (email: string): Promise<void> => {
    try {
      setAuthError('');
      await AuthService.forgotPassword({ email });
    } catch (err: any) {
      setAuthError(err.message || 'Gửi yêu cầu đặt lại mật khẩu thất bại');
      throw err;
    }
  };

  // Reset password
  const resetPassword = async (email: string, newPassword: string, code: string): Promise<void> => {
    try {
      setAuthError('');
      await AuthService.resetPassword({ email, newPassword, code });
    } catch (err: any) {
      setAuthError(err.message || 'Đặt lại mật khẩu thất bại');
      throw err;
    }
  };

  // Clear auth error
  const clearAuthError = () => {
    setAuthError('');
  };

  // Check if user is admin
  const isAdmin = () => {
    return AuthService.isAdmin();
  };

  // Update user info and localStorage
  const updateUser = (updatedUser: Omit<User, "password">) => {
    setUser(updatedUser);
    // Cập nhật localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    // Dispatch event để các components khác biết user đã được cập nhật
    window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));
  };

  const value: AuthContextType = {
    // State
    isAuthenticated,
    user,
    loading,
    
    // Auth form states
    authLoading,
    authError,
    
    // Actions
    login,
    loginWithGoogle,
    logout,
    updateUser,
    
    // Auth form methods
    clearAuthError,
    sendVerificationCode,
    register,
    forgotPassword,
    resetPassword,
    
    // Utility
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}