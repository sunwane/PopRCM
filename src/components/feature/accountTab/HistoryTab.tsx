"use client";
"use client";
import { useEffect, useState } from 'react';
import { useFavoritesHistoryData } from '@/hooks/useData/useFavoritesHistoryData';
import { Movie } from '@/types/Movies';
import MoviesGridLayout from '@/components/feature/movies/MoviesGridLayout';
import { LoadingEffect } from '@/components/ui/LoadingEffect';
import NotFoundDiv from '@/components/ui/NotFoundDiv';
import Message from '@/components/ui/Message';

export default function HistoryTab() {
  const { 
    watchHistory, 
    historyLoading, 
    historyError,
    historyPagination,
    handleHistoryPageChange,
    refreshData
  } = useFavoritesHistoryData();

  // Message state for global notifications
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Handle message from MovieCard
  const handleMessage = (content: string, type: 'success' | 'error') => {
    setMessage({ text: content, type });
  };

  // Load data on component mount
  useEffect(() => {
    refreshData();
  }, []);

  // Convert WatchHistory to Movie data with progress info
  const historyMovies: Movie[] = watchHistory.map(history => {
    // Create a mock movie from episode data (in real app, you'd fetch movie details)
    const movie: Movie = {
      id: history.episode.movieId,
      title: `Movie for ${history.episode.title}`,
      originalName: history.episode.title,
      description: `Watched episode: ${history.episode.title}`,
      releaseYear: 2024,
      type: 'series',
      duration: '45 min/ep',
      posterUrl: '/placeholder/placeholder-poster.png',
      thumbnailUrl: '/placeholder/placeholder-thumb.png',
      director: 'Unknown',
      status: 'ongoing',
      createdAt: new Date(),
      modifiedAt: new Date(),
      view: 0,
      slug: `movie-${history.episode.movieId}`,
      lang: 'Vietsub',
      country: [],
      actors: [],
      genres: [],
      totalEpisodes: 16,
      currentEpisode: history.episode.episodeNumber
    };

    return movie;
  });

  // Create movie extra data with progress info
  const movieExtraData: { [movieId: string]: any } = {};
  watchHistory.forEach(history => {
    const progressInfo = getProgressInfo(history.currentTime);
    movieExtraData[history.episode.movieId] = {
      showProgress: true,
      progressPercent: progressInfo.progressPercent,
      currentTime: progressInfo.currentTime,
      totalDuration: progressInfo.totalDuration,
      episodeInfo: {
        episodeNumber: history.episode.episodeNumber,
        watchedAt: history.watchedAt
      }
    };
  });

  // Calculate progress percentage (assuming 45 minutes = 2700 seconds per episode)
  const getProgressInfo = (currentTime: number) => {
    const assumedDuration = 2700; // 45 minutes in seconds
    const progressPercent = (currentTime / assumedDuration) * 100;
    return {
      progressPercent: Math.min(100, progressPercent),
      currentTime: Math.floor(currentTime),
      totalDuration: assumedDuration
    };
  };

  if (historyLoading && watchHistory.length === 0) {
    return <LoadingEffect message="Đang tải lịch sử xem..." />;
  }

  if (historyError && watchHistory.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-red-400 mb-4">Lỗi: {historyError}</div>
        <button 
          onClick={refreshData}
          className="px-4 py-2 bg-(--primary) text-white rounded-lg hover:bg-(--primary)/80 transition"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (watchHistory.length === 0) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4 text-left">Lịch sử xem</h2>
        <NotFoundDiv message="Chưa có lịch sử xem phim nào. <br/>Bắt đầu xem phim để theo dõi tiến trình!" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Lịch sử xem</h2>
          <p className="text-gray-400">
            {historyPagination.totalElements} phim đã xem gần đây
          </p>
        </div>
        
        <button
          onClick={refreshData}
          disabled={historyLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-(--surface) text-white rounded-lg hover:bg-(--primary)/20 transition disabled:opacity-50"
        >
          <svg className={`w-4 h-4 ${historyLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Làm mới</span>
        </button>
      </div>

      {/* Error display if any */}
      {historyError && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-400">
          {historyError}
        </div>
      )}

      {/* History Grid */}
      <MoviesGridLayout 
        filteredMovies={historyMovies} 
        loading={historyLoading}
        currentPage={historyPagination.currentPage}
        totalPages={historyPagination.totalPages}
        onPageChange={handleHistoryPageChange}
        hasNextPage={historyPagination.hasNext}
        hasPrevPage={historyPagination.hasPrev}
        cardSize="medium"
        movieExtraData={movieExtraData}
        onMessage={handleMessage}
      />

      {/* Additional History Info */}
      {historyMovies.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Thông tin xem gần đây</span>
          </h3>
          
          <div className="grid gap-3">
            {watchHistory.slice(0, 5).map((history, index) => (
              <div key={`${history.episode.id}-${index}`} className="bg-(--surface)/30 rounded-lg p-3">
                <div className="flex justify-between items-center text-sm">
                  <div className="text-white">
                    <span className="font-medium">{history.episode.title}</span>
                    <span className="text-gray-400 ml-2">• Tập {history.episode.episodeNumber}</span>
                  </div>
                  <div className="text-gray-400 text-xs">
                    {new Date(history.watchedAt).toLocaleDateString('vi-VN')} • {' '}
                    {new Date(history.watchedAt).toLocaleTimeString('vi-VN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Global Message Component */}
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
