import { useState, useEffect, useCallback } from 'react';
import { Review, ReviewRequest, PaginatedReviews } from '@/types/Review';
import { ReviewService } from '@/services/ReviewService';

export interface UseReviewsData {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalItems: number;
  refetch: () => void;
  loadPage: (page: number) => void;
  createOrUpdateReview: (request: ReviewRequest) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
}

export function useReviewsData(movieId: string, pageSize: number = 10): UseReviewsData {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paginationInfo, setPaginationInfo] = useState({
    totalPages: 0,
    currentPage: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    totalItems: 0,
  });

  const fetchReviews = useCallback(async (page: number = 0) => {
    if (!movieId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data: PaginatedReviews = await ReviewService.getReviewsByMovieId(
        movieId,
        page,
        pageSize
      );
      
      setReviews(data.content);
      setPaginationInfo({
        totalPages: data.totalPages,
        currentPage: data.number,
        hasNextPage: !data.last,
        hasPreviousPage: !data.first,
        totalItems: data.totalElements,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [movieId, pageSize]);

  useEffect(() => {
    fetchReviews(0);
  }, [fetchReviews]);

  const loadPage = useCallback((page: number) => {
    fetchReviews(page);
  }, [fetchReviews]);

  const refetch = useCallback(() => {
    fetchReviews(paginationInfo.currentPage);
  }, [fetchReviews, paginationInfo.currentPage]);

  const createOrUpdateReview = useCallback(async (request: ReviewRequest) => {
    try {
      await ReviewService.createOrUpdateReview(movieId, request);
      refetch(); // Refresh reviews after creating/updating
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save review');
      throw err;
    }
  }, [movieId, refetch]);

  const deleteReview = useCallback(async (reviewId: string) => {
    try {
      await ReviewService.deleteReview(reviewId);
      setReviews(prev => prev.filter(review => review.id !== reviewId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete review');
      throw err;
    }
  }, []);

  return {
    reviews,
    loading,
    error,
    totalPages: paginationInfo.totalPages,
    currentPage: paginationInfo.currentPage,
    hasNextPage: paginationInfo.hasNextPage,
    hasPreviousPage: paginationInfo.hasPreviousPage,
    totalItems: paginationInfo.totalItems,
    refetch,
    loadPage,
    createOrUpdateReview,
    deleteReview,
  };
}