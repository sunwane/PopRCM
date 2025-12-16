import { Movie } from "@/types/Movies";
import { getStatusLabelColor } from "@/utils/getColorUtils";
import { getStatusText } from "@/utils/getTextUtils";

export type MovieCardSize = 'small' | 'medium' | 'large';

export interface MovieCardProps {
  movie: Movie;
  size?: MovieCardSize;
  // Favorite functionality
  showFavoriteButton?: boolean;
  isFavorited?: boolean;
  onFavoriteToggle?: (movieId: string, isFavorited: boolean) => Promise<void>;
  // Progress functionality  
  showProgress?: boolean;
  progressPercent?: number; // 0-100
  currentTime?: number; // in seconds
  totalDuration?: number; // in seconds
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

export default function MovieCard({ 
  movie, 
  size = 'medium',
  showFavoriteButton = false,
  isFavorited = false,
  onFavoriteToggle,
  showProgress = false,
  progressPercent = 0,
  currentTime = 0,
  totalDuration = 0
}: MovieCardProps) {
  const config = sizeConfig[size];
  
  const goToDetails = () => {
    window.location.href = `/movie/${movie.id}`;
  }

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavoriteToggle) {
      await onFavoriteToggle(movie.id, isFavorited);
    }
  }

  // Calculate progress percentage if not provided
  const calculatedProgress = progressPercent || (totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0);

  // Format time display
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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

        {/* Favorite Button */}
        {showFavoriteButton && (
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isFavorited 
                ? 'bg-red-500/80 text-white hover:bg-red-600/80' 
                : 'bg-black/50 text-white hover:bg-black/70'
            }`}
            aria-label={isFavorited ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
          >
            {isFavorited ? (
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </button>
        )}

        {/* Season Badge */}
        {movie.seasonNumber !== null && movie.seasonNumber !== undefined && (
          <div className="absolute top-0 left-0 font-black text-center text-lg bg-(--surface)
          rounded-br-md rounded-tl-md shadow-lg)">
            <div className="text-gradient py-0.5 px-3 text-center">
              SS{movie.seasonNumber}
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {showProgress && calculatedProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm rounded-b-md">
            <div className="p-2">
              <div className="w-full bg-gray-700/70 rounded-full h-1.5 mb-1">
                <div 
                  className="bg-(--primary) h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, calculatedProgress))}%` }}
                ></div>
              </div>
              {totalDuration > 0 && (
                <div className="text-xs text-white/90 text-center font-medium">
                  {formatTime(currentTime)} / {formatTime(totalDuration)}
                </div>
              )}
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