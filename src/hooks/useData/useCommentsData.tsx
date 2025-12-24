import { useState, useEffect, useCallback } from 'react';
import { Comment, CommentRequest, CommentUpdateRequest, PaginatedComments } from '@/types/Comment';
import { CommentService } from '@/services/CommentService';

export interface UseCommentsData {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalItems: number;
  refetch: () => void;
  loadPage: (page: number) => void;
  createComment: (request: CommentRequest) => Promise<void>;
  updateComment: (commentId: string, request: CommentUpdateRequest) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  toggleLike: (commentId: string) => Promise<void>;
}

export function useCommentsData(episodeId: string, pageSize: number = 10): UseCommentsData {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paginationInfo, setPaginationInfo] = useState({
    totalPages: 0,
    currentPage: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    totalItems: 0,
  });

  const fetchComments = useCallback(async (page: number = 0) => {
    if (!episodeId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data: PaginatedComments = await CommentService.getCommentsByEpisodeId(
        episodeId,
        page,
        pageSize
      );
      
      setComments(data.content);
      setPaginationInfo({
        totalPages: data.totalPages,
        currentPage: data.number,
        hasNextPage: !data.last,
        hasPreviousPage: !data.first,
        totalItems: data.totalElements,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comments');
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  }, [episodeId, pageSize]);

  useEffect(() => {
    fetchComments(0);
  }, [fetchComments]);

  const loadPage = useCallback((page: number) => {
    fetchComments(page);
  }, [fetchComments]);

  const refetch = useCallback(() => {
    fetchComments(paginationInfo.currentPage);
  }, [fetchComments, paginationInfo.currentPage]);

  const createComment = useCallback(async (request: CommentRequest) => {
    try {
      await CommentService.createComment(episodeId, request);
      refetch(); // Refresh comments after creating
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create comment');
      throw err;
    }
  }, [episodeId, refetch]);

  const updateComment = useCallback(async (commentId: string, request: CommentUpdateRequest) => {
    try {
      const updatedComment = await CommentService.updateComment(commentId, request);
      setComments(prev => prev.map(comment => 
        comment.id === commentId ? updatedComment : comment
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update comment');
      throw err;
    }
  }, []);

  const deleteComment = useCallback(async (commentId: string) => {
    try {
      await CommentService.deleteComment(commentId);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment');
      throw err;
    }
  }, []);

  const toggleLike = useCallback(async (commentId: string) => {
    try {
      const updatedComment = await CommentService.toggleLike(commentId);
      setComments(prev => prev.map(comment => 
        comment.id === commentId ? updatedComment : comment
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle like');
      throw err;
    }
  }, []);

  return {
    comments,
    loading,
    error,
    totalPages: paginationInfo.totalPages,
    currentPage: paginationInfo.currentPage,
    hasNextPage: paginationInfo.hasNextPage,
    hasPreviousPage: paginationInfo.hasPreviousPage,
    totalItems: paginationInfo.totalItems,
    refetch,
    loadPage,
    createComment,
    updateComment,
    deleteComment,
    toggleLike,
  };
}