import { useResponsive } from '@/hooks/useResponsive';
import MovieGridLayout from '../movies/MoviesGridLayout';

export interface RecommendTabProps {
  movieInfo: any;
  recommendedMovies?: any[];
}

export function RecommendTab({ movieInfo, recommendedMovies = [] }: RecommendTabProps) {
  const { isMobile } = useResponsive();
  return (
    <div className="mt-4">
      <MovieGridLayout filteredMovies={recommendedMovies} gapWidth={isMobile ? 0 : innerWidth * 1/3} />
    </div>
  );
}
