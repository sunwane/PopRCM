"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

const LIKE_STORAGE_KEY = 'comment_likes';

interface CommentLikeState {
  isLiked: boolean;
  likeCount: number;
}

export function useCommentLike(commentId: string, initialLiked: boolean, initialCount: number) {
  const { isAuthenticated, user } = useAuth();
  const [likeState, setLikeState] = useState<CommentLikeState>({
    isLiked: initialLiked,
    likeCount: initialCount
  });

  // Get liked comments from localStorage
  const getLikedComments = (): Set<string> => {
    try {
      const stored = localStorage.getItem(LIKE_STORAGE_KEY);
      return new Set(stored ? JSON.parse(stored) : []);
    } catch {
      return new Set();
    }
  };

  // Save comment like state to localStorage
  const setCommentLiked = (liked: boolean) => {
    try {
      const likedComments = getLikedComments();
      if (liked) {
        likedComments.add(commentId);
      } else {
        likedComments.delete(commentId);
      }
      localStorage.setItem(LIKE_STORAGE_KEY, JSON.stringify([...likedComments]));
    } catch (error) {
      console.error('Error saving like state to localStorage:', error);
    }
  };

  // Initialize and sync like state from localStorage
  useEffect(() => {
    if (isAuthenticated && user) {
      const likedComments = getLikedComments();
      const isLikedLocally = likedComments.has(commentId);
      
      // If there's a discrepancy between local and server state, use local state
      if (isLikedLocally !== initialLiked) {
        setLikeState({
          isLiked: isLikedLocally,
          likeCount: initialCount + (isLikedLocally ? 1 : -1)
        });
      } else {
        setLikeState({
          isLiked: initialLiked,
          likeCount: initialCount
        });
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
    
    // Optimistic update
    setLikeState(prev => ({
      isLiked: newLikedState,
      likeCount: prev.likeCount + (newLikedState ? 1 : -1)
    }));
    
    // Save to localStorage
    setCommentLiked(newLikedState);
    
    return true; // Successfully toggled
  };

  return {
    isLiked: likeState.isLiked,
    likeCount: likeState.likeCount,
    toggleLike
  };
}