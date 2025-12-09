import { Movie } from "@/types/Movies";
import { getStatusText } from "@/utils/getTextUtils";
import Link from "next/link";

interface OneTopMovieProps {
  movie: Movie;
  rank: number;
}

export function OneTopMovie({ movie, rank }: OneTopMovieProps) {
  return (
    <div>
      <div className="flex items-center mb-2">
        {/* Rank Number */}
        <div className="shrink-0 w-8 h-8 rounded-lg flex items-center mr-2 z-10">
          <span className="text-white font-bold text-4xl stroke-text-hollow2">{rank}</span>
        </div>
        
        <div className="flex items-center flex-1 min-w-0 bg-gray-800 rounded-lg">
          {/* Movie Poster */}
          <Link className="shrink-0 mr-3 cursor-pointer" href={`/movie/${movie.slug}`}>
            <img 
              src={movie.posterUrl || '/placeholder/placeholder-poster.png'} 
              alt={movie.title}
              className="w-18 h-24 rounded-md object-cover shadow-md"
              onError={(e)=>{
                e.currentTarget.src = '/placeholder/placeholder-poster.png';
              }}
            />
          </Link>
        
          {/* Movie Info */}
          <div className="flex-1 min-w-0">
            <Link href={`/movie/${movie.slug}`}>
              <div className="text-white font-semibold text-sm truncate mb-1 hover:text-(--hover)" >
                {movie.title}
              </div>
            </Link>
            <div className="flex items-center text-gray-400 text-xs mb-1.5">
              {movie.originalName}
            </div>
            <div className="flex items-center text-gray-300 text-xs space-x-1.5">
              <span className="text-white font-bold">
                {getStatusText(movie.status)}
              </span>
              <span>•</span>
              <span className="font-light text-gray-200">{movie.releaseYear}</span>
              <span>•</span>
              <span className="font-light text-gray-200">{movie.duration}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}