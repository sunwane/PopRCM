import { Movie } from "@/types/Movies";
import { getStatusLabelColor } from "@/utils/getColorUtils";
import { getStatusText } from "@/utils/getTextUtils";
import { useFavoritesHistoryData } from "@/hooks/useData/useFavoritesHistoryData";
import { useState } from "react";

export type MovieCardSize = 'small' | 'medium' | 'large';

export interface MovieCardProps {
  movie: Movie;
  size?: MovieCardSize;
  // Favorite functionality
  showFavoriteButton?: boolean;
  // Progress functionality  
  showProgress?: boolean;
  progressPercent?: number; // 0-100
  currentTime?: number; // in seconds
  totalDuration?: number; // in seconds
  // For favorites tab - shows delete icon instead of heart
  inFavoritesTab?: boolean;
  // Episode information for history tab
  inHistoryTab?: boolean;
  episodeId?: string;
  episodeNumber?: number;
  // Message callback
  onMessage?: (content: string, type: 'success' | 'error') => void;
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
  showProgress = false,
  progressPercent = 0,
  currentTime = 0,
  totalDuration = 0,
  inFavoritesTab = false,
  inHistoryTab = false,
  episodeId,
  episodeNumber,
  onMessage
}: MovieCardProps) {
  const config = sizeConfig[size];
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Use favorites hook
  const { addFavorite, removeFavorite, isFavorited } = useFavoritesHistoryData();
  const isCurrentlyFavorited = isFavorited(movie.id);
  
  const goToDetails = () => {
    // If in history tab and has episode info, go to episode watch page
    if (inHistoryTab && episodeId) {
      window.location.href = `/watch/${episodeId}?movieId=${movie.id}`;
    } else {
      // Default behavior: go to movie details page
      window.location.href = `/movie/${movie.id}`;
    }
  }

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn sự kiện click lan truyền lên thẻ cha
    e.preventDefault(); // Ngăn các hành động mặc định

    if (isProcessing) return;
    setIsProcessing(true);

    try {
      if (inFavoritesTab || isCurrentlyFavorited) {
        const success = await removeFavorite(movie.id);
        if (success) {
          onMessage?.('Đã xóa phim khỏi danh sách yêu thích', 'success');
        } else {
          onMessage?.('Có lỗi xảy ra khi xóa phim khỏi yêu thích', 'error');
        }
      } else {
        const success = await addFavorite(movie.id);
        if (success) {
          onMessage?.('Đã thêm phim vào danh sách yêu thích', 'success');
        } else {
          onMessage?.('Có lỗi xảy ra khi thêm phim vào yêu thích', 'error');
        }
      }
    } catch (error) {
      console.error('Error handling favorite:', error);
      onMessage?.('Có lỗi xảy ra khi xử lý yêu thích', 'error');
    } finally {
      setIsProcessing(false);
    }
  }

  const handleButtonMouseEnter = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn hover effect lan truyền
  }

  const handleButtonMouseLeave = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn hover effect lan truyền
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
      className={`${config.container} group text-white cursor-pointer hover:scale-105 transition-transform`}
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
          className="w-full h-full object-cover rounded-md group-hover:brightness-120 transition duration-200"
        />

        {/* Favorite/Delete Button */}
        {showFavoriteButton && (
          <button
            onClick={handleFavoriteClick}
            onMouseEnter={handleButtonMouseEnter}
            onMouseLeave={handleButtonMouseLeave}
            disabled={isProcessing}
            className={`absolute top-2 right-2 p-1.5 transition-all duration-200 disabled:opacity-50 z-10 ${
              inFavoritesTab 
                ? 'rounded bg-red-500/80 text-white hover:bg-red-600/80' 
                : isCurrentlyFavorited
                ? 'rounded-full bg-red-500/80 text-white hover:bg-red-600/80'
                : 'rounded-full bg-black/50 text-white hover:bg-black/70'
            } backdrop-blur-sm`}
            aria-label={
              inFavoritesTab 
                ? "Xóa khỏi yêu thích" 
                : isCurrentlyFavorited 
                ? "Xóa khỏi yêu thích" 
                : "Thêm vào yêu thích"
            }
          >
            {isProcessing ? (
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : inFavoritesTab ? (
              // Trash icon for favorites tab
              <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
              </svg>
            ) : isCurrentlyFavorited ? (
              // Heart filled for favorited items
              <img src="/icons/HeartHover.png" alt="Favorited" className="w-4 h-4" />
            ) : (
              // Heart outline for non-favorited items
              <img src="/icons/Heart.png" alt="Add to favorites" className="w-4 h-4" />
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

      {/* Progress Bar */}
      {showProgress && calculatedProgress > 0 && (
        <div className="pb-0.5">
          <div className="w-full bg-gray-700/70 rounded-full h-1.5 mb-0.5">
            <div 
              className="bg-(--primary) h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, calculatedProgress))}%` }}
            ></div>
          </div>
          <div className="flex items-center gap-2 justify-center">
            {inHistoryTab && episodeNumber && (
              <div className={`text-xs text-gray-500 font-medium`}>
                Tập {episodeNumber}
              </div>
            )}
            <div className="text-gray-300 mb-0.5">•</div>
            {totalDuration > 0 && (
              <div className="text-xs text-white/50 text-center font-medium">
                {formatTime(currentTime)} / {formatTime(totalDuration)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Title and originName */}
      <div className="text-center">
        <h2 className={`${config.title} lg:font-bold md:font-bold font-medium truncate line-clamp-1 mb-0.5`}>
          {movie.title}
        </h2>
        <p className={`${config.subtitle} text-gray-500 truncate line-clamp-1 ${inHistoryTab && episodeNumber ? 'mb-1' : ''}`}>
          {movie.originalName}
        </p>
      </div>
    </div>
  );
}