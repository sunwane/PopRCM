"use client";
import { useState, useEffect, useCallback } from 'react';
import { FavoritesHistoryService } from '@/services/FavoritesHistoryService';
import { WatchHistory } from '@/types/User';
import { useAuth } from './useAuth';

/**
 * Hook useEpisodeProgress - Quản lý tiến trình xem của một tập phim cụ thể
 * 
 * Chức năng chính:
 * - Lấy tiến trình đã lưu từ server cho một tập phim cụ thể (auto-resume)
 * - Chỉ hoạt động khi user đã đăng nhập (guest không có lịch sử cá nhân)
 * - Hỗ trợ tự động phát tiếp từ thời điểm đã xem trước đó
 * - Cung cấp loading state để UI hiển thị trạng thái tải
 * 
 * Input: episodeId (string) - ID của tập phim cần lấy tiến trình
 * 
 * Output:
 * - savedProgress (number): Thời gian đã xem (giây) từ lần trước
 * - hasProgress (boolean): Có tiến trình đã lưu hay không
 * - loading (boolean): Trạng thái đang tải dữ liệu
 * - refreshProgress (function): Hàm làm mới dữ liệu tiến trình
 * 
 * Sử dụng: Trong trang xem phim để tự động phát tiếp từ vị trí đã dừng
 */

export const useEpisodeProgress = (episodeId: string) => {
  const { isAuthenticated } = useAuth();
  const [savedProgress, setSavedProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasProgress, setHasProgress] = useState<boolean>(false);

  // Fetch saved progress for this episode
  const fetchEpisodeProgress = useCallback(async () => {
    if (!isAuthenticated || !episodeId) {
      setSavedProgress(0);
      setHasProgress(false);
      return;
    }

    setLoading(true);
    try {
      console.log(`🔍 Fetching progress for episode: ${episodeId}`);
      
      // Lấy lịch sử xem (có thể cần nhiều trang)
      const historyResponse = await FavoritesHistoryService.getWatchHistory(0, 1000);
      
      if (historyResponse && historyResponse.content) {
        // Tìm episode cụ thể này trong lịch sử
        const episodeHistory = historyResponse.content.find(
          (history: WatchHistory) => history.episode.id === episodeId
        );

        if (episodeHistory && episodeHistory.currentTime > 0) {
          setSavedProgress(episodeHistory.currentTime);
          setHasProgress(true);
          console.log(`✅ Found saved progress: ${episodeHistory.currentTime}s`);
        } else {
          setSavedProgress(0);
          setHasProgress(false);
          console.log(`ℹ️ No progress found for episode ${episodeId}`);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching episode progress:', error);
      setSavedProgress(0);
      setHasProgress(false);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, episodeId]);

  // Load progress when episode changes
  useEffect(() => {
    fetchEpisodeProgress();
  }, [fetchEpisodeProgress]);

  return {
    savedProgress,
    hasProgress,
    loading,
    refreshProgress: fetchEpisodeProgress
  };
};