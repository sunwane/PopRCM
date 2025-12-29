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
    currentPage: 1, // Start from 1 for UI consistency
    totalPages: 0,
    totalElements: 0,
    hasNext: false,
    hasPrev: false
  });

  // Watch History state - now includes movie data
  const [watchHistory, setWatchHistory] = useState<(WatchHistory & { movie?: any })[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [historyPagination, setHistoryPagination] = useState({
    currentPage: 1, // Start from 1 for UI consistency
    totalPages: 0,
    totalElements: 0,
    hasNext: false,
    hasPrev: false
  });

  /**
   * FAVORITES FUNCTIONS
   */

  // Load favorites with page-based pagination
  const loadFavorites = async (page: number = 1, size: number = 20) => {
    if (!isAuthenticated) return;

    try {
      setFavoritesLoading(true);
      setFavoritesError('');

      // Convert UI page (1-based) to API page (0-based)
      const apiPage = page - 1;
      const response = await FavoritesHistoryService.getFavorites(apiPage, size);
      if (response) {
        setFavorites(response.content);

        setFavoritesPagination({
          currentPage: page,
          totalPages: response.totalPages,
          totalElements: response.totalElements,
          hasNext: page < response.totalPages,
          hasPrev: page > 1
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
        await loadFavorites(1, 20);
      }
      return success;
    } catch (error: any) {
      setFavoritesError(error.message || 'Lỗi khi thêm yêu thích');
      return false;
    }
  };

  // Remove favorite
  const removeFavorite = async (movieId: string): Promise<boolean> => {
    console.log('🔥 removeFavorite called for movieId:', movieId);
    console.log('🔥 isAuthenticated:', isAuthenticated);
    if (!isAuthenticated) return false;

    try {
      console.log('🔥 Calling FavoritesHistoryService.removeFavorite...');
      const success = await FavoritesHistoryService.removeFavorite(movieId);
      console.log('🔥 Service removeFavorite result:', success);
      
      if (success) {
        console.log('🔥 Updating local state...');
        console.log('🔥 Current favorites count:', favorites.length);
        
        // Force immediate update by using functional state update
        setFavorites(prevFavorites => {
          const updatedFavorites = prevFavorites.filter(fav => fav.movie.id !== movieId);
          console.log('🔥 Updated favorites count:', updatedFavorites.length);
          return updatedFavorites;
        });
        
        // Update pagination with functional update
        setFavoritesPagination(prev => {
          const newTotalElements = prev.totalElements - 1;
          const itemsPerPage = 20;
          const newTotalPages = Math.ceil(newTotalElements / itemsPerPage);
          
          console.log('🔥 Updating pagination:', {
            newTotalElements,
            newTotalPages,
            currentPage: prev.currentPage
          });
          
          return {
            ...prev,
            totalElements: newTotalElements,
            totalPages: newTotalPages,
            hasNext: prev.currentPage < newTotalPages,
            hasPrev: prev.currentPage > 1
          };
        });

        // If current page becomes empty and it's not the first page, load previous page
        // Use setTimeout to ensure state updates are processed first
        setTimeout(async () => {
          const currentFavs = favorites.filter(fav => fav.movie.id !== movieId);
          if (currentFavs.length === 0 && favoritesPagination.currentPage > 1) {
            console.log('🔥 Current page empty, loading previous page...');
            const newPage = favoritesPagination.currentPage - 1;
            await loadFavorites(newPage, 20);
          }
        }, 100);
      }
      return success;
    } catch (error: any) {
      console.error('❌ Error in removeFavorite:', error);
      setFavoritesError(error.message || 'Lỗi khi xóa yêu thích');
      return false;
    }
  };

  // Check if movie is favorited
  const isFavorited = (movieId: string): boolean => {
    return favorites.some(fav => fav.movie.id === movieId);
  };

  // Handle page change for favorites
  const handleFavoritesPageChange = async (page: number) => {
    await loadFavorites(page, 20);
  };

  /**
   * WATCH HISTORY FUNCTIONS
   */

  // Load watch history with page-based pagination (now loads latest per movie with movie data)
  const loadWatchHistory = async (page: number = 1, size: number = 20) => {
    if (!isAuthenticated) return;

    try {
      setHistoryLoading(true);
      setHistoryError('');

      // Convert UI page (1-based) to API page (0-based)
      const apiPage = page - 1;
      const response = await FavoritesHistoryService.getLatestWatchHistoryWithMovies(apiPage, size);
      if (response) {
        setWatchHistory(response.content);

        setHistoryPagination({
          currentPage: page,
          totalPages: response.totalPages,
          totalElements: response.totalElements,
          hasNext: page < response.totalPages,
          hasPrev: page > 1
        });
      }
    } catch (error: any) {
      setHistoryError(error.message || 'Lỗi khi tải lịch sử xem');
    } finally {
      setHistoryLoading(false);
    }
  };

  // Load latest watch history per movie (chỉ tập mới nhất của mỗi movie) - REMOVED, now integrated into loadWatchHistory

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

  // Handle page change for history
  const handleHistoryPageChange = async (page: number) => {
    await loadWatchHistory(page, 20);
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
        loadFavorites(1, 20),
        loadWatchHistory(1, 20) // Now loads latest per movie automatically
      ]);
    }
  };

  // Refresh data - remove toggle option since we only support latest history now
  // const refreshDataWithHistoryType = async (useLatestOnly: boolean = true) => {
  //   // Removed since we always use latest history now
  // };

  // Auto-load data when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('🔥 User authenticated, loading data...');
      refreshData(); // Sử dụng latest history mặc định
    } else {
      console.log('🔥 User not authenticated, clearing data...');
      // Clear data when user logs out
      setFavorites([]);
      setWatchHistory([]);
      setFavoritesPagination({ currentPage: 1, totalPages: 0, totalElements: 0, hasNext: false, hasPrev: false });
      setHistoryPagination({ currentPage: 1, totalPages: 0, totalElements: 0, hasNext: false, hasPrev: false });
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
    handleFavoritesPageChange,

    // Watch History
    watchHistory,
    historyLoading,
    historyError,
    historyPagination,
    loadWatchHistory,
    updateWatchProgress,
    handleHistoryPageChange,
    getWatchProgress,

    // Utility
    clearErrors,
    refreshData
  };
}
