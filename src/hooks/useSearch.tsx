import { useState, useEffect } from "react";
import { ActorService } from "@/services/ActorService";
import { MoviesService } from "@/services/MoviesService";
import { Actor } from "@/types/Actor";
import { Movie } from "@/types/Movies";
import { useDebounce } from "./useDebounce";

export function useSearchQuery() {
  const [query, setQuery] = useState<string>("");

  const onSearch = (value: string) => {
    setQuery(value);
  };

  return {
    query,
    onSearch,
  };
}

export function useSearchSuggestions(query: string) {
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const searchMovies = async () => {
      setLoading(true);
      try {
        const results = await MoviesService.searchMovies(debouncedQuery, 5);
        setSuggestions(results.slice(0, 5));
      } catch (error) {
        console.error('Search suggestions error:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    searchMovies();
  }, [debouncedQuery]);

  return {
    suggestions,
    loading,
  };
}

export function useSearchMoviesResult() {
  const [query, setQuery] = useState<string>("");

  const onSearchMovies = (value: string) => {
    setQuery(value);
  };

  return {
    query,
    onSearchMovies,
  };
}

export function useSearchActorsResult(query: string) {
  const [filteredActors, setFilteredActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchActors = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (query.trim()) {
          // Sử dụng ActorService.searchActors trực tiếp
          const results = await ActorService.searchActors(query, 0, 1000);
          setFilteredActors(results.actors);
        } else {
          // Nếu không có query, lấy tất cả actors
          const allActors = await ActorService.getAllActors(0, 1000);
          setFilteredActors(allActors.actors);
        }
      } catch (err) {
        setError('Lỗi khi tìm kiếm diễn viên');
        setFilteredActors([]);
      } finally {
        setLoading(false);
      }
    };

    searchActors();
  }, [query]);

  return {
    filteredActors, // Danh sách diễn viên đã lọc
    loading, // Trạng thái loading
    error, // Lỗi nếu có
  };
}