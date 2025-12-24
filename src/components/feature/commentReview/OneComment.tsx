import { useState } from 'react';
import { Comment } from '@/types/Comment';
import AuthService from '@/services/AuthService';

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

  const currentUser = AuthService.getUser();
  const isOwnComment = currentUser?.id === comment.user.id;
  const isAuthenticated = !!currentUser;

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

  const marginLeft = level > 0 ? `ml-${Math.min(level * 8, 32)}` : '';

  return (
    <div className={`${marginLeft} mb-4`}>
      <div className="flex gap-3">
        {/* User Avatar */}
        <div>
          {comment.user.avatar && !imageError ? (
            <img
              src={comment.user.avatar}
              alt={comment.user.fullName || comment.user.fullName || 'User Avatar'}
              className="w-10 h-10 rounded-full object-cover shrink-0"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm shrink-0">
              {comment.user.fullName ? comment.user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
        </div>

        <div className="flex-1">
          {/* User info and timestamp */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-white text-sm">{comment.user.fullName}</span>
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
              <span>{comment.likeCount}</span>
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
                className="text-gray-400 hover:text-white transition-colors"
              >
                Trả lời
              </button>
            )}

            {isOwnComment && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Chỉnh sửa
                </button>
                <button
                  onClick={() => onDelete?.(comment.id)}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  Xóa
                </button>
              </>
            )}
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
    </div>
  );
}