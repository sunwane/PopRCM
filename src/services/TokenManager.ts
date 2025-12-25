/**
 * TokenManager - Quản lý tự động refresh token
 * Tự động làm mới token mỗi 50 phút để đảm bảo người dùng không bị logout
 */
class TokenManager {
  private static instance: TokenManager;
  private refreshInterval: NodeJS.Timeout | null = null;
  private readonly REFRESH_INTERVAL = 50 * 60 * 1000; // 50 phút tính bằng milliseconds
  private readonly TOKEN_REFRESH_THRESHOLD = 10 * 60; // 10 phút trước khi hết hạn (tính bằng seconds)
  private readonly baseURL = 'http://localhost:8088/api';

  constructor() {
    if (TokenManager.instance) {
      return TokenManager.instance;
    }
    TokenManager.instance = this;
  }

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  /**
   * Bắt đầu auto refresh token
   */
  startAutoRefresh(onRefreshSuccess?: (newToken: string) => void, onRefreshFailed?: () => void): void {
    // Clear existing interval nếu có
    this.stopAutoRefresh();

    console.log('🔄 Starting auto token refresh every 50 minutes...');

    // Sau đó set interval để check mỗi 50 phút
    this.refreshInterval = setInterval(() => {
      this.checkAndRefreshToken(onRefreshSuccess, onRefreshFailed);
    }, this.REFRESH_INTERVAL);
    
    console.log('✅ Auto refresh scheduled for every 50 minutes');
  }

  /**
   * Dừng auto refresh token
   */
  stopAutoRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
      console.log('⏹️ Stopped auto token refresh');
    }
  }

  /**
   * Kiểm tra và refresh token nếu cần
   */
  private async checkAndRefreshToken(
    onRefreshSuccess?: (newToken: string) => void, 
    onRefreshFailed?: () => void
  ): Promise<void> {
    try {
      // Chỉ thực hiện trong browser environment
      if (typeof window === 'undefined') {
        return;
      }

      const currentToken = this.getCurrentToken();
      
      if (!currentToken) {
        console.log('⚠️ No token found, stopping auto refresh');
        this.stopAutoRefresh();
        onRefreshFailed?.();
        return;
      }

      // Kiểm tra xem token có sắp hết hạn không (trong vòng 10 phút tới)
      if (this.isTokenNearExpiry(currentToken)) {
        console.log('🔄 Token is near expiry, refreshing...');
        
        const newToken = await this.refreshToken();
        
        if (newToken) {
          console.log('✅ Token refreshed successfully via auto refresh');
          onRefreshSuccess?.(newToken);
        } else {
          console.warn('❌ Failed to refresh token via auto refresh');
          onRefreshFailed?.();
          this.stopAutoRefresh();
        }
      } else {
        // Token vẫn còn hạn, chỉ log nhẹ
        const payload = JSON.parse(atob(currentToken.split('.')[1]));
        const currentTime = Date.now() / 1000;
        const timeLeft = Math.round((payload.exp - currentTime) / 60); // minutes
        console.log(`✓ Token still valid for ${timeLeft} minutes`);
      }
    } catch (error) {
      console.error('❌ Error in auto token refresh:', error);
      onRefreshFailed?.();
    }
  }

  /**
   * Lấy token hiện tại từ localStorage
   */
  private getCurrentToken(): string | null {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token || token === 'null' || token === 'undefined' || token === '') {
        return null;
      }
      
      return token;
    } catch (error) {
      console.error('Error getting token from localStorage:', error);
      return null;
    }
  }

  /**
   * Kiểm tra token có sắp hết hạn không (trong vòng 10 phút tới)
   */
  private isTokenNearExpiry(token: string): boolean {
    try {
      // Decode JWT payload (simple base64 decode)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000; // Convert to seconds
      
      // Kiểm tra token có hết hạn trong vòng TOKEN_REFRESH_THRESHOLD giây tới không
      return payload.exp && (payload.exp - currentTime) < this.TOKEN_REFRESH_THRESHOLD;
    } catch (error) {
      console.error('Error parsing token:', error);
      return true; // Coi như sắp hết hạn nếu không parse được
    }
  }

  /**
   * Thực hiện refresh token
   */
  private async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken || refreshToken === 'null' || refreshToken === 'undefined' || refreshToken === '') {
        console.log('❌ No refresh token available for token refresh');
        this.clearAuthData();
        return null;
      }

      console.log('🔄 Calling refresh token API...');
      const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        console.error(`❌ Refresh token API failed with status: ${response.status} ${response.statusText}`);
        this.clearAuthData();
        return null;
      }

      const apiResponse = await response.json();
      console.log('📡 Refresh token API response:', apiResponse);
      
      if (apiResponse.result && apiResponse.result.token) {
        // Lưu token mới
        localStorage.setItem('authToken', apiResponse.result.token);
        
        // Cập nhật refresh token nếu có mới
        if (apiResponse.result.refreshToken) {
          localStorage.setItem('refreshToken', apiResponse.result.refreshToken);
        }
        
        console.log('✅ Token refresh successful, new token saved');
        
        // Dispatch event để các component khác biết token đã được refresh
        window.dispatchEvent(new CustomEvent('tokenRefreshed', { 
          detail: { token: apiResponse.result.token } 
        }));
        
        return apiResponse.result.token;
      } else {
        console.error('❌ Invalid API response structure:', apiResponse);
        this.clearAuthData();
        return null;
      }
    } catch (error) {
      console.error('❌ Token refresh error:', error);
      this.clearAuthData();
      return null;
    }
  }

  /**
   * Xóa dữ liệu auth khi refresh thất bại
   */
  private clearAuthData(): void {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      console.log('Auth data cleared due to refresh failure');
      
      // Dispatch event để thông báo logout
      window.dispatchEvent(new Event('authChanged'));
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  /**
   * Manual refresh token - gọi trực tiếp khi cần
   */
  async manualRefresh(): Promise<string | null> {
    console.log('🔄 Manual token refresh requested');
    return await this.refreshToken();
  }

  /**
   * Check if auto refresh is running
   */
  isAutoRefreshActive(): boolean {
    return this.refreshInterval !== null;
  }
}

export default TokenManager.getInstance();