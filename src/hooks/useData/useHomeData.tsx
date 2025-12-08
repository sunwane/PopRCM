import { useState, useEffect } from 'react';
import { Movie } from '@/types/Movies';
import { MoviesService } from '@/services/MoviesService';

export interface HomeData {
  heroMovies: Movie[];
  isLoading: boolean;
  error: string | null;
}

export function useHomeData(movieId?: string): HomeData {
  const [heroMovies, setHeroMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Lấy top 5 phim phổ biến làm hero movies
        const popularMovies = await MoviesService.getPopularMoviesOfWeek(7);
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
