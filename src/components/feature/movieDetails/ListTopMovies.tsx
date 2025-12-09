import { useTopViewedMovies } from "@/hooks/useData/useHomeData";
import { OneTopMovie } from "./OneTopMovie";
import { LoadingEffect } from "@/components/ui/LoadingEffect";

export function ListTopMovies() {
  const { movies, isLoading, error } = useTopViewedMovies();

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex items-center mb-4">
        <img 
          src="/icons/Ranking.png" 
          alt="Top Movies Placeholder"
          className="w-6 h-6 rounded-lg shadow-md" 
        />
        <div className="ml-2 font-bold text-white lg:text-base md:text-base sm:text-sm text-sm">
          Top lượt xem tháng
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-4">
          <LoadingEffect />
        </div>
      ) : (
        <div className="space-y-1">
          {movies.map((movie, index) => (
            <OneTopMovie 
              key={movie.id} 
              movie={movie} 
              rank={index + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}