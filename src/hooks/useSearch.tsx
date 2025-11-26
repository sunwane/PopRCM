import { useState, useEffect } from "react";
import { ActorService } from "@/services/ActorService";
import { Actor } from "@/types/Actor";

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
          const results = await ActorService.searchActors(query);
          setFilteredActors(results);
        } else {
          // Nếu không có query, lấy tất cả actors
          const allActors = await ActorService.getAllActors(0, 1000);
          setFilteredActors(allActors);
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