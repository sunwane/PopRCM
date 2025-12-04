import { useState, useEffect, useMemo } from "react";
import { MoviesService } from "../../services/MoviesService";
import { Movie } from "@/types/Movies";

export function useMoviesData() {
  const [languages, setLanguages] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMoviesData = async () => {
      try {
        const [languagesData, typesData, statusesData] = await Promise.all([
          MoviesService.getUniqueLanguages(),
          MoviesService.getUniqueTypes(),
          MoviesService.getUniqueStatuses(),
        ]);

        setLanguages(languagesData);
        setTypes(typesData);
        setStatuses(statusesData);
      } catch (err) {
        setError("Lỗi khi tải dữ liệu phim");
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesData();
  }, []);

  // Memoize the data to avoid unnecessary re-renders
  const memoizedLanguages = useMemo(() => languages, [languages]);
  const memoizedTypes = useMemo(() => types, [types]);
  const memoizedStatuses = useMemo(() => statuses, [statuses]);

  return {
    languages: memoizedLanguages,
    types: memoizedTypes,
    statuses: memoizedStatuses,
    loading,
    error,
  };
}

export function useMoviesDataByID(id: string) {
  const [movieInfo, setMovieInfo] = useState<Movie>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchMovieByID = async () => {
      try {
        const movie = await MoviesService.getMovieById(id);
        if (movie) {
          setMovieInfo(movie);
        } else {
          setMovieInfo(undefined);
        }
        console.log("Fetched movie:", movie);
      } catch (err) {
        setError("Lỗi khi tải thông tin phim");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieByID();
    }
  }, [id]);

  return {
    movieInfo,
    loading,
    error,
  };
}