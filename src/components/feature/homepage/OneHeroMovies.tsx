import { Movie } from '@/types/Movies';
import { Genre } from '@/types/Genres';
import { getMovieTypesText } from '@/utils/getTextUtils';
import { useState } from "react";
import { useRouter } from 'next/navigation';

interface OneHeroMoviesProps {
  movie: Movie;
  isActive: boolean;
}

export default function OneHeroMovies({ movie, isActive }: OneHeroMoviesProps) {
  const [isFavHover, setFavHover] = useState(false);
  const [isInfoHover, setInfoHover] = useState(false);

  const route = useRouter();

  if (!isActive) return null;

  return (
    <div className="relative w-full aspect-video max-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={movie.thumbnailUrl || '/placeholder/placeholder-thumbnail.jpg'}
          alt={movie.title}
          className="lg:w-[90vw] md:w-[90vw] sm:w-full w-full h-auto aspect-video max-h-screen object-cover object-center absolute right-0"
          onError={(e)=>{
            e.currentTarget.src = '/placeholder/placeholder-thumbnail.jpg'
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_70%_40%,transparent_0%,#0B112000_50%,#0B1120FF_100%)]"></div>
      </div>

      {/* Content */}
      <div className="absolute left-0 bottom-4 z-10 px-4 sm:px-6 lg:px-8 pb-8 lg:max-w-[40vw] md:max-w-[50vw] sm:max-w-screen">
        {/* Title */}
        <h1 className="text-2xl sm:text-2xl lg:text-4xl font-extrabold tracking-wider text-white mb-1.5 text-shadow-lg">
          {movie.title}
        </h1>
        
        <p className="text-(--text-highlight) text-sm sm:text-sm lg:text-lg md:text-lg mb-4">
          {movie.originalName}
        </p>

        {/* Movie Info */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300 mb-2.5">
          <div className='flex items-center space-x-2'>
            {movie.tmdbScore && (
              <div className="flex items-center space-x-1.5 border-2 border-blue-500 bg-blue-500/30 text-white px-2.5 py-1.5 rounded-lg">
                <div className="font-bold lg:text-xs md:text-xs text-[10px] text-blue-500">TMDB</div> 
                <div className="font-bold lg:text-[13px] md:text-[13px] text-[11px]">
                  {movie.tmdbScore.toFixed(1)}
                </div>
              </div>
            )}
            {movie.imdbScore && (
              <div className="flex items-center space-x-1.5 border-2 border-yellow-500 bg-yellow-500/30 text-white px-2.5 py-1.5 rounded-lg">
                <div className="font-bold lg:text-xs md:text-xs text-[10px] text-yellow-500">TMDB</div> 
                <div className="font-bold lg:text-[13px] md:text-[13px] text-[11px]">
                  {movie.imdbScore.toFixed(1)}
                </div>
              </div>
            )}
            <div className="bg-(--primary) px-2.5 py-1.5 border-2 border-(--primary) rounded-lg font-bold tracking-wide text-black lg:text-[13px] md:text-[13px] text-[11px]">
              {getMovieTypesText(movie.type)}
            </div>
          </div>
          <span>•</span>
          <span>{movie.releaseYear}</span>
          {movie.duration && 
            <div className='flex items-center space-x-3'>
              <span>|</span>
              <span>{movie.duration}</span>
            </div>
          }
        </div>

        {/* Genres */}
        <div className="flex flex-wrap gap-2 mb-4">
            {movie.genres && movie.genres.map((genre: Genre) => (
            <div 
              key={genre.id}
              className="bg-white/20 px-3 py-2 rounded-lg lg:text-sm md:text-sm sm:text-xs text-xs"
            >
              {genre.genresName}
            </div>
            ))}
        </div>

        {/* Description */}
        <p className="text-gray-300 text-xs sm:text-xs lg:text-sm md:text-sm leading-relaxed mb-4 line-clamp-3">
          {movie.description}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-7">
          <button className="flex items-center gap-2 bg-linear-to-tr from-(--gradient-primary-start) to-(--gradient-primary-end)
            hover:bg-linear-to-tr hover:from-blue-600 hover:to-blue-400
          text-white px-6 py-6 rounded-full font-semibold transition-colors cursor-pointer">
            <img src="/icons/Play.png" alt="play" className="w-7 h-7" />
          </button>

          {/* Group 2 nút bo tròn, border, chia đôi */}
          <div className="flex items-center rounded-3xl border-2 border-gray-500 overflow-hidden bg-transparent h-fit">
            <button 
              className="px-5 py-3.5 text-gray-300 border-r-2 border-gray-500"
              onMouseEnter={() => setFavHover(true)}
              onMouseLeave={() => setFavHover(false)}
            >
              <img src={isFavHover? "/icons/HeartHover.png" : "/icons/Heart.png"} alt="favorite" className={`w-7 h-7 ${isFavHover? "" : "opacity-75"}`} />
            </button>
            <button className="px-5 py-3.5 text-gray-300"
              onMouseEnter={() => setInfoHover(true)}
              onMouseLeave={() => setInfoHover(false)}
              onClick={() => {
                route.push('/movie/' + movie.id);
              }}
            >
              <img src={isInfoHover? "/icons/InfoHover.png" : "/icons/Info.png"} alt="favorite" className={`w-7 h-7 ${isInfoHover? "" : "opacity-75"}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
