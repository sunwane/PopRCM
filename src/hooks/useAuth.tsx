import { useState, useEffect } from 'react';
import AuthService from '@/services/AuthService';
import { LoginRequest, AuthResponse } from '@/types/Auth';
import { User } from '@/types/User';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<Omit<User, "password"> | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Auth form states
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập khi component mount
    const token = AuthService.getToken();
    const userData = AuthService.getUser();
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      setLoading(true);
      const response = await AuthService.login(credentials);
      console.log('Login response:', response);
      
      if (response.token && response.user) {
        // Lưu vào localStorage
        AuthService.setAuth(response.token, response.user);
        
        // Cập nhật state
        setIsAuthenticated(true);
        setUser(response.user);
      }
      
      return response;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
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
  const register = async (formData: any): Promise<void> => {
    try {
      setAuthError('');
      await AuthService.register(formData);
    } catch (err: any) {
      setAuthError(err.message || 'Đăng ký thất bại');
      throw err;
    }
  };

  // Forgot password - send reset code
  const forgotPassword = async (email: string): Promise<void> => {
    try {
      setAuthLoading(true);
      setAuthError('');
      await AuthService.forgotPassword({ email });
    } catch (err: any) {
      setAuthError(err.message || 'Gửi mã đặt lại mật khẩu thất bại');
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  // Reset password with code
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

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    isAdmin: () => AuthService.isAdmin(),
    
    // Auth form methods
    authLoading,
    authError,
    clearAuthError,
    sendVerificationCode,
    register,
    forgotPassword,
    resetPassword
  };
}