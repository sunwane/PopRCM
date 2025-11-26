"use client";
import SearchBar from "@/components/feature/search/SearchBar";
import { useRouter } from "next/navigation";
import HeaderDropdown from "../feature/header/HeaderDropdown";
import { useState } from "react";
import { useHeaderDropdownItems } from "@/hooks/useHeader";
import { useSearchQuery } from "@/hooks/useSearch";
import ServiceChecker from "@/services/ServiceChecker";

export default function PageHeader() {
  const route = useRouter();
  const goHome = () => {
    ServiceChecker.resetServiceCheck();
    ServiceChecker.checkServiceAvailability();
    route.push("/");
  };

  // State to track which dropdown is open
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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

  // Use the useSearch hook
  const { query, onSearch } = useSearchQuery();

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
        {/* Navigation Links */}
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
                e.stopPropagation(); // Prevent closing dropdown when clicking inside
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

      {/* User Actions */}
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