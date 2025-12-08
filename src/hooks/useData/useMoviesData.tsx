import { useState, useEffect, useMemo } from "react";
import { MoviesService } from "../../services/MoviesService";
import { Movie } from "@/types/Movies";
import { Series } from "@/types/Series";
import { SeriesService } from "@/services/SeriesService";

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

export function useSeriesDataByMovieId(movieId: string | null) {
  const [seriesInfo, setSeriesInfo] = useState<Series | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hàm để thêm seasonNumber vào movies (tương tự useSeriesDataByID)
  const addSeasonNumberToMovies = (seriesData: Series) => {
    if (!seriesData.movies || !seriesData.seriesMovies) return seriesData;

    // Tạo map để lookup seasonNumber dựa trên movieId
    const seasonMap = new Map();
    seriesData.seriesMovies.forEach(sm => {
      if (sm.movie) {
        seasonMap.set(sm.movie.id, sm.seasonNumber);
      }
    });

    // Thêm seasonNumber vào mỗi movie
    const moviesWithSeason = seriesData.movies.map(movie => ({
      ...movie,
      seasonNumber: seasonMap.get(movie.id) || null
    }));

    return {
      ...seriesData,
      movies: moviesWithSeason
    };
  };

  useEffect(() => {
    const fetchSeriesByMovieId = async () => {
      if (!movieId) {
        setSeriesInfo(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const seriesData = await SeriesService.getSeriesByMovieId(movieId);
        
        if (seriesData) {
          // Thêm seasonNumber vào movies
          const seriesWithSeasonNumbers = addSeasonNumberToMovies(seriesData);
          
          // Thêm movieCount nếu chưa có
          const seriesWithMovieCount = {
            ...seriesWithSeasonNumbers,
            movieCount: seriesWithSeasonNumbers.movies ? seriesWithSeasonNumbers.movies.length : 0,
          };

          setSeriesInfo(seriesWithMovieCount);
          console.log("Fetched series by movie ID:", seriesWithMovieCount);
          console.log("Movies in series with season numbers:", seriesWithMovieCount.movies);
        } else {
          setSeriesInfo(null);
          console.log("No series found for movie ID:", movieId);
        }
      } catch (err) {
        console.error("Error fetching series by movie ID:", err);
        setError("Lỗi khi tải thông tin series");
        setSeriesInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSeriesByMovieId();
  }, [movieId]);

  return {
    seriesInfo,
    loading,
    error,
  };
}

export function useRecommendedMovies(movieId: string) {
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchRecommendedMovies = async () => {
      if (!movieId) { 
        setRecommendedMovies([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const recommended = await MoviesService.getRecommendedMovies(movieId, 10);
        setRecommendedMovies(recommended);
        console.log("Fetched recommended movies:", recommended);
      } catch (err) {
        console.error("Error fetching recommended movies:", err);
        setError("Lỗi khi tải phim đề xuất");
        setRecommendedMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedMovies();
  }, [movieId]);

  return {
    recommendedMovies,
    loading,
    error,
  };
}