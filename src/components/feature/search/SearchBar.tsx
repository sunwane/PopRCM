"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchSuggestions } from "@/hooks/useSearch";
import { SearchDropdown } from "./SearchDropdown";

export interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  value?: string;
  adjustStyle?: string;
}

export default function SearchBar({ placeholder = "Tìm kiếm phim, diễn viên...", onSearch, value, adjustStyle = "" }: SearchBarProps) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { suggestions, loading } = useSearchSuggestions(value || "");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setShowDropdown(false);
      router.push(`/searchresult?query=${encodeURIComponent(value?.toString() || "")}`);
    }
    if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onSearch && onSearch(newValue);
    setShowDropdown(true);
  };

  const handleFocus = () => {
    setInputFocused(true);
    setShowDropdown(true);
  };

  const handleBlur = () => {
    setInputFocused(false);
    // Delay hiding dropdown to allow clicks
    setTimeout(() => {
      if (!inputFocused) {
        setShowDropdown(false);
      }
    }, 200);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Show dropdown when there are suggestions and input is focused
  const shouldShowDropdown = showDropdown && inputFocused;

  return (
    <div ref={containerRef} className="relative flex grow items-center bg-blend-multiply">
        <input
          type="text"
          placeholder={placeholder}
          className={`w-auto lg:grow pl-12 pr-5 py-3.5 bg-white/15 rounded-lg text-white/90 text-sm placeholder-white/90 placeholder:font-light focus:outline-none focus:bg-white/25 transition ${adjustStyle}`}
          onChange={handleInputChange}
          value={value}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-white/80 absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* Search Dropdown */}
        {shouldShowDropdown && (
          <SearchDropdown
            suggestions={suggestions}
            loading={loading}
            query={value || ""}
            onClose={() => setShowDropdown(false)}
          />
        )}
    </div>
  );
}