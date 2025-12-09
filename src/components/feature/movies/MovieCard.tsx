import { Movie } from "@/types/Movies";
import { getStatusLabelColor } from "@/utils/getColorUtils";
import { getStatusText } from "@/utils/getTextUtils";

export type MovieCardSize = 'small' | 'medium' | 'large';

export interface MovieCardProps {
  movie: Movie;
  size?: MovieCardSize;
}

// Size configurations
const sizeConfig = {
  small: {
    container: "lg:w-38 md:w-38 sm:w-[20vw] w-[24vw]",
    image: "lg:w-38 md:w-38 sm:w-[20vw] w-[24vw]",
    title: "lg:text-[13px] md:text-[13px] sm:text-[11px] text-[11px]",
    subtitle: "lg:text-[11px] md:text-[11px] sm:text-[9px] text-[9px]",
    badge: "lg:text-xs md:text-xs sm:text-[10px] text-[8px] px-1.5 py-0.5 -bottom-0.5",
    width: 128 // px for calculation
  },
  medium: {
    container: "lg:w-42 md:w-42 sm:w-[28vw] w-[40vw]",
    image: "lg:w-42 md:w-42 sm:w-[28vw] w-[40vw]",
    title: "lg:text-[15px] md:text-[15px] sm:text-[13px] text-[13px]",
    subtitle: "lg:text-[13px] md:text-[13px] sm:text-[11px] text-[11px]",
    badge: "text-xs px-2 py-0.5 -bottom-0.5",
    width: 168 // px for calculation
  },
  large: {
    container: "lg:w-45 md:w-45 sm:w-[28vw] w-[40vw]",
    image: "lg:w-45 md:w-45 sm:w-[28vw] w-[40vw]",
    title: "lg:text-[17px] md:text-[17px] sm:text-[15px] text-[15px]",
    subtitle: "lg:text-[15px] md:text-[15px] sm:text-[13px] text-[13px]",
    badge: "text-sm px-2.5 py-1 -bottom-1",
    width: 208 // px for calculation
  }
};

// Export function to get card width for grid calculations
export const getMovieCardWidth = (size: MovieCardSize = 'medium'): number => {
  return sizeConfig[size].width;
};

export default function MovieCard({ movie, size = 'medium' }: MovieCardProps) {
  const config = sizeConfig[size];
  
  const goToDetails = () => {
    window.location.href = `/movie/${movie.id}`;
  }

  return (
    <div 
      className={`${config.container} text-white cursor-pointer hover:scale-105 transition-transform`}
      onClick={goToDetails}
    >
      {/* Image */}
      <div 
        className={`${config.image} aspect-2/3 bg-gray-300 rounded-lg mb-3
        border-2 border-(--border-blue) shadow-[3px_3px_2px_1px_var(--shadow-red)] relative`}
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
        <div className={`absolute left-1/2 transform -translate-x-1/2 flex gap-0 space-x-0 ${config.badge}`}>
          {movie.status && (
            <div className={`bg-(--surface) text-white rounded-tl-md ${config.badge} ${getStatusLabelColor(movie.status)}`}>
              {getStatusText(movie.status)}
            </div>
          )}
          {movie.releaseYear && (
            <div className={`bg-(--surface) text-white font-semibold rounded-tr-md ${config.badge}`}>
              {movie.releaseYear}
            </div>
          )}
        </div>
      </div>

      {/* Title and originName */}
      <div className="text-center">
        <h2 className={`${config.title} lg:font-bold md:font-bold font-medium truncate line-clamp-1 mb-0.5`}>
          {movie.title}
        </h2>
        <p className={`${config.subtitle} text-gray-500 truncate line-clamp-1`}>{movie.originalName}</p>
      </div>
    </div>
  );
}