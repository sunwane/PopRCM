import { Review } from '@/types/Review';
import { useState, useEffect, useRef } from 'react';
import AuthService from '@/services/AuthService';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import ConfirmModal from '@/components/ui/ConfirmModal';

export interface OneReviewProps {
  review: Review;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
}

export function OneReview({ review, onEdit, onDelete }: OneReviewProps) {
  const [imageError, setImageError] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const currentUser = AuthService.getUser();
  const isOwnReview = currentUser?.id === review.user.id;
  const confirmModal = useConfirmModal();

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowDetailsPopup(false);
      }
    };

    if (showDetailsPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDetailsPopup]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMs < 60000) return 'Vừa xong';
    if (diffMs < 3600000) return `${Math.floor(diffMs / 60000)} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteReview = async () => {
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
        onDelete?.(review.id);
      } catch (error) {
        console.error('Error deleting review:', error);
      } finally {
        confirmModal.setLoadingState(false);
      }
    }
  };

  return (
    <div className="border-b border-(--surface-divine) pb-4 mb-4 last:border-b-0">
      <div className="flex gap-3">
        {/* Avatar */}
        <div>
          {review.user.avatarUrl && !imageError ? (
            <img
              src={review.user.avatarUrl}
              alt={review.user.fullName || review.user.fullName || 'User Avatar'}
              className="w-10 h-10 rounded-full object-cover shrink-0"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm shrink-0">
              {review.user.userName ? review.user.userName.charAt(0).toUpperCase() : review.user.fullName ? review.user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
        </div>

        <div className="flex-1">
          {/* User info and rating */}
          <div className="flex items-center justify-between mb-1">
            <div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-white text-sm">{review.user.userName || review.user.fullName}</span>
                {review.user.gender && (
                  <img 
                    src={`/icons/${review.user.gender === 'male' ? 'Male' : 'Female'}.png`} 
                    alt={review.user.gender} 
                    className="w-4 h-4" 
                  />
                )}
                <div className='text-sm text-gray-400 mr-1'>đã chấm</div>
                <div className='mr-1.5 py-0.5 font-black text-sm text-(--hover) bg-black px-2 border-2 border-(--hover) rounded-md'>{review.rating.toFixed(1)}</div>
                <span className="text-gray-400 text-xs">{formatDate(review.createdAt)}</span>
                
                {/* Details button with popup */}
                <div className="relative ml-2" ref={popupRef}>
                  <button
                    onClick={() => setShowDetailsPopup(!showDetailsPopup)}
                    className="text-gray-400 hover:text-white transition-colors text-xs"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>

                  {/* Details popup */}
                  {showDetailsPopup && (
                    <div className="absolute top-full right-0 mt-1 bg-(--surface) border border-(--border-blue) rounded-lg shadow-lg z-20 min-w-[200px]">
                      {/* Date information - always show for all reviews */}
                      <div className="p-3 text-sm">
                        <div>
                          <span className="text-gray-400">Ngày tạo:</span>
                          <p className="text-white">{formatFullDate(review.createdAt)}</p>
                        </div>
                      </div>

                      {/* Actions for own review only */}
                      {isOwnReview && (
                        <div className="p-2">
                          <button
                            onClick={() => {
                              onEdit?.(review);
                              setShowDetailsPopup(false);
                            }}
                            className="flex items-center gap-2 w-full text-left px-3 py-2 text-white hover:bg-(--primary)/20 rounded transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Chỉnh sửa</span>
                          </button>
                          <button
                            onClick={handleDeleteReview}
                            className="flex items-center gap-2 w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Xóa</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
            </div>

            {/* No action buttons here anymore - moved to details popup */}
          </div>

          {/* Review content */}
          <p className="text-gray-300 text-sm whitespace-pre-wrap">{review.content}</p>
        </div>
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
    </div>
  );
}