"use client";
import { useState, useEffect, useCallback } from 'react';
import { FavoritesHistoryService } from '@/services/FavoritesHistoryService';
import { WatchHistory } from '@/types/User';
import { useAuth } from './useAuth';

/**
 * Hook useWatchedEpisodes - Quản lý danh sách tập phim đã xem của một bộ phim
 * 
 * Chức năng chính:
 * - Lấy danh sách tất cả tập đã xem của một bộ phim từ server
 * - Chỉ hoạt động khi user đã đăng nhập (guest không có lịch sử cá nhân)
 * - Cung cấp thông tin tiến trình xem của từng tập
 * - Hỗ trợ đánh dấu tập đã xem trong UI (playlist, episode list)
 * - Cung cấp các hàm tiện ích để kiểm tra và cập nhật trạng thái
 * 
 * Input: movieId (string) - ID của bộ phim cần lấy lịch sử xem
 * 
 * Output:
 * - watchedEpisodes (Array): Danh sách ID các tập đã xem (dạng mảng)
 * - watchedEpisodesSet (Set): Danh sách ID các tập đã xem (dạng Set để tìm kiếm nhanh)
 * - watchedEpisodesProgress (Object): Tiến trình xem của từng tập {episodeId: currentTime}
 * - loading (boolean): Trạng thái đang tải dữ liệu
 * - isEpisodeWatched (function): Kiểm tra tập có được xem chưa
 * - getEpisodeProgress (function): Lấy tiến trình của một tập cụ thể
 * - markEpisodeAsWatched (function): Đánh dấu tập đã xem (local update)
 * - refreshWatchedEpisodes (function): Làm mới danh sách từ server
 * 
 * Sử dụng: Trong playlist, episode list để hiển thị trạng thái đã xem
 */

export const useWatchedEpisodes = (movieId?: string) => {
  const { isAuthenticated } = useAuth();
  const [watchedEpisodes, setWatchedEpisodes] = useState<Set<string>>(new Set());
  const [watchedEpisodesProgress, setWatchedEpisodesProgress] = useState<{ [episodeId: string]: number }>({});
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch watched episodes from server
  const fetchWatchedEpisodes = useCallback(async () => {
    if (!isAuthenticated || !movieId) {
      setWatchedEpisodes(new Set());
      setWatchedEpisodesProgress({});
      return;
    }

    setLoading(true);
    try {
      console.log(`Fetching watch history for movie: ${movieId}`);
      
      // Lấy tất cả lịch sử xem (có thể cần nhiều trang)
      const historyResponse = await FavoritesHistoryService.getWatchHistory(0, 1000);
      
      if (historyResponse && historyResponse.content) {
        // Lọc episodes theo movieId
        const movieEpisodes = historyResponse.content.filter(
          (history: WatchHistory) => history.episode.movieId === movieId
        );

        // Tạo set các episode đã xem
        const watchedSet = new Set<string>();
        const progressMap: { [episodeId: string]: number } = {};

        movieEpisodes.forEach((history: WatchHistory) => {
          watchedSet.add(history.episode.id);
          progressMap[history.episode.id] = history.currentTime;
        });

        setWatchedEpisodes(watchedSet);
        setWatchedEpisodesProgress(progressMap);
        
        console.log(`Found ${watchedSet.size} watched episodes for movie ${movieId}`);
      }
    } catch (error) {
      console.error('Error fetching watched episodes:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, movieId]);

  // Refresh watched episodes (để gọi sau khi lưu progress mới)
  const refreshWatchedEpisodes = useCallback(() => {
    fetchWatchedEpisodes();
  }, [fetchWatchedEpisodes]);

  // Kiểm tra episode đã xem chưa
  const isEpisodeWatched = useCallback((episodeId: string): boolean => {
    return watchedEpisodes.has(episodeId);
  }, [watchedEpisodes]);

  // Lấy progress của episode
  const getEpisodeProgress = useCallback((episodeId: string): number => {
    return watchedEpisodesProgress[episodeId] || 0;
  }, [watchedEpisodesProgress]);

  // Thêm episode vào danh sách đã xem (local update)
  const markEpisodeAsWatched = useCallback((episodeId: string, progress: number = 0) => {
    setWatchedEpisodes(prev => new Set(prev).add(episodeId));
    setWatchedEpisodesProgress(prev => ({
      ...prev,
      [episodeId]: progress
    }));
  }, []);

  // Load data khi component mount hoặc movieId thay đổi
  useEffect(() => {
    fetchWatchedEpisodes();
  }, [fetchWatchedEpisodes]);

  return {
    watchedEpisodes: Array.from(watchedEpisodes),
    watchedEpisodesSet: watchedEpisodes,
    watchedEpisodesProgress,
    loading,
    isEpisodeWatched,
    getEpisodeProgress,
    markEpisodeAsWatched,
    refreshWatchedEpisodes
  };
};