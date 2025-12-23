/**
 * Auto Token Refresh - Utility để test và monitor
 * 
 * Cách sử dụng trong console:
 * 
 * 1. Kiểm tra trạng thái auto refresh:
 *    AutoTokenRefreshUtils.getStatus()
 * 
 * 2. Xem thông tin token hiện tại:
 *    AutoTokenRefreshUtils.getTokenInfo()
 * 
 * 3. Test refresh thủ công:
 *    AutoTokenRefreshUtils.testRefresh()
 * 
 * 4. Bật/tắt logs chi tiết:
 *    AutoTokenRefreshUtils.enableDebugLogs()
 *    AutoTokenRefreshUtils.disableDebugLogs()
 */

import TokenManager from '@/services/TokenManager';
import AuthService from '@/services/AuthService';

class AutoTokenRefreshUtils {
  private static debugMode = false;

  /**
   * Lấy trạng thái hiện tại của auto refresh
   */
  static getStatus() {
    const isActive = TokenManager.isAutoRefreshActive();
    const token = AuthService.getToken();
    const hasToken = !!token;
    
    const status = {
      autoRefreshActive: isActive,
      hasToken,
      tokenPreview: token ? `${token.substring(0, 20)}...` : null,
      message: isActive 
        ? '✅ Auto refresh is running (every 50 minutes)' 
        : hasToken 
          ? '⚠️ Has token but auto refresh is not active'
          : '❌ No token found'
    };
    
    console.table(status);
    return status;
  }

  /**
   * Lấy thông tin chi tiết về token
   */
  static getTokenInfo() {
    const token = AuthService.getToken();
    
    if (!token) {
      console.log('❌ No token found');
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      const expireTime = payload.exp;
      const timeLeft = expireTime - currentTime;
      
      const info = {
        tokenPreview: `${token.substring(0, 30)}...`,
        issuedAt: new Date(payload.iat * 1000).toLocaleString(),
        expiresAt: new Date(expireTime * 1000).toLocaleString(),
        timeLeftMinutes: Math.round(timeLeft / 60),
        timeLeftSeconds: Math.round(timeLeft),
        isNearExpiry: timeLeft < 600, // < 10 minutes
        subject: payload.sub,
        issuer: payload.iss
      };
      
      console.table(info);
      return info;
    } catch (error) {
      console.error('❌ Error parsing token:', error);
      return null;
    }
  }

  /**
   * Test refresh token thủ công
   */
  static async testRefresh() {
    console.log('🔄 Testing manual token refresh...');
    
    try {
      const newToken = await TokenManager.manualRefresh();
      
      if (newToken) {
        console.log('✅ Manual refresh successful!');
        console.log('New token preview:', `${newToken.substring(0, 30)}...`);
        this.getTokenInfo();
        return newToken;
      } else {
        console.log('❌ Manual refresh failed');
        return null;
      }
    } catch (error) {
      console.error('❌ Error during manual refresh:', error);
      return null;
    }
  }

  /**
   * Bật debug logs
   */
  static enableDebugLogs() {
    this.debugMode = true;
    console.log('🐛 Debug logs enabled for auto token refresh');
    
    // Listen cho các events
    window.addEventListener('tokenRefreshed', this.onTokenRefreshed as EventListener);
    window.addEventListener('backgroundTokenRefresh', this.onBackgroundRefresh as EventListener);
    window.addEventListener('authChanged', this.onAuthChanged);
  }

  /**
   * Tắt debug logs
   */
  static disableDebugLogs() {
    this.debugMode = false;
    console.log('🔇 Debug logs disabled');
    
    // Remove event listeners
    window.removeEventListener('tokenRefreshed', this.onTokenRefreshed as EventListener);
    window.removeEventListener('backgroundTokenRefresh', this.onBackgroundRefresh as EventListener);
    window.removeEventListener('authChanged', this.onAuthChanged);
  }

  private static onTokenRefreshed = (event: Event) => {
    if (this.debugMode) {
      console.log('🔄 TokenRefreshed Event:', (event as CustomEvent).detail);
    }
  };

  private static onBackgroundRefresh = (event: Event) => {
    if (this.debugMode) {
      console.log('🔄 BackgroundTokenRefresh Event:', (event as CustomEvent).detail);
    }
  };

  private static onAuthChanged = (event: Event) => {
    if (this.debugMode) {
      console.log('🔐 AuthChanged Event');
    }
  };

  /**
   * Force start auto refresh (chỉ để test)
   */
  static forceStartAutoRefresh() {
    console.log('🔧 Force starting auto refresh...');
    
    TokenManager.startAutoRefresh(
      (newToken) => {
        console.log('✅ Forced refresh success:', `${newToken.substring(0, 20)}...`);
      },
      () => {
        console.log('❌ Forced refresh failed');
      }
    );
    
    this.getStatus();
  }

  /**
   * Stop auto refresh (chỉ để test)
   */
  static stopAutoRefresh() {
    console.log('⏹️ Stopping auto refresh...');
    TokenManager.stopAutoRefresh();
    this.getStatus();
  }

  /**
   * Hiển thị hướng dẫn sử dụng
   */
  static help() {
    const commands = [
      'AutoTokenRefreshUtils.getStatus() - Kiểm tra trạng thái',
      'AutoTokenRefreshUtils.getTokenInfo() - Thông tin token',  
      'AutoTokenRefreshUtils.testRefresh() - Test refresh thủ công',
      'AutoTokenRefreshUtils.enableDebugLogs() - Bật debug logs',
      'AutoTokenRefreshUtils.disableDebugLogs() - Tắt debug logs',
      'AutoTokenRefreshUtils.forceStartAutoRefresh() - Force start (test only)',
      'AutoTokenRefreshUtils.stopAutoRefresh() - Stop (test only)'
    ];
    
    console.log('📖 Auto Token Refresh Utils - Available Commands:');
    commands.forEach((cmd, index) => {
      console.log(`${index + 1}. ${cmd}`);
    });
  }
}

// Expose to window for console access
if (typeof window !== 'undefined') {
  (window as any).AutoTokenRefreshUtils = AutoTokenRefreshUtils;
}

export default AutoTokenRefreshUtils;