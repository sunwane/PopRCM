import { useState, useEffect } from 'react';
import { Movie } from '@/types/Movies';
import { Genre } from '@/types/Genres';
import { getMovieTypesText } from '@/utils/getTextUtils';
import { useRouter } from 'next/navigation';
import { useFavoriteHandler } from '@/hooks/useFavoriteHandler';
import Message from '@/components/ui/Message';

interface ListAnimeHeroMoviesProps {
  animeMovies: Movie[];
  isLoading?: boolean;
  // Props for favorite functionality (optional to maintain backward compatibility)
  isProcessing?: boolean;
  isFavorited?: (movieId: string) => boolean;
  onFavoriteToggle?: (movieId: string) => Promise<void>;
}

export default function ListAnimeHeroMovies({ 
  animeMovies, 
  isLoading,
  isProcessing: parentIsProcessing,
  isFavorited: parentIsFavorited,
  onFavoriteToggle: parentOnFavoriteToggle
}: ListAnimeHeroMoviesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const [isFavHover, setFavHover] = useState(false);
  const [isInfoHover, setInfoHover] = useState(false);

  const route = useRouter();
  
  // Use favorite handler hook as fallback if parent doesn't provide handlers
  const { isProcessing: hookIsProcessing, message, isFavorited: hookIsFavorited, handleFavoriteToggle: hookHandleFavoriteToggle, clearMessage } = useFavoriteHandler();

  // Use parent handlers if available, otherwise fall back to hook
  const isProcessing = parentIsProcessing ?? hookIsProcessing;
  const isFavorited = parentIsFavorited ?? hookIsFavorited;
  const handleFavoriteToggle = parentOnFavoriteToggle ?? hookHandleFavoriteToggle;

  useEffect(() => {
    if (!isAutoPlay || animeMovies.length <= 1) return;
    const interval = setInterval(() => {
      if (message) clearMessage();
      setCurrentIndex((prev) => (prev + 1) % animeMovies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isAutoPlay, animeMovies.length, message, clearMessage]);

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
    if (message) clearMessage();
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  if (isLoading) {
    return (
      <div className="relative w-full h-[420px] bg-gray-900 flex items-center justify-center">
        <span className="text-white">Đang tải...</span>
      </div>
    );
  }

  if (!animeMovies || animeMovies.length === 0) {
    return (
      <div className="relative w-full h-[420px] bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Không có anime để hiển thị</p>
      </div>
    );
  }

  const movie = animeMovies[currentIndex];

  return (
    <div className='pb-12'>
      <div className="relative w-full">
        {/* Hero block */}
        <div className="relative w-full h-[500px] rounded-3xl overflow-hidden bg-(--surface)">
          {/* Big Background Image */}
          <div className="absolute inset-0 h-full z-0">
            <img
              src={movie.thumbnailUrl || movie.posterUrl || '/placeholder/placeholder-thumbnail.jpg'}
              alt={movie.title}
              className="lg:w-[60vw] md:w-[60vw] sm:w-full w-full h-full aspect-video max-h-screen object-cover object-center absolute right-0"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_100%_at_100%_40%,transparent_0%,#23345800_50%,#233458FF_100%)]"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col lg:flex-row h-full p-8 px-10 text-gray-300">
            {/* Left: Info */}
            <div className="flex-1 flex flex-col justify-center max-w-[520px]">
              <h2 className="text-white text-xl lg:text-3xl font-extrabold mb-2 line-clamp-3">{movie.title}</h2>
              <div className="text-blue-200 text-base mb-4 line-clamp-1">{movie.originalName}</div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
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
                    className="bg-white/20 text-white px-3 py-2 rounded-lg lg:text-sm md:text-sm sm:text-xs text-xs"
                  >
                    {genre.genresName}
                  </div>
                  ))}
              </div>
              <div className="text-gray-300 text-sm mb-5 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: movie.description || "Không có mô tả cho anime này." }}></div>
              <div className="flex items-center gap-6">
                <button
                  className="flex items-center gap-2 bg-linear-to-tr from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-5 py-5 rounded-full font-semibold transition-colors"
                  onClick={() => {
                    if (movie.episodes && movie.episodes.length > 0 && movie.episodes[0]?.id) {
                      route.push(`/watch/${movie.episodes[0].id}?movieId=${movie.id}`);
                    }
                  }}
                >
                  <img src="/icons/Play.png" alt="play" className="w-7 h-7" />
                </button>
                {/* Group 2 nút bo tròn, border, chia đôi */}
                <div className="flex items-center rounded-3xl border-2 border-gray-500 overflow-hidden bg-transparent h-fit">
                  <button 
                    className="px-5 py-3.5 text-gray-300 border-r-2 border-gray-500 disabled:opacity-50"
                    onMouseEnter={() => setFavHover(true)}
                    onMouseLeave={() => setFavHover(false)}
                    onClick={() => handleFavoriteToggle(movie.id)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <svg className="w-7 h-7 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <img 
                        src={
                          isFavorited(movie.id) 
                            ? "/icons/HeartHover.png" 
                            : isFavHover 
                            ? "/icons/HeartHover.png" 
                            : "/icons/Heart.png"
                        } 
                        alt="favorite" 
                        className={`w-7 h-7 ${(isFavHover || isFavorited(movie.id)) ? "" : "opacity-75"}`} 
                      />
                    )}
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
        </div>
        {/* Thumbnails: đặt ngoài hero, dùng absolute và z-20 */}
        <div className="absolute left-0 right-0 -mt-10 flex justify-center gap-2 z-20 pointer-events-none">
          {animeMovies.map((m, idx) => (
            <button
              key={m.id}
              onClick={() => handleThumbnailClick(idx)}
              className={`relative w-14 h-20 rounded-lg overflow-hidden transition-all duration-300 pointer-events-auto ${
                idx === currentIndex 
                  ? 'ring-2 ring-white scale-110' 
                  : 'opacity-70 hover:opacity-100 hover:scale-105'
              }`}
            >
              <img
                src={m.posterUrl || '/placeholder/placeholder-poster.png'}
                alt={m.title}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>

        {/* Message component - only show if using internal hook (no parent handlers) */}
        {!parentOnFavoriteToggle && message && (
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
    </div>
  );
}