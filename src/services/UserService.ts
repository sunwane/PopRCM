import { User, UserResponse, ApiResponse, PageResponse, AvatarUploadResponse } from '@/types/User';
import { mockUsers } from '@/mocksData/mockUser';

export class UserService {
  private static users: User[] = [];
  private static isDataLoaded = false;
  private static readonly API_BASE_URL = 'http://localhost:8088/api/users';

  // Kiểm tra service availability từ localStorage (giống AuthService)
  private static isServiceAvailable(): boolean {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('serviceAvailable') !== 'false';
    }
    return true;
  }

  // Chuyển đổi UserResponse từ API sang User interface
  private static mapUserResponseToUser(userResponse: UserResponse): User {
    return {
      id: userResponse.id,
      userName: userResponse.userName,
      fullName: userResponse.fullName,
      email: userResponse.email,
      gender: userResponse.gender.toLowerCase(),
      avatarUrl: userResponse.avatarUrl,
      createdAt: new Date(userResponse.createdAt),
      role: userResponse.role
    };
  }

  // Lấy dữ liệu từ API lần đầu
  private static async loadUsersFromApi(): Promise<void> {
    if (this.isDataLoaded) return;

    if (!this.isServiceAvailable()) {
      console.info('API not available, using mock data');
      this.users = [...mockUsers];
      this.isDataLoaded = true;
      return;
    }

    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`${this.API_BASE_URL}?page=0&size=1000`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: ApiResponse<PageResponse<UserResponse>> = await response.json();
      
      if (apiResponse.result && apiResponse.result.content && Array.isArray(apiResponse.result.content)) {
        this.users = apiResponse.result.content.map(userResponse => 
          this.mapUserResponseToUser(userResponse)
        );
        this.isDataLoaded = true;
        console.log('Loaded users from API:', this.users.length);
      } else {
        throw new Error('Invalid API response structure');
      }
      
    } catch (error) {
      console.warn('Failed to load users from API, using mock data:', error);
      // Fallback to mock data nếu API fail
      this.users = [...mockUsers];
      this.isDataLoaded = true;
    }
  }

  static async getAllUsers(): Promise<User[]> {
    await this.loadUsersFromApi();
    return [...this.users];
  }



  static async getUserById(id: string): Promise<User | null> {
    await this.loadUsersFromApi();
    return this.users.find(u => u.id === id) || null;
  }



  /**
   * Lấy thông tin user hiện tại (GET /api/users/me)
   */
  static async getCurrentUser(token: string): Promise<User | null> {
    if (!this.isServiceAvailable()) {
      console.log('Using mock data for getCurrentUser');
      // Fallback về mock data
      return this.getCurrentUserFromMock(token);
    }

    try {
      console.log('Attempting to call real API for getCurrentUser...');
      const response = await fetch(`${this.API_BASE_URL}/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }

      const data: ApiResponse<UserResponse> = await response.json();
      console.log('✅ getCurrentUser successful with real API');
      
      if (data.result) {
        return this.mapUserResponseToUser(data.result);
      }
      return null;
      
    } catch (error: any) {
      console.warn('❌ API getCurrentUser failed, falling back to mock data:', error.message);
      // Fallback về mock data nếu API thất bại
      return this.getCurrentUserFromMock(token);
    }
  }

  /**
   * Mock implementation cho getCurrentUser
   */
  private static getCurrentUserFromMock(token: string): User | null {
    // Trong mock, chúng ta sẽ extract userId từ token hoặc dùng admin user mặc định
    if (token.startsWith('mock-jwt-token-')) {
      const adminUser = mockUsers.find(user => user.userName === 'admin');
      return adminUser || null;
    }
    return null;
  }

  static async addUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    await this.loadUsersFromApi();
    
    // Chỉ thêm local, không gửi API (tương tự Countries/Genres)
    const newUser: User = {
      ...user,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  static async deleteUser(id: string): Promise<boolean> {
    if (!this.isServiceAvailable()) {
      console.info('API not available, deleting locally');
      const index = this.users.findIndex(u => u.id === id);
      if (index === -1) return false;
      
      this.users.splice(index, 1);
      return true;
    }

    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`${this.API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local cache
      const index = this.users.findIndex(u => u.id === id);
      if (index !== -1) {
        this.users.splice(index, 1);
      }
      return true;
      
    } catch (error) {
      console.error('Delete user error:', error);
      return false;
    }
  }

  static async searchUsers(query: string): Promise<User[]> {
    await this.loadUsersFromApi();
    
    if (!query.trim()) return this.users;
    
    const searchTerm = query.toLowerCase().trim();
    return this.users.filter(user => 
      user.userName.toLowerCase().includes(searchTerm) ||
      user.fullName.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );
  }

  static async updateProfile(userId: string, updatedData: Partial<User>): Promise<User | null> {
    if (!this.isServiceAvailable()) {
      console.info('API not available, updating locally');
      const index = this.users.findIndex(u => u.id === userId);
      if (index === -1) return null;
      
      this.users[index] = { ...this.users[index], ...updatedData };
      return this.users[index];
    }

    try {
      const authToken = localStorage.getItem('authToken');
      console.log('Attempting to call real API for updateProfile...');
      
      // Convert User data to API format
      const apiData = {
        fullName: updatedData.fullName,
        gender: updatedData.gender?.toUpperCase()
      };

      const response = await fetch(`${this.API_BASE_URL}/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }

      const data: ApiResponse<UserResponse> = await response.json();
      console.log('✅ updateProfile successful with real API');
      
      if (data.result) {
        const updatedUser = this.mapUserResponseToUser(data.result);
        
        // Update local cache
        const index = this.users.findIndex(u => u.id === userId);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        
        return updatedUser;
      }
      return null;
      
    } catch (error: any) {
      console.warn('❌ API updateProfile failed:', error.message);
      return null;
    }
  }

  // Avatar upload (POST /api/users/{id}/avatar)
  static async uploadAvatar(userId: string, file: File): Promise<string | null> {
    if (!this.isServiceAvailable()) {
      console.info('API not available, simulating avatar upload');
      // Fake URL cho mock
      return `https://api.example.com/uploads/avatars/${Date.now()}_${file.name}`;
    }

    try {
      const authToken = localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.API_BASE_URL}/${userId}/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<AvatarUploadResponse> = await response.json();
      console.log('✅ Avatar upload successful');
      
      if (data.result) {
        // Update local cache
        const index = this.users.findIndex(u => u.id === userId);
        if (index !== -1) {
          this.users[index].avatarUrl = data.result.avatarUrl;
        }
        
        return data.result.avatarUrl;
      }
      return null;
      
    } catch (error) {
      console.error('Avatar upload error:', error);
      return null;
    }
  }

  // Delete avatar (DELETE /api/users/{id}/avatar)
  static async deleteAvatar(userId: string): Promise<boolean> {
    if (!this.isServiceAvailable()) {
      console.info('API not available, simulating avatar delete');
      const index = this.users.findIndex(u => u.id === userId);
      if (index !== -1) {
        this.users[index].avatarUrl = undefined;
      }
      return true;
    }

    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`${this.API_BASE_URL}/${userId}/avatar`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('✅ Avatar delete successful');
      
      // Update local cache
      const index = this.users.findIndex(u => u.id === userId);
      if (index !== -1) {
        this.users[index].avatarUrl = undefined;
      }
      
      return true;
      
    } catch (error) {
      console.error('Avatar delete error:', error);
      return false;
    }
  }
}
