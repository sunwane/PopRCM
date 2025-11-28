"use client";
import { useState, useEffect } from "react";
import { useHeaderDropdownItems } from "@/hooks/useHeader";
import { useAuth } from "@/hooks/useAuth";

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SidebarMenu({ isOpen, onClose }: SidebarMenuProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const { isAuthenticated, user, logout } = useAuth();

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
        className={`fixed top-0 left-0 h-full lg:w-2/5 md:w-3/5 sm:w-4/5 w-4/5 bg-(--surface) z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-2xl`}
      >

        {/* Content */}
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="flex-1 px-4 py-6">
            {/* Thông tin tài khoản */}
            {isAuthenticated && user ? (
              <div className="pb-6 mb-6 border-b border-(--border)/30">
                <div className="flex items-center space-x-4 mb-4">
                  <img 
                    src={user.avatarUrl || "/icons/Account.png"} 
                    alt="Avatar" 
                    className="w-12 h-12 rounded-full bg-(--primary)/20 border-2 border-(--primary)/30" 
                  />
                  <div className="flex-1">
                    <p className="text-white font-semibold text-base">
                      {user.fullName}
                    </p>
                    <p className="text-white/60 text-sm">{user.email}</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button 
                    className="flex-1 bg-(--primary)/20 text-(--primary) px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-(--primary)/30 transition"
                    onClick={onClose}
                  >
                    Hồ sơ
                  </button>
                  <button 
                    className="flex-1 bg-red-500/20 text-red-400 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-red-500/30 transition"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <div className="pb-6 mb-6 border-b border-(--border)/30">
                <button 
                  className="w-full bg-(--primary)/30 text-white px-6 py-4 rounded-2xl font-semibold hover:bg-(--primary)/40 transition flex items-center justify-center space-x-3"
                  onClick={onClose}
                >
                  <img src="/icons/Account.png" alt="Account" className="w-6 h-6" />
                  <span>Đăng nhập</span>
                </button>
              </div>
            )}

            {/* Menu chính */}
            <div className="space-y-2">
              {/* Phim lẻ */}
              <a 
                href="/single" 
                className="flex items-center space-x-4 py-4 px-4 text-white hover:text-(--primary) hover:bg-(--primary)/10 rounded-xl transition group"
                onClick={onClose}
              >
                <div className="w-8 h-8 bg-(--primary)/20 rounded-lg flex items-center justify-center group-hover:bg-(--primary)/30 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-base font-medium">Phim lẻ</span>
              </a>

              {/* Phim bộ */}
              <a 
                href="/series" 
                className="flex items-center space-x-4 py-4 px-4 text-white hover:text-(--primary) hover:bg-(--primary)/10 rounded-xl transition group"
                onClick={onClose}
              >
                <div className="w-8 h-8 bg-(--primary)/20 rounded-lg flex items-center justify-center group-hover:bg-(--primary)/30 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                </div>
                <span className="text-base font-medium">Phim bộ</span>
              </a>

              {/* Thể loại */}
              <div className="py-1">
                <button
                  className="flex items-center justify-between w-full py-4 px-4 text-white hover:text-(--primary) hover:bg-(--primary)/10 rounded-xl transition group"
                  onClick={() => toggleSection("genre")}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-(--primary)/20 rounded-lg flex items-center justify-center group-hover:bg-(--primary)/30 transition">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                      </svg>
                    </div>
                    <span className="text-base font-medium">Thể loại</span>
                  </div>
                  <svg 
                    className={`w-5 h-5 transition-transform duration-200 ${
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
                  <div className="mt-2 ml-12 space-y-1 bg-(--surface)/50 rounded-xl py-3 px-2">
                    {genreItems.map((item, index) => (
                      <a
                        key={index}
                        href={`/genre/${item.id}`}
                        className="block py-2.5 px-4 text-sm text-white/70 hover:text-white hover:bg-(--primary)/10 rounded-lg transition"
                        onClick={onClose}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Quốc gia */}
              <div className="py-1">
                <button
                  className="flex items-center justify-between w-full py-4 px-4 text-white hover:text-(--primary) hover:bg-(--primary)/10 rounded-xl transition group"
                  onClick={() => toggleSection("country")}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-(--primary)/20 rounded-lg flex items-center justify-center group-hover:bg-(--primary)/30 transition">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-base font-medium">Quốc gia</span>
                  </div>
                  <svg 
                    className={`w-5 h-5 transition-transform duration-200 ${
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
                  <div className="mt-2 ml-12 space-y-1 bg-(--surface)/50 rounded-xl py-3 px-2">
                    {countryItems.map((item, index) => (
                      <a
                        key={index}
                        href={`/country/${item.id}`}
                        className="block py-2.5 px-4 text-sm text-white/70 hover:text-white hover:bg-(--primary)/10 rounded-lg transition"
                        onClick={onClose}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Thêm */}
              <div className="py-1">
                <button
                  className="flex items-center justify-between w-full py-4 px-4 text-white hover:text-(--primary) hover:bg-(--primary)/10 rounded-xl transition group"
                  onClick={() => toggleSection("more")}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-(--primary)/20 rounded-lg flex items-center justify-center group-hover:bg-(--primary)/30 transition">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </div>
                    <span className="text-base font-medium">Thêm</span>
                  </div>
                  <svg 
                    className={`w-5 h-5 transition-transform duration-200 ${
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
                  <div className="mt-2 ml-12 space-y-1 bg-(--surface)/50 rounded-xl py-3 px-2">
                    {moreItems.map((item, index) => (
                      <a
                        key={index}
                        href={item.link}
                        className="block py-2.5 px-4 text-sm text-white/70 hover:text-white hover:bg-(--primary)/10 rounded-lg transition"
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
                className="flex items-center space-x-4 py-4 px-4 text-white hover:text-(--primary) hover:bg-(--primary)/10 rounded-xl transition group"
                onClick={onClose}
              >
                <div className="w-8 h-8 bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition">
                  <img src="/icons/Sparkles.png" alt="" className="w-5 h-5" />
                </div>
                <span className="text-base font-medium">AI gợi ý phim</span>
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