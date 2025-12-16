"use client";
import { useEffect } from 'react';
import { useFavoritesHistoryData } from '@/hooks/useData/useFavoritesHistoryData';
import { Movie } from '@/types/Movies';
import MovieCard from '@/components/feature/movies/MovieCard';
import { LoadingEffect } from '@/components/ui/LoadingEffect';
import NotFoundDiv from '@/components/ui/NotFoundDiv';

export default function HistoryTab() {
  const { 
    watchHistory, 
    historyLoading, 
    historyError,
    historyPagination,
    loadMoreHistory,
    refreshData
  } = useFavoritesHistoryData();

  // Load data on component mount
  useEffect(() => {
    refreshData();
  }, []);

  // Convert WatchHistory to Movie data with progress info
  const historyMovies = watchHistory.map(history => {
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

    return {
      movie,
      history
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
      <div className="text-center py-12">
        <div className="mb-6">
          <img 
            src="/icons/History.png" 
            alt="No history" 
            className="w-16 h-16 mx-auto opacity-50 mb-4"
          />
        </div>
        <NotFoundDiv message="Chưa có lịch sử xem phim nào." />
        <p className="text-gray-400 mt-2">
          Bắt đầu xem phim để theo dõi tiến trình!
        </p>
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
      <div className="space-y-6">
        {/* Recent Activity Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Xem gần đây</span>
          </h3>
          
          <div className="grid grid-cols-[repeat(auto-fit,minmax(168px,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(168px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(168px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(28vw,1fr))] gap-4 gap-y-6 justify-items-center">
            {historyMovies.map(({ movie, history }, index) => {
              const progressInfo = getProgressInfo(history.currentTime);
              
              return (
                <div key={`${movie.id}-${history.episode.id}-${index}`} className="w-full">
                  <MovieCard
                    movie={movie}
                    size="medium"
                    showProgress={true}
                    progressPercent={progressInfo.progressPercent}
                    currentTime={progressInfo.currentTime}
                    totalDuration={progressInfo.totalDuration}
                  />
                  
                  {/* Additional Episode Info */}
                  <div className="mt-2 text-sm text-gray-400 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <span>Tập {history.episode.episodeNumber}</span>
                      <span>•</span>
                      <span>{new Date(history.watchedAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="text-xs mt-1 text-gray-500">
                      Xem lúc {new Date(history.watchedAt).toLocaleTimeString('vi-VN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Load More Button */}
      {historyPagination.hasNext && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMoreHistory}
            disabled={historyLoading}
            className="px-6 py-3 bg-(--primary) text-white rounded-lg hover:bg-(--primary)/80 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {historyLoading ? (
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
      {!historyPagination.hasNext && historyMovies.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          Đã hiển thị tất cả {historyPagination.totalElements} mục lịch sử
        </div>
      )}
    </div>
  );
}
