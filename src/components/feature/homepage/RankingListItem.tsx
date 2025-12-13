import { Movie } from "@/types/Movies";
import Link from "next/link";

export interface RankingListItemProps {
  movie: Movie;
  index: number;
  variant?: 'compact' | 'detailed';
}

export function RankingListItem({ 
  movie, 
  index, 
  variant = 'compact' 
}: RankingListItemProps) {
  const isTopThree = index < 3;
  
  if (variant === 'detailed') {
    return (
      <Link 
        href={`/movie/${movie.id}`}
        className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
      >
        {/* Rank Number */}
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg ${
          isTopThree ? 'text-hot' : 'text-gray-600'
        }`}>
          {index + 1}
        </div>

        {/* Movie Poster */}
        <img
          src={movie.posterUrl || '/placeholder/placeholder-poster.png'}
          alt={movie.title}
          className="w-12 h-16 rounded object-cover"
          onError={(e)=> {
            e.currentTarget.src = '/placeholder/placeholder-poster.png'
          }}
        />

        {/* Movie Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-semibold text-sm truncate">
            {movie.title}
          </h4>
          <p className="text-gray-400 text-xs truncate">
            {movie.originalName}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-yellow-400 text-xs">{movie.releaseYear}</span>
            <span className="text-gray-500 text-xs">•</span>
            <span className="text-blue-400 text-xs">{movie.view} lượt xem</span>
          </div>
        </div>
      </Link>
    );
  }

  // Compact variant (default)
  return (
    <Link 
      href={`/movie/${movie.id}`}
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group"
    >
      {/* Rank Number */}
      <div className={`w-6 h-6 rounded flex items-center justify-center font-black text-xl ${
        isTopThree 
          ? 'text-hot' : 'text-gray-500'
      }`}>
        {index + 1}
      </div>

      {/* Movie Poster */}
      <img
        src={movie.posterUrl || '/placeholder/placeholder-poster.jpg'}
        alt={movie.title}
        className="w-8 h-12 rounded object-cover"
        onError={(e)=> {
          e.currentTarget.src = '/placeholder/placeholder-poster.png'
        }}
      />

      {/* Movie Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-medium text-sm truncate group-hover:text-blue-300 transition-colors">
          {movie.title}
        </h4>
        <p className="text-gray-400 text-xs truncate">
          {movie.originalName}
        </p>
      </div>
    </Link>
  );
}