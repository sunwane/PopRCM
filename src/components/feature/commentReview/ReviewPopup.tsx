import { useState, useEffect } from 'react';
import { Review, ReviewRequest } from '@/types/Review';
import AuthService from '@/services/AuthService';
import { ReviewService } from '@/services/ReviewService';

export interface ReviewPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (request: ReviewRequest) => Promise<void>;
  onOpenAuth: () => void;
  movieId?: string;
  movieTitle?: string;
  existingReview?: Review | null;
  onSuccess?: () => void; // Callback để refresh data
}

export function ReviewPopup({ 
  isOpen, 
  onClose, 
  onSubmit, 
  onOpenAuth, 
  movieId,
  movieTitle,
  existingReview,
  onSuccess 
}: ReviewPopupProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAuthenticated = !!AuthService.getUser();

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setContent(existingReview.content);
    } else {
      setRating(0);
      setContent('');
    }
  }, [existingReview, isOpen]);

  const handleSubmit = async () => {
    if (!rating || !content.trim()) return;
    
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        // Use provided onSubmit callback
        await onSubmit({ rating, content: content.trim() });
      } else if (movieId) {
        // Use direct API call
        await ReviewService.createOrUpdateReview(movieId, { 
          rating, 
          content: content.trim() 
        });
      }
      
      // Call success callback to refresh data
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAuthLogin = () => {
    onClose();
    onOpenAuth();
  };

  const renderStars = () => {
    return Array.from({ length: 10 }, (_, index) => {
      const starNumber = index + 1;
      const isFilled = starNumber <= (hoveredRating || rating);
      
      return (
        <button
          key={index}
          type="button"
          className={`w-6 h-6 transition-colors ${
            isFilled ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-300'
          }`}
          onMouseEnter={() => setHoveredRating(starNumber)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => setRating(starNumber)}
          disabled={!isAuthenticated}
        >
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-(--background) border-2 border-(--surface-divine) rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-(--surface-divine)">
          <h2 className="text-lg font-bold text-white">
            {existingReview ? 'Chỉnh sửa đánh giá' : 'Đánh giá phim'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="py-4 px-6">
          {movieTitle && (
            <div className="mb-4 flex w-full flex-col items-center">
              <p className="text-gray-300 text-sm">Đánh giá cho:</p>
              <p className="text-white text-lg font-medium">{movieTitle}</p>
            </div>
          )}

          {!isAuthenticated ? (
            /* Not authenticated view */
            <div className="text-center py-8">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-gray-300 mb-4">
                Vui lòng{' '}
                <button
                  onClick={handleAuthLogin}
                  className="text-(--hover) hover:underline"
                >
                  đăng nhập
                </button>
                {' '}để đánh giá phim
              </p>
            </div>
          ) : (
            /* Authenticated view */
            <>
              {/* Rating */}
              <div className="mb-3">
                <label className="block text-gray-200 text-sm font-medium mb-2">
                  Điểm đánh giá <div className='text-red-400 inline'>*</div>
                </label>
                <div className="flex items-center justify-center gap-1 mb-2 py-4 px-4 border-2 border-(--border-blue) rounded-lg">
                  {renderStars()}
                </div>
                <p className="flex items-center justify-end text-gray-400 text-xs">
                  {rating > 0 ? `${rating}/10 điểm` : 'Chọn số sao để đánh giá'}
                </p>
              </div>

              {/* Content */}
              <div className="mb-6">
                <label className="block text-gray-200 text-sm font-medium mb-2">
                  Nội dung đánh giá <div className='text-red-400 inline'>*</div>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Chia sẻ cảm nhận của bạn về bộ phim..."
                  className="w-full bg-(--surface)/50 rounded-lg py-3 px-4 text-white text-sm resize-none"
                  rows={5}
                />
                <p className="flex items-center justify-end text-gray-400 text-xs mt-1">
                  {content.length}/500 ký tự
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={!rating || !content.trim() || isSubmitting}
                  className="flex-1 bg-(--gradient-primary-start) text-white py-2 px-4 rounded-lg hover:bg-(--primary)/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Đang gửi...' : (existingReview ? 'Cập nhật' : 'Gửi đánh giá')}
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}