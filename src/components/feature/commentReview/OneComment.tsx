import { useState, useEffect, useRef } from 'react';
import { Comment } from '@/types/Comment';
import AuthService from '@/services/AuthService';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import ConfirmModal from '@/components/ui/ConfirmModal';

export interface OneCommentProps {
  comment: Comment;
  onReply?: (parentId: string, content: string) => void;
  onEdit?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  onToggleLike?: (commentId: string) => void;
  onOpenAuth?: () => void;
  level?: number;
}

export function OneComment({ 
  comment, 
  onReply, 
  onEdit, 
  onDelete, 
  onToggleLike, 
  onOpenAuth,
  level = 0 
}: OneCommentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [replyContent, setReplyContent] = useState('');
  const [showReplies, setShowReplies] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const confirmModal = useConfirmModal();

  const currentUser = AuthService.getUser();
  const isOwnComment = currentUser?.id === comment.user.id;
  const isAuthenticated = !!currentUser;

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

  const handleEdit = () => {
    if (onEdit) {
      onEdit(comment.id, editContent);
      setIsEditing(false);
    }
  };

  const handleReply = () => {
    if (onReply && replyContent.trim()) {
      onReply(comment.id, replyContent.trim());
      setReplyContent('');
      setIsReplying(false);
    }
  };

  const handleLike = () => {
    if (!isAuthenticated) {
      onOpenAuth?.();
      return;
    }
    onToggleLike?.(comment.id);
  };

  const handleDeleteComment = async () => {
    const confirmed = await confirmModal.openConfirm({
      title: 'Xóa bình luận',
      message: 'Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể hoàn tác.',
      confirmText: 'Xóa bình luận',
      cancelText: 'Hủy bỏ',
      confirmButtonType: 'danger'
    });

    if (confirmed) {
      confirmModal.setLoadingState(true);
      try {
        onDelete?.(comment.id);
        setShowDetailsPopup(false);
      } catch (error) {
        console.error('Error deleting comment:', error);
      } finally {
        confirmModal.setLoadingState(false);
      }
    }
  };

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

  const marginLeft = level > 0 ? `ml-${Math.min(level * 8, 32)}` : '';

  return (
    <div className={`${marginLeft} mb-4`}>
      <div className="flex gap-3">
        {/* User Avatar */}
        <div>
          {comment.user.avatarUrl && !imageError ? (
            <img
              src={comment.user.avatarUrl}
              alt={comment.user.fullName || comment.user.fullName || 'User Avatar'}
              className="w-10 h-10 rounded-full object-cover shrink-0"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm shrink-0">
              {comment.user.userName ? comment.user.userName.charAt(0).toUpperCase() : comment.user.fullName ? comment.user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
        </div>

        <div className="flex-1">
          {/* User info and timestamp */}
          <div className="flex items-center gap-1 mb-1">
            <span className="font-semibold text-white text-sm">{comment.user.userName || comment.user.fullName}</span>
            {comment.user.gender && (
              <img 
                src={`/icons/${comment.user.gender === 'male' ? 'Male' : 'Female'}.png`} 
                alt={comment.user.gender} 
                className="w-4 h-4 mr-1" 
              />
            )}
            <span className="text-gray-400 text-xs">{formatDate(comment.createdAt)}</span>
            {comment.updatedAt !== comment.createdAt && (
              <span className="text-gray-500 text-xs">(đã chỉnh sửa)</span>
            )}
          </div>

          {/* Comment content */}
          {isEditing ? (
            <div className="mb-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full bg-(--surface) border border-(--border-blue) rounded-lg p-3 text-white text-sm resize-none"
                rows={3}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleEdit}
                  className="px-3 py-1 bg-(--primary) text-white text-sm rounded hover:bg-(--primary)/80 transition-colors"
                >
                  Lưu
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-500 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-300 text-sm mb-3 whitespace-pre-wrap">{comment.content}</p>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 transition-colors ${
                comment.likedByCurrentUser 
                  ? 'text-(--primary)' 
                  : 'text-gray-400 hover:text-(--primary)'
              }`}
            >
              <svg className="w-4 h-4" fill={comment.likedByCurrentUser ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{comment.likeCount} lượt thích</span>
            </button>

            {level < 2 && (
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    onOpenAuth?.();
                    return;
                  }
                  setIsReplying(!isReplying);
                }}
                className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                <span>Trả lời</span>
              </button>
            )}

            {/* Details button with popup */}
            <div className="relative" ref={popupRef}>
              <button
                onClick={() => setShowDetailsPopup(!showDetailsPopup)}
                className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
                <span>Chi tiết</span>
              </button>

              {/* Details popup */}
              {showDetailsPopup && (
                <div className="absolute top-full right-0 mt-1 bg-(--surface) border border-(--border-blue) rounded-lg shadow-lg z-20 min-w-[200px]">

                  {/* Actions for own comment only */}
                  {isOwnComment && (
                    <div className="py-2 px-1">
                      <button
                        onClick={() => {
                          setIsEditing(true);
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
                        onClick={handleDeleteComment}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Xóa</span>
                      </button>
                    </div>
                  )}
                  {/* Date information - always show for all comments */}
                  <div className="py-2 px-4 text-xs border-t border-gray-600">
                    <div className="mb-2">
                      <span className="text-gray-400">Ngày tạo:</span>
                      <p className="text-white">{formatFullDate(comment.createdAt)}</p>
                    </div>
                    {comment.updatedAt !== comment.createdAt && (
                      <div>
                        <span className="text-gray-400">Cập nhật lần cuối:</span>
                        <p className="text-white">{formatFullDate(comment.updatedAt)}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reply input */}
          {isReplying && (
            <div className="mt-3">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Viết phản hồi..."
                className="w-full bg-(--surface) border border-(--border-blue) rounded-lg p-3 text-white text-sm resize-none"
                rows={2}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleReply}
                  disabled={!replyContent.trim()}
                  className="px-3 py-1 bg-(--primary) text-white text-sm rounded hover:bg-(--primary)/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Gửi
                </button>
                <button
                  onClick={() => {
                    setIsReplying(false);
                    setReplyContent('');
                  }}
                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-500 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4">
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors text-xs mb-2"
              >
                <svg 
                  className={`w-3 h-3 transition-transform ${showReplies ? 'rotate-90' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {showReplies ? 'Ẩn' : 'Hiển thị'} {comment.replies.length} phản hồi
              </button>
              
              {showReplies && (
                <div>
                  {comment.replies.map((reply) => (
                    <OneComment
                      key={reply.id}
                      comment={reply}
                      onReply={onReply}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onToggleLike={onToggleLike}
                      onOpenAuth={onOpenAuth}
                      level={level + 1}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
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