import { useMemo, useState, useEffect } from "react";
import { useGenreData } from "@/hooks/useData/useGenreData";
import { useCountryData } from "@/hooks/useData/useCountryData";

export interface DropdownItem {
  label: string;
  id: string;
  link?: string; // Optional link for the dropdown item
  icon?: string; // Optional icon for the dropdown item
}

export function useHeaderDropdownItems(type: string): DropdownItem[] {
  const { allGenres, loading: genreLoading } = useGenreData();
  const { allCountries, loading: countryLoading } = useCountryData();

  const items = useMemo(() => {
    if (type === "genre") {
      if (genreLoading) return [];
      return allGenres.map((genre) => ({
        label: genre.genresName,
        id: genre.id,
      }));
    } else if (type === "country") {
      if (countryLoading) return [];
      return allCountries.map((country) => ({
        label: country.name,
        id: country.id,
      }));
    } else if (type === "more") {
      // Dữ liệu tĩnh cho more
      return [
        { label: "Series", link: "/allSeries", id: "series" },
        { label: "Hoạt hình", link: "/hoathinh", id: "hoathinh" },
        { label: "Diễn viên", link: "/actors", id: "actors" },
        { label: "Về chúng tôi", link: "/about", id: "about" },
      ];
    }
    return [];
  }, [type, allGenres, allCountries, genreLoading, countryLoading]);

  return items;
}

// Hook quản lý state cho header
export function useHeaderState() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Theo dõi scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50); // Thay đổi background sau khi scroll 50px
    };

    // Thêm event listener
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleDropdownToggle = (type: string) => {
    setOpenDropdown((prev) => (prev === type ? null : type));
  };

  const handleClickOutside = () => {
    setOpenDropdown(null);
  };

  const handleMobileMenuToggle = () => {
    setShowMobileMenu(!showMobileMenu);
    setShowMobileSearch(false); // Close search when opening menu
  };

  const handleMobileSearchToggle = () => {
    setShowMobileSearch(!showMobileSearch);
    setShowMobileMenu(false); // Close menu when opening search
  };

  return {
    openDropdown,
    showMobileMenu,
    showMobileSearch,
    isScrolled, // Thêm isScrolled vào return
    handleDropdownToggle,
    handleClickOutside,
    handleMobileMenuToggle,
    handleMobileSearchToggle,
    setShowMobileMenu,
    setShowMobileSearch,
  };
}