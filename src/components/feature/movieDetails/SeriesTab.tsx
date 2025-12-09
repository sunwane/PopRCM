import { Series } from "@/types/Series";
import MovieGridLayout from "../movies/MoviesGridLayout";
import { useResponsive } from "@/hooks/useResponsive";

export interface SeriesTabProps {
  seriesInfo?: Series;
}

export function SeriesTab({ seriesInfo }: SeriesTabProps) {
  const {isMobile} = useResponsive();
  return (
    <div className="space-y-4">
      {seriesInfo && (
        <div>
          <div className="lg:text-base md:text-sm sm:text-sm text-sm flex gap-1.5 items-center">
            Loạt series: 
            <a href={`/allSeries/${seriesInfo.id}`} className="font-bold text-(--primary)">{seriesInfo.name}</a>
          </div>
          <div className="mt-3 relative">
            <img src={seriesInfo.posterUrl} alt={seriesInfo.name} 
            className="lg:max-h-96 md:max-h-72 sm:max-h-60 max-h-48 w-full object-cover rounded-xl" />
            <div className="absolute inset-0 bottom-0 left-0 bg-linear-to-t from-(--background) to-transparent rounded-b-xl"></div>
            <div className="absolute bottom-3 left-4 lg:text-xl md:text-lg sm:text-sm text-sm font-semibold">
              {seriesInfo.movieCount} phần
            </div>
          </div>

          <div className="mt-6 px-4">
            <div className="font-bold lg:text-[16px] md:text-[16px] sm:text-sm text-sm">Mô tả:</div>
            <div className="text-gray-400 leading-7 lg:text-sm md:text-sm sm:text-xs text-xs">{seriesInfo.description}</div>
          </div>

          <div className="mt-6 px-4">
            <div className="font-bold lg:text-[16px] md:text-[16px] sm:text-sm text-sm lg:mb-4 md:mb-4 sm:mb-3 mb-3">Các phần phim:</div>
            <MovieGridLayout filteredMovies={seriesInfo.movies || []} gapWidth={isMobile ? 0 : innerWidth * 1/3}/>
          </div>
        </div>
      )}
    </div>
  );
}
