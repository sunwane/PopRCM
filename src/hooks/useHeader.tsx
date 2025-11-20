import { useEffect, useState } from "react";
import { GenresService } from "@/services/GenresService";
import { CountryService } from "@/services/CountryService";

export interface DropdownItem {
  label: string;
  id: string;
  link?: string; // Optional link for the dropdown item
  icon?: string; // Optional icon for the dropdown item
}

export function useHeaderDropdownItems(type: string): DropdownItem[] {
  const [items, setItems] = useState<DropdownItem[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      if (type === "genre") {
        // Lấy danh sách genres từ API
        const genres = await GenresService.getAllGenres();
        setItems(
          genres.map((genre) => ({
            label: genre.genresName,
            id: genre.id,
          }))
        );
      } else if (type === "country") {
        const countries = await CountryService.getAllCountries();
        setItems(
          countries.map((country) => ({
            label: country.name,
            id: country.id,
          }))
        );
      } else if (type === "more") {
        // Dữ liệu tĩnh cho more
        setItems([
          { label: "Series", id: "series" },
          { label: "Hoạt hình", id: "hoathinh" },
          { label: "Diễn viên", id: "actors" },
          { label: "Về chúng tôi", id: "aboutUs" },
        ]);
      }
    };

    fetchItems();
  }, [type]);

  return items;
}