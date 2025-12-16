"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { FavoritesHistoryService } from '@/services/FavoritesHistoryService';
import { Favorites, WatchHistory, PageResponse } from '@/types/User';

export function useFavoritesHistoryData() {
  const { isAuthenticated, user } = useAuth();
  
  // Favorites state
  const [favorites, setFavorites] = useState<Favorites[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [favoritesError, setFavoritesError] = useState('');
  const [favoritesPagination, setFavoritesPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    hasNext: false,
    hasPrev: false
  });

  // Watch History state
  const [watchHistory, setWatchHistory] = useState<WatchHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [historyPagination, setHistoryPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    hasNext: false,
    hasPrev: false
  });

  /**
   * FAVORITES FUNCTIONS
   */

  // Load favorites
  const loadFavorites = async (page: number = 0, size: number = 20, resetData: boolean = false) => {
    if (!isAuthenticated) return;

    try {
      setFavoritesLoading(true);
      setFavoritesError('');

      const response = await FavoritesHistoryService.getFavorites(page, size);
      if (response) {
        const newFavorites = response.content;
        
        if (resetData || page === 0) {
          setFavorites(newFavorites);
        } else {
          setFavorites(prev => [...prev, ...newFavorites]);
        }

        setFavoritesPagination({
          currentPage: response.number,
          totalPages: response.totalPages,
          totalElements: response.totalElements,
          hasNext: response.number < response.totalPages - 1,
          hasPrev: response.number > 0
        });
      }
    } catch (error: any) {
      setFavoritesError(error.message || 'Lỗi khi tải danh sách yêu thích');
    } finally {
      setFavoritesLoading(false);
    }
  };

  // Add favorite
  const addFavorite = async (movieId: string): Promise<boolean> => {
    if (!isAuthenticated) return false;

    try {
      const success = await FavoritesHistoryService.addFavorite(movieId);
      if (success) {
        // Reload favorites to get updated list
        await loadFavorites(0, 20, true);
      }
      return success;
    } catch (error: any) {
      setFavoritesError(error.message || 'Lỗi khi thêm yêu thích');
      return false;
    }
  };

  // Remove favorite
  const removeFavorite = async (movieId: string): Promise<boolean> => {
    if (!isAuthenticated) return false;

    try {
      const success = await FavoritesHistoryService.removeFavorite(movieId);
      if (success) {
        // Remove from local state immediately for better UX
        setFavorites(prev => prev.filter(fav => fav.movie.id !== movieId));
        
        // Update pagination count
        setFavoritesPagination(prev => ({
          ...prev,
          totalElements: prev.totalElements - 1
        }));
      }
      return success;
    } catch (error: any) {
      setFavoritesError(error.message || 'Lỗi khi xóa yêu thích');
      return false;
    }
  };

  // Check if movie is favorited
  const isFavorited = (movieId: string): boolean => {
    return favorites.some(fav => fav.movie.id === movieId);
  };

  // Load more favorites (pagination)
  const loadMoreFavorites = async () => {
    if (favoritesPagination.hasNext && !favoritesLoading) {
      await loadFavorites(favoritesPagination.currentPage + 1, 20, false);
    }
  };

  /**
   * WATCH HISTORY FUNCTIONS
   */

  // Load watch history
  const loadWatchHistory = async (page: number = 0, size: number = 20, resetData: boolean = false) => {
    if (!isAuthenticated) return;

    try {
      setHistoryLoading(true);
      setHistoryError('');

      const response = await FavoritesHistoryService.getWatchHistory(page, size);
      if (response) {
        const newHistory = response.content;
        
        if (resetData || page === 0) {
          setWatchHistory(newHistory);
        } else {
          setWatchHistory(prev => [...prev, ...newHistory]);
        }

        setHistoryPagination({
          currentPage: response.number,
          totalPages: response.totalPages,
          totalElements: response.totalElements,
          hasNext: response.number < response.totalPages - 1,
          hasPrev: response.number > 0
        });
      }
    } catch (error: any) {
      setHistoryError(error.message || 'Lỗi khi tải lịch sử xem');
    } finally {
      setHistoryLoading(false);
    }
  };

  // Update watch progress
  const updateWatchProgress = async (episodeId: string, currentTime: number): Promise<boolean> => {
    try {
      const success = await FavoritesHistoryService.updateWatchProgress(episodeId, currentTime);
      if (success && isAuthenticated) {
        // Optionally reload history to reflect changes
        // await loadWatchHistory(0, 20, true);
      }
      return success;
    } catch (error: any) {
      setHistoryError(error.message || 'Lỗi khi cập nhật tiến trình xem');
      return false;
    }
  };

  // Load more history (pagination)
  const loadMoreHistory = async () => {
    if (historyPagination.hasNext && !historyLoading) {
      await loadWatchHistory(historyPagination.currentPage + 1, 20, false);
    }
  };

  // Get watch progress for an episode
  const getWatchProgress = (episodeId: string): number => {
    const historyItem = watchHistory.find(item => item.episode.id === episodeId);
    return historyItem?.currentTime || 0;
  };

  /**
   * UTILITY FUNCTIONS
   */

  // Clear errors
  const clearErrors = () => {
    setFavoritesError('');
    setHistoryError('');
  };

  // Refresh all data
  const refreshData = async () => {
    if (isAuthenticated) {
      await Promise.all([
        loadFavorites(0, 20, true),
        loadWatchHistory(0, 20, true)
      ]);
    }
  };

  // Auto-load data when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshData();
    } else {
      // Clear data when user logs out
      setFavorites([]);
      setWatchHistory([]);
      setFavoritesPagination({ currentPage: 0, totalPages: 0, totalElements: 0, hasNext: false, hasPrev: false });
      setHistoryPagination({ currentPage: 0, totalPages: 0, totalElements: 0, hasNext: false, hasPrev: false });
    }
  }, [isAuthenticated, user]);

  return {
    // Favorites
    favorites,
    favoritesLoading,
    favoritesError,
    favoritesPagination,
    loadFavorites,
    addFavorite,
    removeFavorite,
    isFavorited,
    loadMoreFavorites,

    // Watch History
    watchHistory,
    historyLoading,
    historyError,
    historyPagination,
    loadWatchHistory,
    updateWatchProgress,
    loadMoreHistory,
    getWatchProgress,

    // Utility
    clearErrors,
    refreshData
  };
}
