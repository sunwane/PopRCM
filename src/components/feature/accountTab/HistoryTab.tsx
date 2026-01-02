"use client";
import { useEffect, useState, useCallback } from 'react';
import { useFavoritesHistoryData } from '@/hooks/useData/useFavoritesHistoryData';
import { Movie } from '@/types/Movies';
import MoviesGridLayout from '@/components/feature/movies/MoviesGridLayout';
import { LoadingEffect } from '@/components/ui/LoadingEffect';
import NotFoundDiv from '@/components/ui/NotFoundDiv';
import Message from '@/components/ui/Message';
import { getVideoDuration } from '@/utils/timeUtils';

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
  
  // 🎬 State để lưu thời lượng video thực tế
  const [videoDurations, setVideoDurations] = useState<{ [episodeId: string]: number }>({});
  const [loadingDurations, setLoadingDurations] = useState<Set<string>>(new Set());

  // Handle message from MovieCard
  const handleMessage = (content: string, type: 'success' | 'error') => {
    setMessage({ text: content, type });
  };

  // 🎬 Hàm lấy thời lượng video thực tế từ URL
  const fetchVideoDuration = useCallback(async (episodeId: string, videoUrl?: string, m3u8Url?: string) => {
    // Nếu đã có duration hoặc đang loading thì skip
    if (videoDurations[episodeId] || loadingDurations.has(episodeId)) {
      return;
    }

    // Chọn URL để lấy duration (ưu tiên m3u8)
    const urlToCheck = (m3u8Url && m3u8Url.trim() !== '') ? m3u8Url : videoUrl;
    
    if (!urlToCheck || urlToCheck.trim() === '') {
      console.log(`No valid video URL for episode ${episodeId}`);
      return;
    }

    try {
      // Set loading state
      setLoadingDurations(prev => new Set([...prev, episodeId]));
      
      console.log(`🎬 Fetching duration for episode ${episodeId} from: ${urlToCheck}`);
      const duration = await getVideoDuration(urlToCheck);
      
      console.log(`✅ Got duration for episode ${episodeId}: ${duration}s`);
      
      // Lưu duration vào state
      setVideoDurations(prev => ({
        ...prev,
        [episodeId]: duration
      }));
      
    } catch (error) {
      console.warn(`⚠️ Failed to get duration for episode ${episodeId}:`, error);
      // Fallback về 45 phút nếu không lấy được
      setVideoDurations(prev => ({
        ...prev,
        [episodeId]: 2700 // 45 minutes
      }));
    } finally {
      // Remove loading state
      setLoadingDurations(prev => {
        const newSet = new Set(prev);
        newSet.delete(episodeId);
        return newSet;
      });
    }
  }, [videoDurations, loadingDurations]);

  // Load video durations khi có watchHistory
  useEffect(() => {
    if (watchHistory.length > 0) {
      watchHistory.forEach(history => {
        // Cần lấy videoUrl và m3u8Url từ episode data
        // Giả sử episode object có chứa các URL này
        fetchVideoDuration(
          history.episode.id,
          history.episode.videoUrl,
          history.episode.m3u8Url
        );
      });
    }
  }, [watchHistory, fetchVideoDuration]);

  // Load data on component mount
  useEffect(() => {
    refreshData();
  }, []);

  // Calculate progress percentage với thời lượng thực tế
  const getProgressInfo = (currentTime: number, episodeId: string) => {
    // Lấy thời lượng thực tế từ state, fallback về 45 phút (2700s)
    const actualDuration = videoDurations[episodeId] || 2700;
    const progressPercent = (currentTime / actualDuration) * 100;
    
    return {
      progressPercent: Math.min(100, progressPercent),
      currentTime: Math.floor(currentTime),
      totalDuration: actualDuration,
      isLoadingDuration: loadingDurations.has(episodeId)
    };
  };

  // Convert WatchHistory to Movie data with progress info
  const historyMovies: Movie[] = watchHistory.map(history => {
    // Use actual movie data from API response if available
    if (history.movie) {
      return history.movie;
    }
    
    // Fallback to creating movie from episode data (for mock data compatibility)
    const movie: Movie = {
      id: history.episode.movieId,
      title: history.episode.movieTitle || `Movie for ${history.episode.title}`,
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
      slug: history.episode.movieSlug || `movie-${history.episode.movieId}`,
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
    const progressInfo = getProgressInfo(history.currentTime, history.episode.id);
    movieExtraData[history.episode.movieId] = {
      showProgress: true,
      progressPercent: progressInfo.progressPercent,
      currentTime: progressInfo.currentTime,
      totalDuration: progressInfo.totalDuration,
      isLoadingDuration: progressInfo.isLoadingDuration,
      // Episode information for navigation and display
      episodeId: history.episode.id,
      episodeNumber: history.episode.episodeNumber,
      episodeInfo: {
        episodeNumber: history.episode.episodeNumber,
        watchedAt: history.watchedAt
      }
    };
  });

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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-0.5">Lịch sử xem</h2>
          <p className="text-gray-400">
            {historyPagination.totalElements} phim đã xem
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            {loadingDurations.size > 0 && (
              <span>🔄 Đang tải thời lượng video ({loadingDurations.size})...</span>
            )}
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
        showFavoriteButton={false}
        inHistoryTab={true}
      />

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
