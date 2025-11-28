import { useState, useEffect } from 'react';
import AuthService from '@/services/AuthService';
import { LoginRequest, AuthResponse } from '@/types/Auth';
import { User } from '@/types/User';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<Omit<User, "password"> | null>(null);
  const [loading, setLoading] = useState(true);

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
      
      if (response.authenticated && response.token && response.user) {
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

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    isAdmin: () => AuthService.isAdmin()
  };
}