import { 
  AuthResponse, 
  LoginRequest,
  APIAuthResponse,
} from '@/types/Auth';
import { UserService } from './UserService';

class AuthService {
  private baseURL = 'http://localhost:8088/api/auth';

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
    // Kiểm tra tài khoản admin
    if (request.email === 'admin@poprcm.com' && request.password === 'admin123') {
      console.log('✅ Login successful with admin account');
      const adminUser = {
        id: 'admin-001',
        userName: 'admin',
        email: 'admin@poprcm.com',
        fullName: 'Admin User',
        gender: 'male',
        createdAt: new Date(),
        role: 'admin',
        avatarUrl: '',
      };

      return {
        token: 'mock-jwt-token-admin-' + Date.now(),
        userId: adminUser.id,
        user: adminUser,
        authenticated: true,
      };
    }

    // Nếu không khớp với bất kỳ tài khoản nào, ném lỗi
    throw new Error('Email hoặc mật khẩu không đúng');
  }

  // Google Login method - chỉ nhận idToken từ Google Identity Services
  async loginWithGoogle(idToken: string): Promise<AuthResponse> {
    if (localStorage.getItem('serviceAvailable') === 'false') {
      console.log('Using mock Google login data due to service unavailability');
      return this.mockGoogleLogin(idToken);
    }

    try {
      console.log('Attempting to call real API for Google login...');
      const response = await fetch(`${this.baseURL}/login/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: idToken  // Chỉ gửi idToken, backend sẽ verify và extract thông tin
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đăng nhập Google thất bại từ API');
      }

      const apiResponse: APIAuthResponse = await response.json();
      console.log('✅ Google login successful with real API');
      
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

      throw new Error('Invalid API response structure');
    } catch (error: any) {
      console.warn('❌ Google login API failed:', error.message);
      console.log('Falling back to mock Google login...');
      return this.mockGoogleLogin(idToken);
    }
  }

  // Mock Google login for fallback - sử dụng idToken để tạo user giả
  private async mockGoogleLogin(idToken: string): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Decode idToken để lấy thông tin (chỉ cho mock, backend sẽ làm điều này)
    let userInfo: any = {
      email: 'google.user@gmail.com',
      name: 'Google User',
      picture: '/placeholder/avatar.png'
    };

    try {
      // Parse JWT payload để lấy thông tin user cho mock
      const payload = JSON.parse(atob(idToken.split('.')[1]));
      userInfo = {
        email: payload.email || 'google.user@gmail.com',
        name: payload.name || 'Google User',
        picture: payload.picture || '/placeholder/avatar.png'
      };
    } catch (error) {
      console.log('Could not parse idToken for mock, using default user info');
    }

    // Mock user based on idToken data
    const mockUser = {
      id: 'google-' + (userInfo.email || 'user'),
      email: userInfo.email,
      userName: userInfo.name,
      fullName: userInfo.name,
      avatarUrl: userInfo.picture,
      gender: 'male' as const,
      dateOfBirth: '1990-01-01',
      bio: 'Đăng nhập bằng Google',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const mockToken = 'mock-google-token-' + Date.now();
    const mockRefreshToken = 'mock-google-refresh-token-' + Date.now();

    return {
      token: mockToken,
      userId: mockUser.id,
      user: mockUser,
      refreshToken: mockRefreshToken,
      authenticated: true
    };
  }

  // Thêm method refresh token
  async refreshToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      console.log('No refresh token available');
      return null;
    }

    try {
      console.log('Attempting to refresh token...');
      const response = await fetch(`${this.baseURL}/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        console.error('Refresh token failed');
        this.clearAuthData();
        return null;
      }

      const apiResponse = await response.json();
      
      if (apiResponse.result) {
        // Lưu token mới
        localStorage.setItem('authToken', apiResponse.result.token);
        if (apiResponse.result.refreshToken) {
          localStorage.setItem('refreshToken', apiResponse.result.refreshToken);
        }
        
        console.log('✅ Token refreshed successfully');
        return apiResponse.result.token;
      }
      
      return null;
    } catch (error: any) {
      console.error('❌ Token refresh error:', error);
      this.clearAuthData();
      return null;
    }
  }

  // Thêm method để lấy refresh token
  getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken || refreshToken === 'null' || refreshToken === 'undefined' || refreshToken === '') {
        return null;
      }
      
      return refreshToken;
    }
    return null;
  }

  // Thêm method để check token có hết hạn không
  isTokenExpired(token: string): boolean {
    try {
      // Decode JWT payload (simple base64 decode, không verify signature)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000; // Convert to seconds
      
      // Check if token expires within next 10 minutes (600 seconds)
      return payload.exp && (payload.exp - currentTime) < 600;
    } catch (error) {
      console.error('Error parsing token:', error);
      return true; // Treat as expired if can't parse
    }
  }

  // Method để tự động refresh nếu token sắp hết hạn
  async ensureValidToken(): Promise<string | null> {
    const currentToken = this.getToken();
    
    if (!currentToken) {
      return null;
    }

    // Nếu token sắp hết hạn (trong 10 phút tới), refresh nó
    if (this.isTokenExpired(currentToken)) {
      console.log('Token is expiring soon, refreshing...');
      return await this.refreshToken();
    }

    return currentToken;
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
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('comment_likes'); // Clear comment like states
      console.log('Auth data cleared from localStorage');
      
      // Dispatch event for same tab
      window.dispatchEvent(new Event('authChanged'));
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

  setAuth(token: string, user: any, refreshToken?: string) {
    if (typeof window !== 'undefined') {
      
      // Lưu token
      localStorage.setItem('authToken', token);
      
      // Lưu refresh token nếu có
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      
      // Chỉ lưu user nếu nó có giá trị hợp lệ
      if (user && user !== undefined && user !== null) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }  

      // Dispatch event for same tab
      window.dispatchEvent(new Event('authChanged'));
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin';
  }

  async sendVerificationCode(email: string): Promise<void> {
    if (localStorage.getItem('serviceAvailable') === 'false') {
      console.log('Using mock send verification code');
      // Mock implementation - just simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
    }

    try {
      console.log('Sending verification code to:', email);
      const response = await fetch(`${this.baseURL}/send-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      console.log('✅ Verification code sent successfully');
      
    } catch (error: any) {
      console.warn('API failed for send verification code, using mock...');
      // Mock fallback
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  async register(request: any): Promise<void> {
    if (localStorage.getItem('serviceAvailable') === 'false') {
      console.log('Using mock register');
      // Mock implementation - simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
    }

    try {
      console.log('Attempting to register user...');
      const response = await fetch(`${this.baseURL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      console.log('✅ User registered successfully');
      
    } catch (error: any) {
      console.warn('API failed for register, using mock...');
      // Mock fallback
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  async forgotPassword(request: { email: string }): Promise<void> {
    if (localStorage.getItem('serviceAvailable') === 'false') {
      console.log('Using mock forgot password');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
    }

    try {
      console.log('Sending forgot password request for:', request.email);
      const response = await fetch(`${this.baseURL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      console.log('✅ Forgot password request sent successfully');
      
    } catch (error: any) {
      console.warn('API failed for forgot password, using mock...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  async resetPassword(request: { email: string; newPassword: string; code: string }): Promise<void> {
    if (localStorage.getItem('serviceAvailable') === 'false') {
      console.log('Using mock reset password');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
    }

    try {
      console.log('Resetting password for:', request.email);
      const response = await fetch(`${this.baseURL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      console.log('✅ Password reset successfully');
      
    } catch (error: any) {
      console.warn('API failed for reset password, using mock...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

}

export default new AuthService();
