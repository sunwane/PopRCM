import { Review } from '@/types/Review';
import AuthService from '@/services/AuthService';

export interface OneReviewProps {
  review: Review;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
}

export function OneReview({ review, onEdit, onDelete }: OneReviewProps) {
  const currentUser = AuthService.getUser();
  const isOwnReview = currentUser?.id === review.user.id;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Vừa xong';
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 10 }, (_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400' : 'text-gray-600'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="border-b border-(--surface-divine) pb-4 mb-4 last:border-b-0">
      <div className="flex gap-3">
        {/* Avatar */}
        <img
          src={review.user.avatar || '/placeholder/avatar-default.jpg'}
          alt={review.user.fullName}
          className="w-12 h-12 rounded-full object-cover shrink-0"
        />

        <div className="flex-1">
          {/* User info and rating */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-sm">{review.user.fullName}</span>
                <span className="text-gray-400 text-xs">{formatDate(review.createdAt)}</span>
              </div>
              
              {/* Star rating */}
              <div className="flex items-center gap-1 mt-1">
                {renderStars(review.rating)}
                <span className="text-sm text-yellow-400 ml-1">{review.rating}/10</span>
              </div>
            </div>

            {/* Action buttons for own review */}
            {isOwnReview && (
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit?.(review)}
                  className="text-gray-400 hover:text-white transition-colors text-xs"
                >
                  Chỉnh sửa
                </button>
                <button
                  onClick={() => onDelete?.(review.id)}
                  className="text-gray-400 hover:text-red-400 transition-colors text-xs"
                >
                  Xóa
                </button>
              </div>
            )}
          </div>

          {/* Review content */}
          <p className="text-gray-300 text-sm whitespace-pre-wrap">{review.content}</p>
        </div>
      </div>
    </div>
  );
}