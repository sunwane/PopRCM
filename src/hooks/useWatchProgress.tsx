"use client";
import { useEffect, useRef, useCallback } from 'react';
import { FavoritesHistoryService } from '@/services/FavoritesHistoryService';
import { useAuth } from './useAuth';

interface UseWatchProgressProps {
  episodeId: string;
  movieId: string;
  videoElement?: HTMLVideoElement | null;
}

export const useWatchProgress = ({ episodeId, movieId, videoElement }: UseWatchProgressProps) => {
  const { user, isAuthenticated } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedTime = useRef<number>(0);
  const isInitialized = useRef<boolean>(false);

  // Hàm lưu progress lên server
  const saveProgress = useCallback(async (currentTime: number) => {
    if (!isAuthenticated || !episodeId || currentTime <= 0) {
      return;
    }

    // Chỉ lưu nếu thay đổi ít nhất 5 giây từ lần cuối
    if (Math.abs(currentTime - lastSavedTime.current) < 5) {
      return;
    }

    try {
      console.log(`💾 Saving watch progress: Episode ${episodeId}, Time: ${currentTime}s`);
      
      const success = await FavoritesHistoryService.updateWatchProgress(episodeId, currentTime);
      
      if (success) {
        lastSavedTime.current = currentTime;
        console.log(`✅ Progress saved successfully: ${currentTime}s`);
      } else {
        console.warn('❌ Failed to save progress');
      }
    } catch (error) {
      console.error('❌ Error saving watch progress:', error);
    }
  }, [episodeId, isAuthenticated]);

  // Khởi tạo interval để lưu progress mỗi 30 giây
  const startProgressTracking = useCallback(() => {
    if (!isAuthenticated || !videoElement || intervalRef.current) {
      return;
    }

    console.log('🎬 Starting watch progress tracking...');

    intervalRef.current = setInterval(() => {
      if (videoElement && !videoElement.paused && !videoElement.ended) {
        const currentTime = Math.floor(videoElement.currentTime);
        saveProgress(currentTime);
      }
    }, 10000); // Lưu mỗi 30 giây

    isInitialized.current = true;
  }, [isAuthenticated, videoElement, saveProgress]);

  // Dừng tracking
  const stopProgressTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log('⏸️ Stopped watch progress tracking');
    }
  }, []);

  // Lưu progress cuối cùng khi component unmount hoặc video pause
  const saveCurrentProgress = useCallback(() => {
    if (videoElement && isAuthenticated) {
      const currentTime = Math.floor(videoElement.currentTime);
      if (currentTime > 0) {
        saveProgress(currentTime);
      }
    }
  }, [videoElement, saveProgress, isAuthenticated]);

  // Effect để khởi tạo tracking khi có video element
  useEffect(() => {
    if (videoElement && isAuthenticated && !isInitialized.current) {
      startProgressTracking();

      // Lắng nghe events
      const handlePlay = () => {
        console.log('▶️ Video started playing');
        if (!intervalRef.current) {
          startProgressTracking();
        }
      };

      const handlePause = () => {
        console.log('⏸️ Video paused');
        saveCurrentProgress();
      };

      const handleEnded = () => {
        console.log('🏁 Video ended');
        saveCurrentProgress();
        stopProgressTracking();
      };

      const handleBeforeUnload = () => {
        console.log('🔄 Page unloading, saving progress...');
        saveCurrentProgress();
      };

      // Add event listeners
      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('pause', handlePause);
      videoElement.addEventListener('ended', handleEnded);
      window.addEventListener('beforeunload', handleBeforeUnload);

      // Cleanup function
      return () => {
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('pause', handlePause);
        videoElement.removeEventListener('ended', handleEnded);
        window.removeEventListener('beforeunload', handleBeforeUnload);
        stopProgressTracking();
        saveCurrentProgress();
      };
    }
  }, [videoElement, isAuthenticated, startProgressTracking, stopProgressTracking, saveCurrentProgress]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      stopProgressTracking();
      saveCurrentProgress();
    };
  }, [stopProgressTracking, saveCurrentProgress]);

  // Reset khi episodeId thay đổi
  useEffect(() => {
    lastSavedTime.current = 0;
    isInitialized.current = false;
    stopProgressTracking();
    
    if (videoElement && isAuthenticated) {
      // Delay một chút để video được setup hoàn toàn
      setTimeout(() => {
        startProgressTracking();
      }, 1000);
    }
  }, [episodeId, movieId]);

  return {
    saveProgress: saveCurrentProgress,
    isTracking: !!intervalRef.current,
    startTracking: startProgressTracking,
    stopTracking: stopProgressTracking
  };
};