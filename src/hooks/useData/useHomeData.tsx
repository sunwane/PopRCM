import { useState, useEffect } from 'react';
import { Movie } from '@/types/Movies';
import { Series } from '@/types/Series';
import { MoviesService } from '@/services/MoviesService';
import { SeriesService } from '@/services/SeriesService';

export interface RankingData {
  topViewed: Movie[];
  topFavorites: Movie[];
  topComments: Movie[];
}

export interface HomeData {
  heroMovies: Movie[];
  isLoading: boolean;
  error: string | null;
}

export function useHeroData(movieId?: string): HomeData {
  const [heroMovies, setHeroMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Lấy top 5 phim phổ biến làm hero movies
        const popularMovies = await MoviesService.getMostViewedMoviesOfWeek(7);
        setHeroMovies(popularMovies);
        
      } catch (err) {
        console.error('Error fetching home data:', err);
        setError('Không thể tải dữ liệu trang chủ');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, [movieId]);

  return {
    heroMovies,
    isLoading,
    error
  };
}

export function useTopViewedMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchTopViewedMovies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const topViewedMovies = await MoviesService.getMostViewedMoviesOfWeek(10);
        setMovies(topViewedMovies);
      }
      catch (err) {
        console.error('Error fetching top viewed movies of the week:', err);
        setError('Không thể tải danh sách phim được xem nhiều nhất trong tuần');
      }
      finally {
        setIsLoading(false);
      }
    };

    fetchTopViewedMovies();
  }, []);

  return {
    movies,
    isLoading,
    error
  };
}

export function usePopularSeries() {
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchPopularSeries = async () => {
      try {
        setLoading(true);
        setError(null);
        const popularSeries = await SeriesService.getAllSeries();
        setSeriesList(popularSeries.slice(0, 6));
      }
      catch (err) {
        console.error('Error fetching popular series:', err);
        setError('Không thể tải danh sách series phổ biến');
      }
      finally {
        setLoading(false);
      }
    };

    fetchPopularSeries();
  }, []);

  return {
    seriesList,
    loading,
    error
  };
}

export function useMoviesFromGenreById(genreId: string, limit: number = 9) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchMoviesFromGenre = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const moviesFromGenre = await MoviesService.getMoviesFromGenreSlug(genreId, limit);
        console.log('Fetched movies from genre:', moviesFromGenre);
        setMovies(moviesFromGenre);
      }
      catch (err) {
        console.error('Error fetching movies from genre:', err);
        setError('Không thể tải danh sách phim từ thể loại');
      }
      finally {
        setIsLoading(false);
      }
    };

    fetchMoviesFromGenre();
  }, [genreId]);

  return {
    movies,
    isLoading,
    error
  };
}

export function useRankingsData() {
  const [rankings, setRankings] = useState<RankingData>({
    topViewed: [],
    topFavorites: [],
    topComments: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const moviesService = new MoviesService();
        
        const [topViewed, topFavorites, topComments] = await Promise.all([
          MoviesService.getTopViewedMoviesRanking(),
          MoviesService.getTopFavoritesMoviesRanking(),
          MoviesService.getTopCommentsMoviesRanking()
        ]);
        
        setRankings({
          topViewed,
          topFavorites,
          topComments
        });
      } catch (err) {
        console.error('Error fetching rankings:', err);
        setError('Không thể tải dữ liệu bảng xếp hạng');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRankings();
  }, []);

  return {
    rankings,
    isLoading,
    error
  };
}
