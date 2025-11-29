"use client";
import SearchBar from "@/components/feature/search/SearchBar";
import { useRouter } from "next/navigation";
import HeaderDropdown from "../feature/header/HeaderDropdown";
import SidebarMenu from "../feature/header/SidebarMenu";
import { useHeaderDropdownItems, useHeaderState } from "@/hooks/useHeader";
import { useSearchQuery } from "@/hooks/useSearch";
import ServiceChecker from "@/services/ServiceChecker";
import { useResponsive } from "@/hooks/useResponsive";
import { useAuth } from "@/hooks/useAuth";

export default function PageHeader() {
  const route = useRouter();
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const { isAuthenticated } = useAuth();

  const goHome = () => {
    ServiceChecker.resetServiceCheck();
    ServiceChecker.checkServiceAvailability();
    route.push("/");
  };

  // Sử dụng useHeaderState để quản lý state
  const {
    openDropdown,
    showMobileMenu,
    showMobileSearch,
    isScrolled, // Thêm isScrolled
    handleDropdownToggle,
    handleClickOutside,
    handleMobileMenuToggle,
    handleMobileSearchToggle,
    setShowMobileMenu,
  } = useHeaderState();

  // Dropdown items
  const genreItems = useHeaderDropdownItems("genre");
  const countryItems = useHeaderDropdownItems("country");
  const moreItems = useHeaderDropdownItems("more");

  // Use the useSearch hook
  const { query, onSearch } = useSearchQuery();

  // Dynamic background class
  const headerBgClass = isScrolled 
    ? "bg-(--background)/90 backdrop-blur-md" 
    : "bg-transparent";

  // Desktop Header - Sticky với dynamic background
  if (isDesktop) {
    return (
      <div className={`sticky top-0 z-30 transition-all duration-300 ${headerBgClass}`}>
        <div 
          className="flex space-x-[3vw] py-3 px-5 relative w-full border-none items-center justify-between" 
          onClick={handleClickOutside}
        >
          <button className="flex items-center shrink-0 cursor-pointer" onClick={goHome}>
            <img src="/logo.png" alt="PopRCM Logo" className="h-14 w-auto" />
          </button>
          <SearchBar onSearch={onSearch} value={query} />

          <div className="flex items-center">
            <nav className="flex shrink-0 items-center space-x-[2.5vw] text-white/70 text-[13px] text-nowrap">
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
              <img src="/icons/Account.png" alt="Account" className="w-4 h-4" />
              <div className="text-white font-medium text-nowrap text-sm text-shadow-[1px_1px_2px_var(--border-blue)]">
                {isAuthenticated ? "Tài khoản" : "Đăng nhập"}
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mobile/Tablet Header với dynamic background
  return (
    <>
      <div className={`relative z-30 md:sticky md:top-0 transition-all duration-300 ${headerBgClass}`}>
        <div className="flex items-center justify-between py-3 px-4 relative">
          {/* Left side - Menu button and Logo */}
          <div className={`flex items-center lg:space-x-3 md:space-x-2 sm:space-x-2 space-x-2 transition-all duration-300`}>
            <button
              className="p-2 text-white hover:text-(--primary) transition"
              onClick={handleMobileMenuToggle}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button className={`flex items-center cursor-pointer transition-all duration-300 ${showMobileSearch ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} onClick={goHome}>
              <img src="/logo.png" alt="PopRCM Logo" className={`lg:h-14 md:h-14 h-12 w-auto`} />
            </button>
          </div>

          {/* Search Overlay */}
          {showMobileSearch && (
            <div className="absolute left-18 right-17 top-1/2 transform -translate-y-1/2 z-40">
              <SearchBar onSearch={onSearch} value={query} adjustStyle="w-full"/>
            </div>
          )}

          {/* Right side - Notification and Search */}
          <div className="flex items-center space-x-3">
            {/* Notification icon - chỉ hiển thị khi đăng nhập và không search */}
            {isAuthenticated && !showMobileSearch && (
              <button className="p-2 text-white hover:text-(--primary) transition">
                <img src="/icons/Bell.png" alt="Notifications" className="w-7 h-7" />
              </button>
            )}

            {/* Search button */}
            <button
              className="p-2 text-white hover:text-(--primary) transition"
              onClick={handleMobileSearchToggle}
            >
              {showMobileSearch ? (
                <svg className="w-8 h-8" fill="none" stroke="red" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      <SidebarMenu
        isOpen={showMobileMenu} 
        onClose={() => setShowMobileMenu(false)} 
      />
    </>
  );
}