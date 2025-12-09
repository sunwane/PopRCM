import { useState } from "react";
import { Movie } from "@/types/Movies";
import Link from "next/link";

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
  const moviesPerView = 3;
  const maxIndex = Math.max(0, movies.length - moviesPerView);

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
    <div className="mb-8">
      {/* Header */}
      <div className="relative flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className={`text-xl font-bold ${titleColor}`}>
            {title} hay nhất
          </h3>
        </div>
        
        <Link 
          href={`/genre/${genreSlug}`}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
        >
          {linkText}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Container with navigation */}
      <div className="relative">
        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-all"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-all"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Movies Grid */}
        <div className="grid grid-cols-3 gap-4">
          {visibleMovies.map((movie) => (
            <Link 
              key={movie.id} 
              href={`/movie/${movie.slug}`}
              className="group cursor-pointer"
            >
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800 border border-gray-600 hover:border-gray-400 transition-all duration-300">
                {/* Movie Image */}
                <img
                  src={movie.thumbnailUrl || movie.posterUrl || "/placeholder/placeholder-thumbnail.jpg"}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder/placeholder-thumbnail.jpg";
                  }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Movie Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h4 className="text-white font-semibold text-sm line-clamp-2 mb-1">
                    {movie.title}
                  </h4>
                  <p className="text-gray-300 text-xs">
                    {movie.originalName}
                  </p>
                </div>

                {/* Status Badge */}
                {movie.status && (
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      movie.status === 'completed' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-blue-600 text-white'
                    }`}>
                      {movie.status === 'completed' ? 'Hoàn thành' : 'Đang chiếu'}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center mt-4 gap-1">
          {Array.from({ length: Math.ceil(movies.length / moviesPerView) }).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                Math.floor(currentIndex / moviesPerView) === index
                  ? 'bg-blue-500'
                  : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}