import { useSeriesDataByMovieId } from "@/hooks/useData/useMoviesData";
import { Movie } from "@/types/Movies";

export interface EpisodesTabProps {
  movieInfo: Movie;
}

export function EpisodesTab({ movieInfo }: EpisodesTabProps) {
  const {seriesInfo, loading} = useSeriesDataByMovieId(movieInfo.id);

  return (
    <div className="space-y-4">
      {seriesInfo && (
        <div>
          <div className="lg:text-lg md:text-[16px] sm:text-sm text-sm flex gap-1.5 items-center font-light">
            Loạt series: 
            <div className="font-bold text-(--primary)">{seriesInfo.name}</div>
          </div>
          <div className="mt-3 relative">
            <img src={seriesInfo.posterUrl} alt={seriesInfo.name} 
            className="lg:max-h-128 md:max-h-96 sm:max-h-72 max-h-60 w-full object-cover rounded-xl" />
            <div className="absolute inset-0 bottom-0 left-0 bg-linear-to-t from-(--background) to-transparent rounded-b-xl"></div>
            <div className="absolute bottom-4 left-4 lg:text-xl md:text-lg sm:text-sm text-sm font-semibold">
              {seriesInfo.movieCount} phần
              <div className="flex items-center text-(--hover) font-medium lg:text-sm md:text-xs sm:text-xs text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" className="inline-block lg:w-4 lg:h-4 md:w-3 md:h-3 sm:w-3 sm:h-3 w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} fill="none" />
                  <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                  <circle cx="12" cy="8" r="1" fill="currentColor" />
                </svg>
                <div>Mẹo: Thay đổi giá trị dropdown bên dưới để chuyển tiếp linh hoạt giữa các phần</div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div>

      </div>
    </div>
  );
}
