"use client";
import { useEffect, useState } from 'react';
import { useFavoritesHistoryData } from '@/hooks/useData/useFavoritesHistoryData';
import { Movie } from '@/types/Movies';
import MoviesGridLayout from '@/components/feature/movies/MoviesGridLayout';
import { LoadingEffect } from '@/components/ui/LoadingEffect';
import NotFoundDiv from '@/components/ui/NotFoundDiv';
import Message from '@/components/ui/Message';

export default function FavoriteTab() {
  const { 
    favorites, 
    favoritesLoading, 
    favoritesError,
    favoritesPagination,
    handleFavoritesPageChange,
    refreshData
  } = useFavoritesHistoryData();

  // Message state for global notifications
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle message from MovieCard with auto-refresh on successful delete
  const handleMessage = async (content: string, type: 'success' | 'error') => {
    console.log('📩 handleMessage called:', { content, type });
    setMessage({ text: content, type });
    console.log('📩 Message state updated');
    
    // Auto-refresh data after successful favorite removal
    if (type === 'success' && content.includes('xóa')) {
      console.log('🔄 Auto-refreshing data after successful delete...');
      setIsRefreshing(true);
      try {
        await refreshData();
        console.log('✅ Data refreshed successfully');
      } catch (error) {
        console.error('❌ Error refreshing data:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  // Load data on component mount
  useEffect(() => {
    console.log('🔥 FavoriteTab mounted, refreshing data...');
    refreshData();
  }, []);

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
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4 text-left">Phim yêu thích</h2>
        <NotFoundDiv message="Bạn chưa có phim yêu thích nào. <br/>Thêm phim vào danh sách yêu thích để xem lại sau!" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-0.5">Phim yêu thích</h2>
          <p className="text-gray-400">
            {favoritesPagination.totalElements} phim trong danh sách yêu thích
          </p>
        </div>
        
        <button
          onClick={refreshData}
          disabled={favoritesLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600/60 text-white rounded-lg hover:bg-blue-600/80 transition disabled:opacity-50"
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

      {/* Movies Grid */}
      <MoviesGridLayout 
        filteredMovies={favoriteMovies} 
        loading={favoritesLoading || isRefreshing}
        currentPage={favoritesPagination.currentPage}
        totalPages={favoritesPagination.totalPages}
        onPageChange={handleFavoritesPageChange}
        hasNextPage={favoritesPagination.hasNext}
        hasPrevPage={favoritesPagination.hasPrev}
        cardSize="medium"
        showFavoriteButton={true}
        inFavoritesTab={true}
        gapWidth={300}
        onMessage={handleMessage}
      />

      {/* Global Message */}
      {message && (
        <Message
          isVisible={true}
          message={message.text}
          type={message.type}
          onClose={() => setMessage(null)}
          autoClose={true}
          autoCloseDelay={3000}
          position="bottom-right"
        />
      )}
    </div>
  );
}
