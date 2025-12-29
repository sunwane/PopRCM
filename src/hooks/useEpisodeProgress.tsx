"use client";
import { useState, useEffect, useCallback } from 'react';
import { FavoritesHistoryService } from '@/services/FavoritesHistoryService';
import { WatchHistory } from '@/types/User';
import { useAuth } from './useAuth';

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