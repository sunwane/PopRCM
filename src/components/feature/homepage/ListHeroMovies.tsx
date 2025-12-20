'use client';

import { useState, useEffect } from 'react';
import { Movie } from '@/types/Movies';
import OneHeroMovies from './OneHeroMovies';
import { LoadingEffect } from '@/components/ui/LoadingEffect';
import { useFavoriteHandler } from '@/hooks/useFavoriteHandler';
import Message from '@/components/ui/Message';

interface ListHeroMoviesProps {
  heroMovies: Movie[];
  isLoading?: boolean;
}

export default function ListHeroMovies({ heroMovies, isLoading }: ListHeroMoviesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Use favorite handler hook at parent level
  const { isProcessing, message, isFavorited, handleFavoriteToggle, clearMessage } = useFavoriteHandler();

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay || heroMovies.length <= 1) return;

    const interval = setInterval(() => {
      // Clear message before changing slide
      if (message) {
        clearMessage();
      }
      setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isAutoPlay, heroMovies.length, message, clearMessage]);

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false); // Tạm dừng auto-play khi user click
    
    // Clear message when manually changing slide
    if (message) {
      clearMessage();
    }
    
    // Bật lại auto-play sau 10 giây
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  if (isLoading) {
    return (
      <div className="relative w-full h-screen bg-gray-900">
        <LoadingEffect />
      </div>
    );
  }

  if (!heroMovies || heroMovies.length === 0) {
    return (
      <div className="relative w-full h-[600px] bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Không có phim để hiển thị</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-auto max-h-screen aspect-video overflow-hidden">
      {/* Main Hero Movie Display */}
      {heroMovies.map((movie, index) => (
        <OneHeroMovies
          key={movie.id}
          movie={movie}
          isActive={index === currentIndex}
          // Pass favorite handlers to child component
          isProcessing={isProcessing}
          isFavorited={isFavorited}
          onFavoriteToggle={handleFavoriteToggle}
        />
      ))}

      {/* Thumbnail Grid (Right Side) */}
      <div className="absolute right-8 bottom-12 flex gap-4 z-20">
        {heroMovies.map((movie, index) => (
          <button
            key={movie.id}
            onClick={() => handleThumbnailClick(index)}
            className={`relative w-12 h-18 rounded-lg overflow-hidden transition-all duration-300 ${
              index === currentIndex 
                ? 'ring-2 ring-white scale-110' 
                : 'opacity-70 hover:opacity-100 hover:scale-105'
            }`}
          >
            <img
              src={movie.posterUrl || '/placeholder/placeholder-poster.png'}
              alt={movie.title}
              className="object-cover"
              onError={(e)=>{
                e.currentTarget.src = '/placeholder/placeholder-poster.png'
              }}
            />
          </button>
        ))}
      </div>

      {/* Global Message Component */}
      {message && (
        <Message
          isVisible={true}
          message={message.text}
          type={message.type}
          onClose={clearMessage}
          autoClose={true}
          autoCloseDelay={3000}
          position="bottom-right"
        />
      )}

    </div>
  );
}