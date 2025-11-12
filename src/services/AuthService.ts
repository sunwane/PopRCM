import { 
  AuthenticationRequest, 
  AuthResponse, 
  LoginRequest,
  ChangePasswordRequest 
} from '@/types/Auth';
import { mockUsers } from '@/mocksData/mockUser';

class AuthService {
  private baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  async login(request: LoginRequest): Promise<AuthResponse> {
    try {
      // Tìm user admin trong mockUsers
      const adminUser = mockUsers.find(user => user.username === 'admin');
      
      if (request.email === adminUser?.email && request.password === 'admin123') {
        return {
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: adminUser.id,
            username: adminUser.username,
            fullname: adminUser.fullname,
            email: adminUser.email,
            role: 'admin',
            createdAt: adminUser.createdAt,
            gender: adminUser.gender,
            avatarUrl: adminUser.avatarUrl
          },
          message: 'Đăng nhập thành công'
        };
      } else {
        throw new Error('Email hoặc mật khẩu không đúng');
      }

      // Real API call would be:
      // const response = await fetch(`${this.baseURL}/auth/login`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(request),
      // });

      // if (!response.ok) {
      //   throw new Error('Đăng nhập thất bại');
      // }

      // return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async changePassword(request: ChangePasswordRequest): Promise<{ message: string }> {
    try {
      const response = await fetch(`${this.baseURL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Đổi mật khẩu thất bại');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async sendVerificationCode(): Promise<{ message: string }> {
    try {
      // Mock implementation - simulate sending verification code
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation, this would call the API
      // const response = await fetch(`${this.baseURL}/auth/send-verification-code`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${this.getToken()}`
      //   },
      // });

      // if (!response.ok) {
      //   throw new Error('Gửi mã xác nhận thất bại');
      // }

      // return await response.json();
      
      return { message: 'Mã xác nhận đã được gửi qua email của bạn' };
    } catch (error) {
      throw error;
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      console.log('Retrieved token:', token);
      return token;
    }
    return null;
  }

  getUser() {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      console.log('Retrieved user:', userStr);
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  setAuth(token: string, user: any) {
    if (typeof window !== 'undefined') {
      console.log('AuthService setAuth - Setting token:', token);
      console.log('AuthService setAuth - Setting user:', user);
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      console.log('AuthService setAuth - Data saved to localStorage');
    }
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin';
  }
}

export default new AuthService();
