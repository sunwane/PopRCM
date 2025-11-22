import { useState, useEffect } from "react";
import { GenresService } from "../../services/GenresService";
import { Genre } from "@/types/Genres";

export function useGenreData() {
  const [allGenres, setAllGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genres = await GenresService.getAllGenres();
        setAllGenres(genres);
      } catch (err) {
        setError("Lỗi khi tải danh sách thể loại");
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const findGenreById = (id: string): Genre | null => {
    return allGenres.find(genre => genre.id === id) || null;
  };

  const findGenresByIds = (ids: string[]): Genre[] => {
    return allGenres.filter(genre => ids.includes(genre.id));
  };

  return {
    allGenres,
    loading,
    error,
    findGenreById,
    findGenresByIds
  };
}