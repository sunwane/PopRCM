import { Movie } from "@/types/Movies";
import { getMovieTypesText } from "@/utils/getTextUtils";
import { getTypeTextColor } from "@/utils/getColorUtils";

interface OneSearchDivProps {
  movie: Movie;
  onClick: () => void;
}

export default function OneSearchDiv({ movie, onClick }: OneSearchDivProps) {

  const formatDuration = (duration: string) => {
    if (!duration) return '';
    // If duration is already formatted (like "1h 55m"), return as is
    if (duration.includes('h') || duration.includes('m')) return duration;
    
    // If duration is in minutes, convert to hours and minutes
    const minutes = parseInt(duration);
    if (isNaN(minutes)) return duration;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  return (
    <div 
      className="flex items-center space-x-3 p-3 hover:bg-white/10 cursor-pointer transition-colors"
      onClick={onClick}
    >
      {/* Movie Poster */}
      <div className="shrink-0">
        <img 
          src={movie.posterUrl || '/placeholder/placeholder-poster.png'} 
          alt={movie.title}
          className="w-12 h-16 object-cover rounded"
          onError={(e) => {
            e.currentTarget.src = '/placeholder/placeholder-poster.png';
          }}
        />
      </div>
      
      {/* Movie Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-medium text-sm truncate">
          {movie.title}
        </h3>
        <p className="text-gray-400 text-xs truncate mt-1">
          {movie.originalName}
        </p>
        
        {/* Movie Details */}
        <div className="flex items-center space-x-2 text-gray-500 text-xs mt-1">
          {movie.type && movie.type.length > 0 && (
            <span className={`px-1.5 py-0.5 bg-gray-700 rounded text-xs font-black tracking-wide ${getTypeTextColor(movie.type)}`}>
              {getMovieTypesText(movie.type)}
            </span>
          )}
          {movie.releaseYear && (
            <>
              <span>•</span>
              <span>{movie.releaseYear}</span>
            </>
          )}
          {movie.duration && (
            <>
              <span>•</span>
              <span>{formatDuration(movie.duration)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}