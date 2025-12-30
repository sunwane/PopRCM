/**
 * Helper function để cập nhật thông tin user và reload trang
 * Đảm bảo tất cả components sẽ hiển thị thông tin mới
 */
export class UserUpdateHelper {
  /**
   * Cập nhật user trong localStorage và dispatch events
   */
  static updateUserInStorage(user: any) {
    if (typeof window !== 'undefined') {
      // Cập nhật localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      // Dispatch custom events để các components khác biết user đã được update
      window.dispatchEvent(new CustomEvent('userUpdated', { detail: user }));
      window.dispatchEvent(new Event('authChanged'));
      
      console.log('User updated in localStorage and events dispatched', user);
    }
  }

  /**
   * Reload trang với delay để user thấy success message
   */
  static reloadPageWithDelay(delay: number = 1500) {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        console.log('Reloading page to reflect user changes...');
        window.location.reload();
      }, delay);
    }
  }

  /**
   * Kiểm tra xem user có tồn tại trong localStorage không
   */
  static getUserFromStorage() {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch (error) {
          console.error('Error parsing user from localStorage:', error);
          return null;
        }
      }
    }
    return null;
  }

  /**
   * Clear user data khi logout
   */
  static clearUserData() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      
      // Dispatch events
      window.dispatchEvent(new Event('authChanged'));
      
      console.log('User data cleared from localStorage');
    }
  }
}