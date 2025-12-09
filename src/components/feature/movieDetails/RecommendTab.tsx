import { useResponsive } from '@/hooks/useResponsive';
import MovieGridLayout from '../movies/MoviesGridLayout';

export interface RecommendTabProps {
  recommendedMovies?: any[];
}

export function RecommendTab({ recommendedMovies = [] }: RecommendTabProps) {
  const { isMobile } = useResponsive();
  return (
    <div className="mt-4 pr-2">
      <MovieGridLayout filteredMovies={recommendedMovies} gapWidth={isMobile ? 0 : innerWidth * 1/3} cardSize={'small'} />
    </div>
  );
}
