import { useState, useEffect, useMemo } from "react";
import { MoviesService } from "../services/MoviesService";
import { Country } from "@/types/Country";
import { Genre } from "@/types/Genres";
import { useGenreData } from "./useGenreData";
import { useCountryData } from "./useCountryData";

export function useFilterOptions() {
  const { allGenres: allgenres } = useGenreData();
  const { allCountries: countries } = useCountryData();
  
  const [languages, setLanguages] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  
  const sortOptions = [
    "Mới cập nhật",
    "Nhiều lượt xem", 
    "Đánh giá POPRCM",
    "Điểm IMDB",
    "Điểm TMDB",
  ];

  // State cho từng giá trị bộ lọc
  const [country, setCountry] = useState<Country>({ id: "all", name: "Tất cả" });
  const [type, setType] = useState<string>("Tất cả");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [language, setLanguage] = useState<string>("Tất cả");
  const [year, setYear] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("Mới cập nhật");
  const [status, setStatus] = useState<string>("Tất cả");

  // Tải dữ liệu cho languages, types, statuses
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [languagesData, typesData, statusesData] = await Promise.all([
          MoviesService.getUniqueLanguages(),
          MoviesService.getUniqueTypes(), 
          MoviesService.getUniqueStatuses()
        ]);

        setLanguages(languagesData);
        setTypes(typesData);
        setStatuses(statusesData);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu bộ lọc:", error);
      }
    };

    fetchFilterData();
  }, []);

  // Hàm để cập nhật giá trị bộ lọc
  const updateCountry = (value: Country) => setCountry(value);
  const updateGenres = (value: Genre) => {
    setGenres((prevGenres) => {
      if (value.id === "all") {
        return [];
      }
      const exists = prevGenres.some((genre) => genre.id === value.id);
      if (exists) {
        return prevGenres.filter((genre) => genre.id !== value.id);
      }
      return [...prevGenres, value];
    });
  };
  const updateType = (value: string) => setType(value);
  const updateLanguage = (value: string) => setLanguage(value);
  const updateYear = (value: string | null) => setYear(value);
  const updateSortBy = (value: string) => setSortBy(value);
  const updateStatus = (value: string) => setStatus(value);

  return {
    countries,
    allgenres,
    languages,
    types,
    sortOptions,
    statuses,
    country,
    genres,
    type,
    language,
    year,
    sortBy,
    status,
    updateCountry,
    updateType,
    updateGenres,
    updateLanguage,
    updateYear,
    updateSortBy,
    updateStatus,
  };
}

export function useFilterResults(
  countryId?: string,
  genreIds?: string[],
  type?: string,
  language?: string,
  year?: string | null,
  status?: string,
  sortBy?: string,
) {
  const [filteredMovies, setFilteredMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Tạo stable genreIds để tránh re-render không cần thiết
  const stableGenreIds = useMemo(() => {
    return genreIds ? [...genreIds] : [];
  }, [genreIds?.join(',')]);

  // Tạo stable dependencies bằng useMemo
  const filterParams = useMemo(() => ({
    countryId: countryId || undefined,
    genreIds: stableGenreIds,
    type: type || undefined,
    language: language || undefined,
    year: year ? parseInt(year, 10) : undefined,
    status: status || undefined,
    sortBy: sortBy || undefined,
    query: "",
  }), [countryId, stableGenreIds, type, language, year, status, sortBy]);

  useEffect(() => {
    const fetchFilteredMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const movies = await MoviesService.getFilteredMovies(filterParams);
        setFilteredMovies(movies);
      } catch (err) {
        console.error("Lỗi khi lọc phim:", err);
        setError("Lỗi khi tải phim. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredMovies();
  }, [filterParams]); // Chỉ phụ thuộc vào filterParams đã được memo

  return { filteredMovies, loading, error };
}
