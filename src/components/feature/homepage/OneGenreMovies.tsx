import { useState, useEffect } from "react";
import { Movie } from "@/types/Movies";
import Link from "next/link";
import { useResponsive } from "@/hooks/useResponsive";

export interface OneGenreMoviesProps {
  title: string;
  movies: Movie[];
  titleColor: string;
  linkText: string;
  genreSlug: string;
}

export function OneGenreMovies({ 
  title, 
  movies, 
  titleColor, 
  linkText, 
  genreSlug 
}: OneGenreMoviesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isMobile } = useResponsive();
  const moviesPerView = isMobile ? 2 : 3;
  const maxIndex = Math.max(0, movies.length - moviesPerView);

  // Reset currentIndex when responsive changes to prevent out of bounds
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(0);
    }
  }, [moviesPerView, currentIndex, maxIndex]);

  const nextSlide = () => {
    setCurrentIndex(prev => {
      const newIndex = prev + moviesPerView;
      return newIndex > maxIndex ? 0 : newIndex; // Loop back to start
    });
  };

  const prevSlide = () => {
    setCurrentIndex(prev => {
      const newIndex = prev - moviesPerView;
      return newIndex < 0 ? maxIndex : newIndex; // Loop to end
    });
  };

  const visibleMovies = movies.slice(currentIndex, currentIndex + moviesPerView);

  return (
    <div className="mb-6 flex lg:flex-row md:flex-col sm:flex-col flex-col">
      {/* Header */}
      <div className="relative flex lg:space-y-4 lg:flex-col lg:items-start lg:justify-center justify-between items-center lg:mb-6 md:mb-4 sm:mb-3 mb-2 lg:min-w-[250px]">
        <div className="flex items-center gap-2 w-fit">
          <h3 className={`flex lg:flex-col md:flex-row sm:flex-row flex-col text-nowrap space-x-1 lg:text-2xl md:text-xl sm:text-lg text-sm font-black tracking-wide ${titleColor}`}>
            <div>{title}</div> 
            {isMobile ? null : (
              <div>hay nhất</div>
            )}
          </h3>
        </div>
        
        <Link 
          href={`/genre/${genreSlug}`}
          className="lg:text-sm md:text-sm text-xs text-white hover:text-white transition-colors flex items-center lg:gap-1 md:gap-1 sm:gap-0.5 gap-0.5"
        >
          {isMobile? "Tất cả" : linkText}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Container with navigation */}
      <div className="relative">
        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          className="absolute -left-5 lg:top-1/2 md:top-1/2 sm:top-1/2 top-0 lg:-translate-y-12 md:-translate-y-12 sm:-translate-y-12 translate-y-[8vw] z-10 w-10 h-10 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-all"
        >
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute -right-5 lg:top-1/2 md:top-1/2 sm:top-1/2 top-0 lg:-translate-y-12 md:-translate-y-12 sm:-translate-y-12 translate-y-[8vw] z-10 w-10 h-10 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-all"
        >
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Movies Grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-2 lg:gap-4 md:gap-3 sm:gap-2 gap-2">
          {visibleMovies.map((movie) => (
            <Link 
              key={movie.id} 
              href={`/movie/${movie.id}`}
              className="group cursor-pointer"
            >
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-800 transition-all duration-300">
                <div className="relative w-full h-full">
                  {/* Movie Image */}
                  <img
                    src={movie.thumbnailUrl || movie.posterUrl || "/placeholder/placeholder-thumbnail.jpg"}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder/placeholder-thumbnail.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent group-hover:bg-none"></div>
                </div>
              </div>
              {/* Movie Info overlay */}
              <div className="w-full p-2.5">
                <h4 className="text-white font-semibold lg:text-sm md:text-sm sm:text-xs text-xs line-clamp-2 mb-1">
                  {movie.title}
                </h4>
                <p className="text-gray-300 lg:text-xs md:text-xs sm:text-[10px] text-[10px]">
                  {movie.originalName}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}