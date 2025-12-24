import { useState } from 'react';
import { OneReview } from './OneReview';
import { ReviewPopup } from './ReviewPopup';
import { LoadingEffect } from '@/components/ui/LoadingEffect';
import { useReviewsData } from '@/hooks/useData/useReviewsData';
import { Review, ReviewRequest } from '@/types/Review';
import AuthService from '@/services/AuthService';

export interface ReviewTabProps {
  movieId: string;
  movieTitle?: string;
  onOpenAuth: () => void;
}

export function ReviewTab({ movieId, movieTitle, onOpenAuth }: ReviewTabProps) {
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  
  const isAuthenticated = !!AuthService.getUser();
  const currentUser = AuthService.getUser();
  
  const {
    reviews,
    loading,
    error,
    totalPages,
    currentPage,
    hasNextPage,
    hasPreviousPage,
    createOrUpdateReview,
    deleteReview,
    loadPage,
    refetch
  } = useReviewsData(movieId, 10);

  const userReview = reviews.find(review => review.user.id === currentUser?.id);

  const handleSubmitReview = async (request: ReviewRequest) => {
    try {
      await createOrUpdateReview(request);
      setShowReviewPopup(false);
      setEditingReview(null);
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setShowReviewPopup(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
      try {
        await deleteReview(reviewId);
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const handleOpenReviewPopup = () => {
    if (!isAuthenticated) {
      setShowReviewPopup(true);
      return;
    }
    
    if (userReview) {
      setEditingReview(userReview);
    } else {
      setEditingReview(null);
    }
    setShowReviewPopup(true);
  };

  const calculateAverageRating = (): number => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  // Pagination component
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const showPages = 5;
    let startPage = Math.max(0, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages - 1, startPage + showPages - 1);
    
    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(0, endPage - showPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => loadPage(i)}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            currentPage === i
              ? 'bg-(--primary) text-white'
              : 'bg-(--surface) text-gray-300 hover:bg-(--surface)/80'
          }`}
        >
          {i + 1}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          onClick={() => loadPage(currentPage - 1)}
          disabled={!hasPreviousPage}
          className="px-3 py-1 text-sm bg-(--surface) text-gray-300 rounded hover:bg-(--surface)/80 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Trước
        </button>
        
        {pages}
        
        <button
          onClick={() => loadPage(currentPage + 1)}
          disabled={!hasNextPage}
          className="px-3 py-1 text-sm bg-(--surface) text-gray-300 rounded hover:bg-(--surface)/80 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sau
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header with stats only - no write review button */}
      {reviews.length > 0 && (
        <div className="flex items-center justify-between bg-(--surface) rounded-lg p-4 border border-(--border-blue)">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-white font-medium">
                {reviews.length} đánh giá
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, index) => (
                    <svg
                      key={index}
                      className={`w-4 h-4 ${
                      index < Math.round(calculateAverageRating() / 2)
                          ? 'text-yellow-400'
                          : 'text-gray-600'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-300 text-sm">
                  {calculateAverageRating().toFixed(1)}/10
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews list */}
      <div>
        {loading && (
          <div className="text-center py-8">
            <LoadingEffect message="Đang tải đánh giá..." />
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && reviews.length === 0 && (
          <div className="text-center py-16 border-2 border-gray-700 rounded-2xl">
            <p className="text-gray-400">Chưa có đánh giá nào</p>
          </div>
        )}

        {!loading && !error && reviews.length > 0 && (
          <>
            <div className="space-y-4">
              {reviews.map((review) => (
                <OneReview
                  key={review.id}
                  review={review}
                  onEdit={handleEditReview}
                  onDelete={handleDeleteReview}
                />
              ))}
            </div>

            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
}