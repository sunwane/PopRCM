"use client";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUserData } from '@/hooks/useData/useUserData';
import GradientAvatar from '@/components/ui/GradientAvatar';

interface AccountDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountDropdown({ isOpen, onClose }: AccountDropdownProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const { userProfile, getUserAvatarText } = useUserData();

  if (!isOpen || !userProfile) return null;

  const handleNavigation = (path: string, tab?: string) => {
    onClose();
    if (tab) {
      router.push(`${path}?tab=${tab}`);
    } else {
      router.push(path);
    }
  };

  const handleLogout = async () => {
    onClose();
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-64 bg-(--background) border border-white/20 rounded-lg shadow-lg z-50">
      {/* User Info Header */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center space-x-3">
          {userProfile.avatarUrl ? (
            <img 
              src={userProfile.avatarUrl} 
              alt={userProfile.fullName || userProfile.userName}
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={userProfile.avatarUrl ? 'hidden' : ''}>
            <GradientAvatar 
              initial={getUserAvatarText(userProfile.fullName)} 
              size="w-12 h-12 text-lg"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-semibold truncate flex items-center gap-1">
              {userProfile.fullName || userProfile.userName}
              {userProfile.gender === 'male' ? (
                <img src="/icons/Male.png" alt="Male" className="w-4 h-4" />
              ) : (
                <img src="/icons/Female.png" alt="Female" className="w-4 h-4" />
              )}
            </div>
            <div className="text-gray-400 text-xs truncate">
              <span>{userProfile.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        <button
          onClick={() => handleNavigation('/myaccount', 'favorites')}
          className="w-full px-4 py-3 text-left text-white hover:bg-(--surface) transition-colors flex items-center space-x-3"
        >
          <img src="/icons/Heart.png" alt="Favorites" className="w-5 h-5" />
          <span>Yêu thích</span>
        </button>

        <button
          onClick={() => handleNavigation('/myaccount', 'history')}
          className="w-full px-4 py-3 text-left text-white hover:bg-(--surface) transition-colors flex items-center space-x-3"
        >
          <img src="/icons/History.png" alt="History" className="w-5 h-5" />
          <span>Lịch sử xem</span>
        </button>

        <button
          onClick={() => handleNavigation('/myaccount', 'profile')}
          className="w-full px-4 py-3 text-left text-white hover:bg-(--surface) transition-colors flex items-center space-x-3"
        >
          <img src="/icons/Account.png" alt="Profile" className="w-5 h-5" />
          <span>Tài khoản</span>
        </button>

        <div className="border-t border-white/20 my-2"></div>

        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 text-left text-red-400 hover:bg-(--surface) transition-colors flex items-center space-x-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}