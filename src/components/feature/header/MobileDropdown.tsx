"use client";
import { useState } from "react";
import { useHeaderDropdownItems } from "@/hooks/useHeader";

interface MobileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDropdown({ isOpen, onClose }: MobileDropdownProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const genreItems = useHeaderDropdownItems("genre");
  const countryItems = useHeaderDropdownItems("country");
  const moreItems = useHeaderDropdownItems("more");

  const toggleSection = (section: string) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 w-full bg-(--surface) border-t border-(--border) z-50 shadow-lg">
      <div className="py-4 px-6 space-y-4">
        {/* Phim lẻ */}
        <a 
          href="/single" 
          className="block py-2 text-white hover:text-(--primary) transition"
          onClick={onClose}
        >
          Phim lẻ
        </a>

        {/* Phim bộ */}
        <a 
          href="/series" 
          className="block py-2 text-white hover:text-(--primary) transition"
          onClick={onClose}
        >
          Phim bộ
        </a>

        {/* Thể loại */}
        <div>
          <button
            className="flex items-center justify-between w-full py-2 text-white hover:text-(--primary) transition"
            onClick={() => toggleSection("genre")}
          >
            <span>Thể loại</span>
            <img 
              src="/icons/Down.png" 
              alt="" 
              className={`w-3 h-3 transition-transform ${
                expandedSection === "genre" ? "rotate-180" : ""
              }`} 
            />
          </button>
          {expandedSection === "genre" && (
            <div className="pl-4 py-2 space-y-2 border-l-2 border-(--primary)/30">
              {genreItems.map((item, index) => (
                <a
                  key={index}
                  href={`/genre/${item.id}`}
                  className="block py-1 text-sm text-white/70 hover:text-white transition"
                  onClick={onClose}
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Quốc gia */}
        <div>
          <button
            className="flex items-center justify-between w-full py-2 text-white hover:text-(--primary) transition"
            onClick={() => toggleSection("country")}
          >
            <span>Quốc gia</span>
            <img 
              src="/icons/Down.png" 
              alt="" 
              className={`w-3 h-3 transition-transform ${
                expandedSection === "country" ? "rotate-180" : ""
              }`} 
            />
          </button>
          {expandedSection === "country" && (
            <div className="pl-4 py-2 space-y-2 border-l-2 border-(--primary)/30">
              {countryItems.map((item, index) => (
                <a
                  key={index}
                  href={`/country/${item.id}`}
                  className="block py-1 text-sm text-white/70 hover:text-white transition"
                  onClick={onClose}
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Thêm */}
        <div>
          <button
            className="flex items-center justify-between w-full py-2 text-white hover:text-(--primary) transition"
            onClick={() => toggleSection("more")}
          >
            <span>Thêm</span>
            <img 
              src="/icons/Down.png" 
              alt="" 
              className={`w-3 h-3 transition-transform ${
                expandedSection === "more" ? "rotate-180" : ""
              }`} 
            />
          </button>
          {expandedSection === "more" && (
            <div className="pl-4 py-2 space-y-2 border-l-2 border-(--primary)/30">
              {moreItems.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  className="block py-1 text-sm text-white/70 hover:text-white transition"
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
          className="flex items-center py-2 text-white hover:text-(--primary) transition"
          onClick={onClose}
        >
          <span>AI gợi ý phim</span>
          <img src="/icons/Sparkles.png" alt="" className="w-4 h-4 ml-2" />
        </a>
      </div>
    </div>
  );
}