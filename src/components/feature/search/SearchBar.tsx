"use client";
import { useRouter } from "next/navigation";

export interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  value?: string;
  adjustStyle?: string;
}

export default function SearchBar({ placeholder = "Tìm kiếm phim, diễn viên...", onSearch, value, adjustStyle = "" }: SearchBarProps) {
  const route = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      route.replace(`/searchresult?query=${encodeURIComponent(value?.toString() || "")}`);
    }
  };

  return (
    <div className="relative flex grow items-center bg-blend-multiply">
        <input
          type="text"
          placeholder={placeholder}
          className={`"w-auto lg:grow pl-12 pr-5 py-3.5 bg-white/15 rounded-lg text-white/90 text-sm placeholder-white/90 placeholder:font-light focus:outline-none focus:bg-white/25 transition" ${adjustStyle}`}
          onChange={(e) => onSearch && onSearch(e.target.value)}
          value={value}
          onKeyDown={handleKeyDown}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-white/80 absolute left-4 top-1/2 transform -translate-y-1/2"
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
    </div>
  );
}