"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHeaderDropdownItems } from "@/hooks/useHeader";
import { useAuth } from "@/hooks/useAuth";
import { useUserData } from "@/hooks/useData/useUserData";
import GradientAvatar from "@/components/ui/GradientAvatar";

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth?: () => void;
}

export default function SidebarMenu({ isOpen, onClose, onOpenAuth }: SidebarMenuProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const { userProfile, getUserAvatarText } = useUserData();

  const genreItems = useHeaderDropdownItems("genre");
  const countryItems = useHeaderDropdownItems("country");
  const moreItems = useHeaderDropdownItems("more");

  const toggleSection = (section: string) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full lg:w-2/5 md:w-2/5 sm:w-3/5 w-5/7 bg-(--background) border-r border-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-2xl`}
      >

        {/* Content */}
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="flex-1 px-4 py-6">
            {/* Thông tin tài khoản */}
            {isAuthenticated && userProfile ? (
              <div className="pb-6 mb-6 border-b border-(--border)/30">
                <div className="flex items-center space-x-2.5 mb-4">
                  {userProfile.avatarUrl ? (
                    <img 
                      src={userProfile.avatarUrl} 
                      alt="Avatar" 
                      className="w-12 h-12 rounded-full bg-(--primary)/20 border-2 border-(--primary)/30 object-cover" 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={userProfile.avatarUrl ? 'hidden' : ''}>
                    <GradientAvatar 
                      initial={getUserAvatarText(userProfile.fullName)} 
                      size="w-12 h-12 lg:text-lg md:text-lg sm:text-base text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold lg:text-base md:text-base sm:text-sm text-xs flex items-center gap-1.5">
                      {userProfile.fullName || userProfile.userName}
                      {userProfile.gender && (
                        <img 
                          src={`/icons/${userProfile.gender === 'male' ? 'Male' : 'Female'}.png`} 
                          alt={userProfile.gender} 
                          className="w-4 h-4" 
                        />
                      )}
                    </p>
                    <div className="truncate line-clamp-1 lg:text-sm md:text-sm sm:text-xs text-xs">
                      <p className="text-white/60">{userProfile.email}</p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button 
                    className="flex-1 bg-(--primary)/20 text-(--primary) px-4 py-3 rounded-md lg:text-sm md:text-sm text-xs font-medium hover:bg-(--primary)/30 transition"
                    onClick={() => {
                      onClose();
                      router.push('/myaccount?tab=profile');
                    }}
                  >
                    Hồ sơ
                  </button>
                  <button 
                    className="flex-1 bg-red-500/30 text-red-500 px-4 py-3 rounded-md lg:text-sm md:text-sm text-xs font-medium hover:bg-red-500/30 transition"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <div className="pb-6 mb-6 border-b border-(--border)/30">
                <button 
                  className="w-full bg-(--primary)/30 text-white px-6 py-4 rounded-2xl font-semibold hover:bg-(--primary)/40 transition flex items-center justify-center lg:space-x-3 md:space-x-3 sm:space-x-2 space-x-2"
                  onClick={() => {
                    onClose();
                    onOpenAuth?.();
                  }}
                >
                  <img src="/icons/Account.png" alt="Account" className="lg:w-6 lg:h-6 md:w-6 md:h-6 w-5 h-5" />
                  <span className="lg:text-base md:text-base text-sm">Đăng nhập</span>
                </button>
              </div>
            )}

            {/* Menu chính */}
            <div className="lg:space-y-1 md:space-y-1 space-y-0.5">
              {/* Phim lẻ */}
              <a 
                href="/single" 
                className="flex items-center space-x-4 py-4 px-4 text-white hover:text-(--primary) hover:bg-(--primary)/10 rounded-xl transition group"
                onClick={onClose}
              >
                <span className="lg:text-base md:text-base text-sm font-medium">Phim lẻ</span>
              </a>

              {/* Phim bộ */}
              <a 
                href="/series" 
                className="flex items-center space-x-4 py-4 px-4 text-white hover:text-(--primary) hover:bg-(--primary)/10 rounded-xl transition group"
                onClick={onClose}
              >
                <span className="lg:text-base md:text-base text-sm font-medium">Phim bộ</span>
              </a>

              {/* Thể loại */}
              <div className="">
                <button
                  className="flex items-center justify-between w-full py-4 px-4 text-white hover:text-(--primary) hover:bg-(--primary)/10 rounded-xl transition group"
                  onClick={() => toggleSection("genre")}
                >
                  <div className="flex items-center space-x-4">
                    <span className="lg:text-base md:text-base text-sm ">Thể loại</span>
                  </div>
                  <svg 
                    className={`lg:w-5 lg:h-5 md:w-5 md:h-5 w-4 h-4 transition-transform duration-200 ${
                      expandedSection === "genre" ? "rotate-180" : ""
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedSection === "genre" && (
                  <div className="grid grid-cols-2 space-y-1 py-1 px-1.5 lg:mt-0 md:mt-0 -mt-1">
                    {genreItems.map((item, index) => (
                      <a
                        key={index}
                        href={`/genre/${item.id}`}
                        className="block py-2.5 px-4 lg:text-sm md:text-sm text-xs text-white/70 hover:text-white hover:bg-(--primary)/10 rounded-lg transition"
                        onClick={onClose}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Quốc gia */}
              <div className="">
                <button
                  className="flex items-center justify-between w-full py-4 px-4 text-white hover:text-(--primary) hover:bg-(--primary)/10 rounded-xl transition group"
                  onClick={() => toggleSection("country")}
                >
                  <div className="flex items-center space-x-4">
                    <span className="lg:text-base md:text-base text-sm ">Quốc gia</span>
                  </div>
                  <svg 
                    className={`lg:w-5 lg:h-5 md:w-5 md:h-5 w-4 h-4 transition-transform duration-200 ${
                      expandedSection === "country" ? "rotate-180" : ""
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedSection === "country" && (
                  <div className="grid grid-cols-2 space-y-1 py-1 px-1.5 lg:mt-0 md:mt-0 -mt-1">
                    {countryItems.map((item, index) => (
                      <a
                        key={index}
                        href={`/country/${item.id}`}
                        className="block py-2.5 px-4 lg:text-sm md:text-sm text-xs text-white/70 hover:text-white hover:bg-(--primary)/10 rounded-lg transition"
                        onClick={onClose}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Thêm */}
              <div className="">
                <button
                  className="flex items-center justify-between w-full py-4 px-4 text-white hover:text-(--primary) hover:bg-(--primary)/10 rounded-xl transition group"
                  onClick={() => toggleSection("more")}
                >
                  <div className="flex items-center space-x-4">
                    <span className="lg:text-base md:text-base text-sm ">Thêm</span>
                  </div>
                  <svg 
                    className={`lg:w-5 lg:h-5 md:w-5 md:h-5 w-4 h-4 transition-transform duration-200 ${
                      expandedSection === "more" ? "rotate-180" : ""
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedSection === "more" && (
                  <div className="space-y-1 rounded py-1 px-1.5 lg:mt-0 md:mt-0 -mt-1">
                    {moreItems.map((item, index) => (
                      <a
                        key={index}
                        href={item.link}
                        className="block py-2.5 px-4 lg:text-sm md:text-sm text-xs text-white/70 hover:text-white hover:bg-(--primary)/10 rounded-lg transition"
                        onClick={onClose}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* AI gợi ý phim */}
              <a 
                href="#" 
                className="flex items-center space-x-1.5 py-4 px-4 text-white hover:text-(--primary) hover:bg-(--primary)/10 rounded-xl transition group"
                onClick={onClose}
              >
                <span className="lg:text-base md:text-base text-sm ">AI gợi ý phim</span>
                <img src="/icons/Sparkles.png" alt="" className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Footer của sidebar */}
          <div className="p-4 border-t border-(--border)/30">
            <div className="text-center text-white/50 text-xs">
              <p>© 2024 PopRCM</p>
              <p>Phiên bản 1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}