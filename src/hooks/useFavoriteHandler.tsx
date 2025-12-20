"use client";
import { useState } from 'react';
import { useFavoritesHistoryData } from '@/hooks/useData/useFavoritesHistoryData';

interface FavoriteHandlerState {
  isProcessing: boolean;
  message: { text: string; type: 'success' | 'error' } | null;
}

export function useFavoriteHandler() {
  const { addFavorite, removeFavorite, isFavorited } = useFavoritesHistoryData();
  
  const [state, setState] = useState<FavoriteHandlerState>({
    isProcessing: false,
    message: null
  });

  const handleFavoriteToggle = async (movieId: string): Promise<void> => {
    if (state.isProcessing) return;

    setState(prev => ({ ...prev, isProcessing: true }));

    try {
      const isCurrentlyFavorited = isFavorited(movieId);
      
      if (isCurrentlyFavorited) {
        // Remove from favorites
        const success = await removeFavorite(movieId);
        if (success) {
          setState(prev => ({
            ...prev,
            message: { text: 'Đã xóa phim khỏi danh sách yêu thích', type: 'success' }
          }));
        } else {
          setState(prev => ({
            ...prev,
            message: { text: 'Có lỗi xảy ra khi xóa phim khỏi yêu thích', type: 'error' }
          }));
        }
      } else {
        // Add to favorites
        const success = await addFavorite(movieId);
        if (success) {
          setState(prev => ({
            ...prev,
            message: { text: 'Đã thêm phim vào danh sách yêu thích', type: 'success' }
          }));
        } else {
          setState(prev => ({
            ...prev,
            message: { text: 'Có lỗi xảy ra khi thêm phim vào yêu thích', type: 'error' }
          }));
        }
      }
    } catch (error) {
      console.error('Error handling favorite:', error);
      setState(prev => ({
        ...prev,
        message: { text: 'Có lỗi xảy ra khi xử lý yêu thích', type: 'error' }
      }));
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const clearMessage = () => {
    setState(prev => ({ ...prev, message: null }));
  };

  return {
    isProcessing: state.isProcessing,
    message: state.message,
    isFavorited,
    handleFavoriteToggle,
    clearMessage
  };
}