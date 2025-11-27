"use client";
import SearchBar from "@/components/feature/search/SearchBar";
import { useRouter } from "next/navigation";
import HeaderDropdown from "../feature/header/HeaderDropdown";
import MobileDropdown from "../feature/header/MobileDropdown";
import { useState } from "react";
import { useHeaderDropdownItems } from "@/hooks/useHeader";
import { useSearchQuery } from "@/hooks/useSearch";
import ServiceChecker from "@/services/ServiceChecker";
import { useResponsive } from "@/hooks/useResponsive";

export default function PageHeader() {
  const route = useRouter();
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const goHome = () => {
    ServiceChecker.resetServiceCheck();
    ServiceChecker.checkServiceAvailability();
    route.push("/");
  };

  // State management
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Dropdown items
  const genreItems = useHeaderDropdownItems("genre");
  const countryItems = useHeaderDropdownItems("country");
  const moreItems = useHeaderDropdownItems("more");

  // Toggle dropdown visibility
  const handleDropdownToggle = (type: string) => {
    setOpenDropdown((prev) => (prev === type ? null : type));
  };

  // Close dropdown when clicking outside
  const handleClickOutside = () => {
    setOpenDropdown(null);
  };

  // Handle mobile menu toggle
  const handleMobileMenuToggle = () => {
    setShowMobileDropdown(!showMobileDropdown);
    setShowMobileSearch(false); // Close search when opening menu
  };

  // Handle mobile search toggle
  const handleMobileSearchToggle = () => {
    setShowMobileSearch(!showMobileSearch);
    setShowMobileDropdown(false); // Close menu when opening search
  };

  // Use the useSearch hook
  const { query, onSearch } = useSearchQuery();

  // Desktop Header
  if (isDesktop) {
    return (
      <div 
        className="flex space-x-[3vw] mx-auto py-3 px-5" 
        onClick={handleClickOutside}
      >
        <button className="flex items-center shrink-0 cursor-pointer" onClick={goHome}>
          <img src="/logo.png" alt="PopRCM Logo" className="h-[60px] w-auto" />
        </button>
        <SearchBar onSearch={onSearch} value={query} />

        <div className="flex items-center">
          <nav className="flex shrink-0 items-center space-x-[2.5vw] text-white/70 text-sm text-nowrap">
            <a href="/single" className="hover:text-white transition">
              Phim lẻ
            </a>
            <a href="/series" className="hover:text-white transition">
              Phim bộ
            </a>

            {/* Genre Dropdown */}
            <div className="relative">
              <button
                className="hover:text-white transition flex items-center space-x-2 text-white opacity-70 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDropdownToggle("genre");
                }}
              >
                <div>Thể loại</div>
                <img src="/icons/Down.png" alt="" className="w-auto h-1.5" />
              </button>
              {openDropdown === "genre" && (
                <div className="absolute top-8 -left-2">
                  <HeaderDropdown items={genreItems} type="genre" />
                </div>
              )}
            </div>

            {/* Country Dropdown */}
            <div className="relative">
              <button
                className="hover:text-white transition flex items-center space-x-2 text-white opacity-70 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDropdownToggle("country");
                }}
              >
                <div>Quốc gia</div>
                <img src="/icons/Down.png" alt="" className="w-auto h-1.5" />
              </button>
              {openDropdown === "country" && (
                <div className="absolute top-8 -left-2">
                  <HeaderDropdown items={countryItems} type="country" />
                </div>
              )}
            </div>

            {/* More Dropdown */}
            <div className="relative">
              <button
                className="hover:text-white transition flex items-center space-x-2 text-white opacity-70 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDropdownToggle("more");
                }}
              >
                <div>Thêm</div>
                <img src="/icons/Down.png" alt="" className="w-auto h-1.5" />
              </button>
              {openDropdown === "more" && (
                <div className="absolute top-8 -left-2">
                  <HeaderDropdown items={moreItems} type="more" />
                </div>
              )}
            </div>

            <a
              href="#"
              className="hover:text-white transition flex items-top space-x-2 text-white opacity-70 hover:opacity-100"
            >
              <div>AI gợi ý phim</div>
              <img src="/icons/Sparkles.png" alt="" className="w-4 h-4" />
            </a>
          </nav>
        </div>

        <div className="flex items-center">
          <button className="flex items-center space-x-1.5 bg-(--primary)/30 px-4 py-3 border-2 border-(--primary) rounded-lg">
            <img src="/icons/Account.png" alt="Account" className="w-5 h-5" />
            <div className="text-white font-medium text-nowrap text-shadow-[1px_1px_2px_var(--border-blue)]">
              Đăng nhập
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Tablet/Mobile Header
  return (
    <div className="relative">
      <div className="flex items-center justify-between py-3 px-4">
        {/* Left side - Menu button and Logo */}
        <div className="flex items-center space-x-3">
          <button
            className="p-2 text-white hover:text-(--primary) transition"
            onClick={handleMobileMenuToggle}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button className="flex items-center cursor-pointer" onClick={goHome}>
            <img src="/logo.png" alt="PopRCM Logo" className="h-[40px] w-auto" />
          </button>
        </div>

        {/* Right side - Notification and Search */}
        <div className="flex items-center space-x-3">
          {/* Notification icon (placeholder for future) */}
          <button className="p-2 text-white hover:text-(--primary) transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3.5-3.5L15 17zM9 19c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" />
            </svg>
          </button>

          {/* Search button */}
          <button
            className="p-2 text-white hover:text-(--primary) transition"
            onClick={handleMobileSearchToggle}
          >
            {showMobileSearch ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <div className="absolute top-full left-0 right-0 bg-(--surface) border-t border-(--border) z-40 px-4 py-3">
          <SearchBar onSearch={onSearch} value={query} />
        </div>
      )}

      {/* Mobile Dropdown Menu */}
      <MobileDropdown 
        isOpen={showMobileDropdown} 
        onClose={() => setShowMobileDropdown(false)} 
      />
    </div>
  );
}