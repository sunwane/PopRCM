import { useMemo } from "react";
import { useGenreData } from "./useGenreData";
import { useCountryData } from "./useCountryData";

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