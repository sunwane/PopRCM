import { useState } from 'react';
import { OneReview } from './OneReview';
import { ReviewPopup } from './ReviewPopup';
import { LoadingEffect } from '@/components/ui/LoadingEffect';
import { useReviewsData } from '@/hooks/useData/useReviewsData';
import { Review, ReviewRequest } from '@/types/Review';
import AuthService from '@/services/AuthService';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import ConfirmModal from '@/components/ui/ConfirmModal';

export interface ReviewTabProps {
  movieId: string;
  movieTitle?: string;
  onOpenAuth: () => void;
}

export function ReviewTab({ movieId, movieTitle, onOpenAuth }: ReviewTabProps) {
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const confirmModal = useConfirmModal();
  
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
    const confirmed = await confirmModal.openConfirm({
      title: 'Xóa đánh giá',
      message: 'Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.',
      confirmText: 'Xóa đánh giá',
      cancelText: 'Hủy bỏ',
      confirmButtonType: 'danger'
    });

    if (confirmed) {
      confirmModal.setLoadingState(true);
      try {
        await deleteReview(reviewId);
      } catch (error) {
        console.error('Error deleting review:', error);
      } finally {
        confirmModal.setLoadingState(false);
      }
    }
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
          className="flex items-center gap-1 px-3 py-1 text-sm bg-(--surface) text-gray-300 rounded hover:bg-(--surface)/80 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Trước
        </button>
        
        {pages}
        
        <button
          onClick={() => loadPage(currentPage + 1)}
          disabled={!hasNextPage}
          className="flex items-center gap-1 px-3 py-1 text-sm bg-(--surface) text-gray-300 rounded hover:bg-(--surface)/80 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sau
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header with stats only - no write review button */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-3 bg-(--surface) rounded-lg p-4 border border-(--border-blue)">
          {/* Logo */}
          <img src="/logoicon.jpg" alt="Reviews" className="w-14 h-14 border border-gray-700 shadow-md" />

          {/* Stats */}
          <div className="flex flex-col justify-center">
            {calculateAverageRating() && (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-(--hover)">
                  {calculateAverageRating().toFixed(1)}
                </span>
                <span className="text-sm text-gray-400">/ 10</span>
              </div>
            )}
            <p className="text-gray-300 font-medium text-sm mt-1">
              {reviews.length} đánh giá
            </p>
          </div>
        </div>
      )}

      {/* Reviews list */}
      <div className='px-4'>
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
      
      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.options.title}
        message={confirmModal.options.message}
        confirmText={confirmModal.options.confirmText}
        cancelText={confirmModal.options.cancelText}
        confirmButtonType={confirmModal.options.confirmButtonType}
        onConfirm={confirmModal.handleConfirm}
        onCancel={confirmModal.handleCancel}
        isLoading={confirmModal.isLoading}
      />

      {/* Review Popup */}
      <ReviewPopup
        isOpen={showReviewPopup}
        onClose={() => {
          setShowReviewPopup(false);
          setEditingReview(null);
        }}
        onSubmit={handleSubmitReview}
        onOpenAuth={onOpenAuth}
        movieId={movieId}
        movieTitle={movieTitle}
        existingReview={editingReview}
        onSuccess={() => refetch()}
      />
    </div>
  );
}