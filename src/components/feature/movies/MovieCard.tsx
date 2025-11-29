import { Movie } from "@/types/Movies";
import { getStatusLabelColor } from "@/utils/getColorUtils";
import { getStatusText } from "@/utils/getTextUtils";

export interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const goToDetails = () => {
    window.location.href = `/movie/${movie.id}`;
  }

  return (
    <div 
      className="lg:w-42 md:w-42 sm:w-[28vw] w-[40vw] text-white cursor-pointer hover:scale-105 transition-transform"
      onClick={goToDetails}
    >
      {/* Image */}
      <div 
        className="lg:w-42 md:w-42 sm:w-[28vw] w-[40vw] aspect-2/3 bg-gray-300 rounded-lg mb-3
        border-2 border-(--border-blue) shadow-[3px_3px_2px_1px_var(--shadow-red)] relative"
      >
        <img
          src={movie.posterUrl ?? "/placeholder/placeholder-poster.png"}
          onError={(e) => {
            e.currentTarget.src = "/placeholder/placeholder-poster.png"
          }}
          alt={movie.title}
          className="w-full h-full object-cover rounded-md"
        />

        {/* Season Badge */}
        {movie.seasonNumber !== null && movie.seasonNumber !== undefined && (
          <div className="absolute top-0 left-0 font-black text-center text-lg bg-(--surface)
          rounded-br-md rounded-tl-md shadow-lg)">
            <div className="text-gradient py-0.5 px-3 text-center">
              SS{movie.seasonNumber}
            </div>
          </div>
        )}

        {/* Status and ReleaseYear Badge */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-0 space-x-0 text-xs">
          {movie.status && (
            <div className={`bg-(--surface) text-white px-2 py-0.5 rounded-tl-md ${getStatusLabelColor(movie.status)}`}>
              {getStatusText(movie.status)}
            </div>
          )}
          {movie.releaseYear && (
            <div className="bg-(--surface) text-white font-semibold px-2 py-0.5 rounded-tr-md">
              {movie.releaseYear}
            </div>
          )}
        </div>
      </div>

      {/* Title and originName */}
      <div className="text-center">
        <h2 className="lg:text-[15px] md:text-[15px] sm:text-[13px] text-[13px] 
            lg:font-bold md:font-bold font-medium truncate line-clamp-1 mb-0.5">
          {movie.title}
        </h2>
        <p className="lg:text-[13px] md:text-[13px] sm:text-[11px] text-[11px] text-gray-500 truncate line-clamp-1">{movie.originalName}</p>
      </div>
    </div>
  );
}