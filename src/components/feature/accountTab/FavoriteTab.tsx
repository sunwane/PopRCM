"use client";
import { useEffect } from 'react';
import { useFavoritesHistoryData } from '@/hooks/useData/useFavoritesHistoryData';
import { Movie } from '@/types/Movies';
import MovieCard from '@/components/feature/movies/MovieCard';
import MoviesGridLayout from '@/components/feature/movies/MoviesGridLayout';
import { LoadingEffect } from '@/components/ui/LoadingEffect';
import NotFoundDiv from '@/components/ui/NotFoundDiv';

export default function FavoriteTab() {
  const { 
    favorites, 
    favoritesLoading, 
    favoritesError,
    favoritesPagination,
    removeFavorite,
    loadMoreFavorites,
    refreshData
  } = useFavoritesHistoryData();

  // Load data on component mount
  useEffect(() => {
    refreshData();
  }, []);

  // Handle favorite toggle (remove from favorites)
  const handleFavoriteToggle = async (movieId: string, isFavorited: boolean) => {
    if (isFavorited) {
      const success = await removeFavorite(movieId);
      if (!success) {
        // Handle error - could show toast notification
        console.error('Failed to remove favorite');
      }
    }
  };

  // Convert Favorites to Movie array for grid display
  const favoriteMovies: Movie[] = favorites.map(fav => fav.movie);

  if (favoritesLoading && favorites.length === 0) {
    return <LoadingEffect message="Đang tải phim yêu thích..." />;
  }

  if (favoritesError && favorites.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-red-400 mb-4">Lỗi: {favoritesError}</div>
        <button 
          onClick={refreshData}
          className="px-4 py-2 bg-(--primary) text-white rounded-lg hover:bg-(--primary)/80 transition"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <img 
            src="/icons/Heart.png" 
            alt="No favorites" 
            className="w-16 h-16 mx-auto opacity-50 mb-4"
          />
        </div>
        <NotFoundDiv message="Bạn chưa có phim yêu thích nào." />
        <p className="text-gray-400 mt-2">
          Thêm phim vào danh sách yêu thích để xem lại sau!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Phim yêu thích</h2>
          <p className="text-gray-400">
            {favoritesPagination.totalElements} phim trong danh sách yêu thích
          </p>
        </div>
        
        <button
          onClick={refreshData}
          disabled={favoritesLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-(--surface) text-white rounded-lg hover:bg-(--primary)/20 transition disabled:opacity-50"
        >
          <svg className={`w-4 h-4 ${favoritesLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Làm mới</span>
        </button>
      </div>

      {/* Error display if any */}
      {favoritesError && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-400">
          {favoritesError}
        </div>
      )}

      {/* Movies Grid with Custom MovieCard */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(168px,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(168px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(168px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(28vw,1fr))] gap-4 gap-y-6 justify-items-center">
        {favoriteMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            size="medium"
            showFavoriteButton={true}
            isFavorited={true}
            onFavoriteToggle={handleFavoriteToggle}
          />
        ))}
      </div>

      {/* Load More Button */}
      {favoritesPagination.hasNext && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMoreFavorites}
            disabled={favoritesLoading}
            className="px-6 py-3 bg-(--primary) text-white rounded-lg hover:bg-(--primary)/80 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {favoritesLoading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Đang tải...</span>
              </>
            ) : (
              <>
                <span>Xem thêm</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}

      {/* Footer info */}
      {!favoritesPagination.hasNext && favoriteMovies.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          Đã hiển thị tất cả {favoritesPagination.totalElements} phim yêu thích
        </div>
      )}
    </div>
  );
}
