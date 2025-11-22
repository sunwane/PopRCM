import { useState, useEffect, useMemo } from "react";
import { MoviesService } from "../../services/MoviesService";

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