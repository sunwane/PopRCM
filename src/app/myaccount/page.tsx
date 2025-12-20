"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUserData } from '@/hooks/useData/useUserData';
import GradientAvatar from '@/components/ui/GradientAvatar';
import FavoriteTab from '@/components/feature/accountTab/FavoriteTab';
import HistoryTab from '@/components/feature/accountTab/HistoryTab';
import NotificationTab from '@/components/feature/accountTab/NotificationTab';
import InfoTab from '@/components/feature/accountTab/InfoTab';
import PageHeader from '@/components/layout/PageHeader';
import PageFooter from '@/components/layout/PageFooter';

type TabType = 'favorites' | 'history' | 'notifications' | 'profile';

interface TabConfig {
  id: TabType;
  label: string;
  icon: string;
  component: React.ComponentType;
}

const tabs: TabConfig[] = [
  {
    id: 'favorites',
    label: 'Yêu thích',
    icon: '/icons/Heart.png',
    component: FavoriteTab
  },
  {
    id: 'history',
    label: 'Lịch sử xem',
    icon: '/icons/History.png',
    component: HistoryTab
  },
  {
    id: 'notifications',
    label: 'Thông báo',
    icon: '/icons/Bell.png',
    component: NotificationTab
  },
  {
    id: 'profile',
    label: 'Tài khoản',
    icon: '/icons/Account.png',
    component: InfoTab
  }
];

export default function MyAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user, loading } = useAuth();
  const { userProfile, getUserAvatarText } = useUserData();
  
  const [activeTab, setActiveTab] = useState<TabType>('favorites');
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle URL tab parameter
  useEffect(() => {
    if (mounted && isAuthenticated) {
      const tab = searchParams.get('tab') as TabType;
      if (tab && tabs.some(t => t.id === tab)) {
        setActiveTab(tab);
      }
    }
  }, [mounted, isAuthenticated, searchParams]);

  // Update URL when tab changes
  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set('tab', tabId);
    router.push(`/myaccount?${currentParams.toString()}`);
  };

  // Show loading while checking authentication or before mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-(--background) flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin w-8 h-8 border-4 border-(--primary) border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Đang khởi tạo...</p>
        </div>
      </div>
    );
  }

  const ActiveTabComponent = tabs.find(tab => tab.id === activeTab)?.component || FavoriteTab;

  return (
    <div className="min-h-screen bg-(--background)">
      <PageHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex lg:flex-row flex-col gap-6">
          {/* Left Sidebar - User Info + Tabs */}
          <div className="lg:w-80 w-full space-y-0 lg:sticky lg:top-6 lg:self-start">
              {/* Mobile horizontal tabs */}
              <div className="lg:hidden">
                <div className="flex overflow-x-auto scrollbar-hide bg-slate-800 rounded-lg">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`flex items-center space-x-2 pl-4 pr-8 py-3 whitespace-nowrap transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'text-blue-400 bg-slate-700/50 border-b-2 border-blue-400'
                          : 'text-gray-400 hover:text-white hover:bg-slate-700/30'
                      }`}
                    >
                      <img src={tab.icon} alt={tab.label} className="w-4 h-4" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Desktop vertical tabs */}
              <div className="hidden lg:block bg-(--surface)/50 rounded-lg overflow-hidden">
                <div className='px-6 py-8'>
                  {/* Header */}
                  <h2 className="text-white font-semibold text-lg flex items-center">
                    Quản lý tài khoản
                  </h2>
                  
                  {/* Navigation Tabs */}
                  <nav className="py-2 min-h-[300px]">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`w-full flex items-center space-x-3 border-b border-(--surface)/70 px-3 py-4 text-left transition-all duration-200 relative group`}>
                        <div className='relative'>
                          <img 
                            src={tab.icon} 
                            alt={tab.label} 
                            className={`w-5 h-5 transition-all ${
                              activeTab === tab.id 
                                ? 'mix-blend-overlay' 
                                : ''
                            }`}
                          />
                          <div className='absolute bg-(--hover)'></div>
                        </div>
                        <span className={`font-medium text-sm flex-1 ${activeTab === tab.id ? 'text-(--hover)' : 'text-gray-300'}`}>
                          {tab.label}
                        </span>
                        
                      </button>
                    ))}
                  </nav>
                </div>
                
                {/* User Info Section */}
                <div className="px-6 pt-4 pb-6 border-t border-slate-700 bg-slate-900/50">
                  <div className="flex items-center space-x-3">
                    {/* Avatar */}
                    <div className="shrink-0">
                      {userProfile?.avatarUrl ? (
                        <img 
                          src={userProfile.avatarUrl} 
                          alt={userProfile.fullName || userProfile.userName}
                          className="w-10 h-10 rounded-full object-cover border-2 border-slate-600"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={userProfile?.avatarUrl ? 'hidden' : ''}>
                        <GradientAvatar 
                          initial={getUserAvatarText(userProfile?.fullName)} 
                          size="w-10 h-10 text-sm"
                        />
                      </div>
                    </div>
                    
                    {/* User Details */}
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">
                        {userProfile?.fullName || userProfile?.userName || user?.fullName || 'Spiderman'}
                      </div>
                      <div className="text-gray-400 text-xs truncate">
                        {userProfile?.email || user?.email || 'spideryyyy@gmail.com'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Logout Button */}
                  <button 
                    onClick={() => {
                      // Handle logout logic here
                      localStorage.removeItem('authToken');
                      localStorage.removeItem('user');
                      router.push('/');
                    }}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            </div>


          {/* Right Content Area */}
          <div className="flex-1">
            <div>
              <ActiveTabComponent />
            </div>
          </div>
        </div>
      </div>
      <PageFooter />
    </div>
  );
}