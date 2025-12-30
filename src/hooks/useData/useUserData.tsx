import { useState, useEffect } from 'react';
import { UserService } from '@/services/UserService';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types/User';

export function useUserData() {
  const { isAuthenticated, user: authUser, updateUser } = useAuth();
  const [userProfile, setUserProfile] = useState<Omit<User, "password"> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sync với auth user khi thay đổi
  useEffect(() => {
    if (isAuthenticated && authUser) {
      setUserProfile(authUser);
    } else {
      setUserProfile(null);
    }
  }, [isAuthenticated, authUser]);

  // Update profile
  const updateProfile = async (userId: string, updatedData: Partial<User>): Promise<boolean> => {
    try {
      setLoading(true);
      setError('');
      const updatedUser = await UserService.updateProfile(userId, updatedData);
      if (updatedUser) {
        setUserProfile(updatedUser);
        // Cập nhật vào AuthProvider và localStorage
        updateUser(updatedUser);
        
        // Reload trang sau khi cập nhật thành công
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || 'Cập nhật thông tin thất bại');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Upload avatar
  const uploadAvatar = async (userId: string, file: File): Promise<string | null> => {
    try {
      setLoading(true);
      setError('');
      const avatarUrl = await UserService.uploadAvatar(userId, file);
      if (avatarUrl && userProfile) {
        const updatedProfile = { ...userProfile, avatarUrl };
        setUserProfile(updatedProfile);
        // Cập nhật vào AuthProvider và localStorage
        updateUser(updatedProfile);
        
        // Reload trang sau khi upload thành công
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      return avatarUrl;
    } catch (err: any) {
      setError(err.message || 'Upload avatar thất bại');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete avatar
  const deleteAvatar = async (userId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError('');
      const success = await UserService.deleteAvatar(userId);
      if (success && userProfile) {
        const updatedProfile = { ...userProfile, avatarUrl: '' };
        setUserProfile(updatedProfile);
        // Cập nhật vào AuthProvider và localStorage
        updateUser(updatedProfile);
        
        // Reload trang sau khi xóa thành công
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      return success;
    } catch (err: any) {
      setError(err.message || 'Xóa avatar thất bại');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get avatar text from full name
  const getUserAvatarText = (fullName?: string): string => {
    if (!fullName) return 'U';
    
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    // Lấy chữ cái đầu của tên và họ
    const firstInitial = names[0].charAt(0).toUpperCase();
    const lastInitial = names[names.length - 1].charAt(0).toUpperCase();
    
    return firstInitial + lastInitial;
  };

  // Clear error
  const clearError = () => {
    setError('');
  };

  return {
    userProfile,
    loading,
    error,
    clearError,
    updateProfile,
    uploadAvatar,
    deleteAvatar,
    getUserAvatarText
  };
}
