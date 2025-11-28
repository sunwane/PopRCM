import { Movie } from "@/types/Movies";
import MovieGridLayout from "./MoviesGridLayout";
import NotFoundDiv from "@/components/ui/NotFoundDiv";
import { useResponsive } from "@/hooks/useResponsive";

interface MoviesByYearProps {
  moviesByYear: Record<number, Movie[]>;
  sortedYears: number[];
}

export default function MoviesByYear({ moviesByYear, sortedYears }: MoviesByYearProps) {
  const { isMobile } = useResponsive();

  if (sortedYears.length === 0) {
    return (
      <div className="max-w-[2000px]">
        <NotFoundDiv message="Không tìm thấy phim nào." />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {!isMobile && 
        sortedYears.map(year => (
          <div key={year} className="flex items-start space-x-1">
            <div className="w-3 h-3 bg-blue-700 -ml-8 rounded-2xl" />
            <div className="flex mt-6">
              <h2 className="text-3xl font-semibold rotate-270 stroke-text-hollow2 -mx-5">
                {year}
              </h2>
            </div>
            <MovieGridLayout filteredMovies={moviesByYear[year]} fullWidth={false} loading={false} />
          </div>
        ))
      }
      {isMobile &&
        sortedYears.map(year => (
        <div key={year} className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="bg-linear-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg text-lg font-bold min-w-[90px] text-center shadow-lg">
              {year}
            </div>
            <div className="flex-1 h-0.5 bg-linear-to-r from-gray-600 to-transparent"></div>
            <div className="text-sm text-gray-400 font-medium">
              {moviesByYear[year].length} phim
            </div>
          </div>
          
          <MovieGridLayout filteredMovies={moviesByYear[year]} fullWidth={true} loading={false} />
        </div>
      ))}
      
    </div>
  );
}