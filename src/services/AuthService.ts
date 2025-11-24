import { 
  AuthResponse, 
  LoginRequest,
  APIAuthResponse,
} from '@/types/Auth';
import { mockUsers } from '@/mocksData/mockUser';
import { UserService } from './UserService';

class AuthService {
  private baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088/api/auth';

  async login(request: LoginRequest): Promise<AuthResponse> {

    if (localStorage.getItem('serviceAvailable') === 'false') {
      console.log('Using mock login data due to service unavailability');
      return this.mockLogin(request);
    }

    try {
      // Thử gọi API thật trước
      console.log('Attempting to call real API for login...');
      const response = await fetch(`${this.baseURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đăng nhập thất bại từ API');
      }

      const apiResponse: APIAuthResponse = await response.json();
      console.log('✅ Login successful with real API');
      
      // Lấy thông tin user từ API /users/me
      if (apiResponse.result) {
        console.log('Fetching user data from /users/me...');
        const user = await UserService.getCurrentUser(apiResponse.result.token);
        console.log('Fetched user data from /users/me:', user);
        return {
          token: apiResponse.result.token,
          userId: apiResponse.result.userId,
          user: user || undefined,
          refreshToken: apiResponse.result.refreshToken,
          authenticated: apiResponse.result.authenticated
        };
      }
      
      throw new Error('Invalid API response');
      
    } catch (error: any) {
      throw error;
    }
  }

  private mockLogin(request: LoginRequest): AuthResponse {
    // Fallback về mock data
    const adminUser = mockUsers.find(user => user.userName === 'admin');
    
    if (request.email === adminUser?.email && request.password === adminUser?.password) {
      console.log('✅ Login successful with mock data');
      const { password, ...userWithoutPassword } = adminUser;
      return {
        token: 'mock-jwt-token-' + Date.now(),
        userId: adminUser.id,
        user: userWithoutPassword,
        authenticated: true
      };
    } else {
      throw new Error('Email hoặc mật khẩu không đúng');
    }
  }

  async logout(token?: string): Promise<void> {
    if (localStorage.getItem('serviceAvailable') === 'false') {
      console.log('Using mock logout');
      this.clearAuthData();
      return;
    }

    try {
      if (token) {
        console.log('Attempting to call real API for logout...');
        const response = await fetch(`${this.baseURL}/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          console.warn('Logout API failed, continuing with local logout');
        } else {
          console.log('✅ Logout successful with real API');
        }
      }
    } catch (error: any) {
      console.warn('❌ API logout failed:', error.message);
    } finally {
      this.clearAuthData();
    }
  }

  private clearAuthData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      console.log('Auth data cleared from localStorage');
    }
  }

  // Method để clear corrupted data
  clearCorruptedData(): void {
    console.log('Clearing potentially corrupted localStorage data...');
    this.clearAuthData();
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      console.log('Retrieved token:', token);
      
      // Kiểm tra token hợp lệ
      if (!token || token === 'null' || token === 'undefined' || token === '') {
        return null;
      }
      
      return token;
    }
    return null;
  }

  getUser() {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      console.log('Retrieved user:', userStr);

      // Kiểm tra các trường hợp không hợp lệ
      if (!userStr || userStr === 'null' || userStr === 'undefined' || userStr === '') {
        console.warn('Invalid user data in localStorage:', userStr);
        return null;
      }

      // Kiểm tra nếu userStr không phải JSON hợp lệ
      try {
        const parsed = JSON.parse(userStr);
        return parsed;
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        // Clear invalid data
        localStorage.removeItem('user');
        return null;
      }
    }
    return null;
  }

  setAuth(token: string, user: any) {
    if (typeof window !== 'undefined') {
      
      // Lưu token
      localStorage.setItem('authToken', token);
      
      // Chỉ lưu user nếu nó có giá trị hợp lệ
      if (user && user !== undefined && user !== null) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }  
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
