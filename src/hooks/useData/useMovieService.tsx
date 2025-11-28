import { useMemo } from "react";
import { Movie } from "@/types/Movies";

export function useMoviesByYear(movies: Movie[]) {
  // Nhóm phim theo năm sản xuất
  const moviesByYear = useMemo(() => {
    if (!movies || movies.length === 0) return {};
    
    const grouped = movies.reduce((acc, movie) => {
      const year = movie.releaseYear || new Date().getFullYear();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(movie);
      return acc;
    }, {} as Record<number, Movie[]>);

    // Sắp xếp phim trong mỗi năm theo tên
    Object.keys(grouped).forEach(year => {
      grouped[parseInt(year)].sort((a: Movie, b: Movie) => 
        a.title.localeCompare(b.title)
      );
    });

    return grouped;
  }, [movies]);

  // Sắp xếp các năm theo thứ tự giảm dần
  const sortedYears = useMemo(() => {
    return Object.keys(moviesByYear)
      .map(year => parseInt(year))
      .sort((a, b) => b - a);
  }, [moviesByYear]);

  return { moviesByYear, sortedYears };
}

export function useMovieStats(movies: Movie[]) {
  const stats = useMemo(() => {
    if (!movies || movies.length === 0) {
      return {
        totalMovies: 0,
        uniqueYears: 0,
        earliestYear: null,
        latestYear: null
      };
    }

    const years = movies.map(movie => movie.releaseYear || new Date().getFullYear());
    const uniqueYears = [...new Set(years)];
    
    return {
      totalMovies: movies.length,
      uniqueYears: uniqueYears.length,
      earliestYear: Math.min(...years),
      latestYear: Math.max(...years)
    };
  }, [movies]);

  return stats;
}