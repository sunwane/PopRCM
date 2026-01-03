"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

const LIKE_COUNT_STORAGE_KEY = 'comment_like_counts';

interface CommentLikeState {
  isLiked: boolean;
  likeCount: number;
}

interface CommentLikeData {
  [commentId: string]: {
    isLiked: boolean;
    likeCount: number;
    lastUpdated: number;
  };
}

export function useCommentLike(commentId: string, initialLiked: boolean, initialCount: number) {
  const { isAuthenticated, user } = useAuth();
  const [likeState, setLikeState] = useState<CommentLikeState>({
    isLiked: initialLiked,
    likeCount: initialCount
  });

  // Get comment like data from localStorage
  const getCommentLikeData = (): CommentLikeData => {
    try {
      const stored = localStorage.getItem(LIKE_COUNT_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  };

  // Save comment like state to localStorage
  const setCommentLikeData = (isLiked: boolean, likeCount: number) => {
    try {
      const allData = getCommentLikeData();
      allData[commentId] = {
        isLiked,
        likeCount,
        lastUpdated: Date.now()
      };
      localStorage.setItem(LIKE_COUNT_STORAGE_KEY, JSON.stringify(allData));
    } catch (error) {
      console.error('Error saving like data to localStorage:', error);
    }
  };

  // Initialize and sync like state from localStorage
  useEffect(() => {
    if (isAuthenticated && user) {
      const allData = getCommentLikeData();
      const localData = allData[commentId];
      
      if (localData) {
        // Sử dụng dữ liệu từ localStorage nếu có
        setLikeState({
          isLiked: localData.isLiked,
          likeCount: localData.likeCount
        });
      } else {
        // Nếu chưa có dữ liệu local, sử dụng dữ liệu từ server và lưu vào localStorage
        setLikeState({
          isLiked: initialLiked,
          likeCount: initialCount
        });
        setCommentLikeData(initialLiked, initialCount);
      }
    } else {
      // Not authenticated, use server state
      setLikeState({
        isLiked: initialLiked,
        likeCount: initialCount
      });
    }
  }, [commentId, initialLiked, initialCount, isAuthenticated, user]);

  // Toggle like state
  const toggleLike = () => {
    if (!isAuthenticated) {
      return false; // Cannot like when not authenticated
    }
    
    const newLikedState = !likeState.isLiked;
    const newLikeCount = likeState.likeCount + (newLikedState ? 1 : -1);
    
    // Optimistic update
    setLikeState(prev => ({
      isLiked: newLikedState,
      likeCount: newLikeCount
    }));
    
    // Save to localStorage với count mới
    setCommentLikeData(newLikedState, newLikeCount);
    
    return true; // Successfully toggled
  };

  return {
    isLiked: likeState.isLiked,
    likeCount: likeState.likeCount,
    toggleLike
  };
}