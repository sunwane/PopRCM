import { useState } from 'react';
import { OneComment } from './OneComment';
import { LoadingEffect } from '@/components/ui/LoadingEffect';
import { useCommentsData } from '@/hooks/useData/useCommentsData';
import { CommentRequest, CommentUpdateRequest } from '@/types/Comment';
import AuthService from '@/services/AuthService';
import GradientAvatar from '@/components/ui/GradientAvatar';
import { getUserAvatarText } from '@/utils/getTextUtils';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import ConfirmModal from '@/components/ui/ConfirmModal';

export interface CommentTabProps {
  episodeId?: string;
  showCommentInput?: boolean;
  onOpenAuth: () => void;
}

export function CommentTab({ episodeId, showCommentInput = false, onOpenAuth }: CommentTabProps) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const confirmModal = useConfirmModal();
  
  const isAuthenticated = !!AuthService.getUser();
  const currentUser = AuthService.getUser();
  
  const {
    comments,
    loading,
    error,
    totalPages,
    currentPage,
    hasNextPage,
    hasPreviousPage,
    createComment,
    updateComment,
    deleteComment,
    toggleLike,
    loadPage
  } = useCommentsData(episodeId || '', 10);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !episodeId) return;
    
    setIsSubmitting(true);
    try {
      const request: CommentRequest = {
        content: newComment.trim(),
      };
      await createComment(request);
      setNewComment('');
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (parentId: string, content: string) => {
    if (!episodeId) return;
    
    try {
      const request: CommentRequest = {
        content,
        parentId,
      };
      await createComment(request);
    } catch (error) {
      console.error('Error replying to comment:', error);
    }
  };

  const handleEdit = async (commentId: string, content: string) => {
    try {
      const request: CommentUpdateRequest = { content };
      await updateComment(commentId, request);
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDelete = async (commentId: string) => {
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
        await deleteComment(commentId);
      } catch (error) {
        console.error('Error deleting comment:', error);
      } finally {
        confirmModal.setLoadingState(false);
      }
    }
  };

  const handleToggleLike = async (commentId: string) => {
    try {
      await toggleLike(commentId);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
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

  if (!episodeId) {
    return (
      <div className="text-center py-16 rounded-2xl border-2 border-gray-700">
        <p className="text-gray-400">Bình luận sẽ được hiển thị trong tập phim cụ thể</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pr-6 pl-2">
      {/* Comment input section */}
      {showCommentInput && (
        <div className="">
          {!isAuthenticated ? (
            <div className="px-4 py-4 rounded-xl bg-(--surface)/40">
              <p className="text-gray-300 text-left">
                Vui lòng{' '}
                <button
                  onClick={onOpenAuth}
                  className="text-(--hover) hover:underline"
                >
                  đăng nhập
                </button>
                {' '}để nhập bình luận
              </p>
            </div>
          ) : (
            <div className="">
              <div className='mb-4 flex items-center gap-3'>
                {(!imageError && currentUser?.avatarUrl) ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName || currentUser.userName || 'User Avatar'}
                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-600"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <GradientAvatar
                    initial={getUserAvatarText(currentUser?.userName || currentUser?.fullName)}
                    size="w-12 h-12"
                  />
                )}
                <div className="text-white font-medium">
                  <div className='text-sm font-light text-gray-400'>Bình luận dưới tên</div>
                  <div className="flex items-center gap-1">
                    <div>
                      {currentUser?.userName || currentUser?.fullName ||  'Người dùng'}
                    </div>
                    <div>
                      {currentUser.gender === 'male' ? (
                        <img src="/icons/Male.png" alt="Male" className="w-6 h-6" />
                      ) : (
                        <img src="/icons/Female.png" alt="Female" className="w-6 h-6" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className='bg-white/10 pt-6 pb-4 px-6 rounded-xl'>
                <div className="flex gap-3 ">
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Viết bình luận của bạn..."
                      className="w-full bg-(--background) rounded-lg p-3 text-white text-sm resize-none scroll-y-auto no-scrollbar"
                      rows={5}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || isSubmitting}
                    className="px-4 py-2 bg-(--primary) text-white text-sm rounded-lg hover:bg-(--primary)/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Đang gửi...' : 'Gửi bình luận'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Comments list */}
      <div>
        {loading && (
          <div className="text-center py-8">
            <LoadingEffect message="Đang tải bình luận..." />
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && comments.length === 0 && (
          <div className="text-center py-16 border-2 border-gray-700 rounded-lg">
            <p className="text-gray-400">Chưa có bình luận nào</p>
          </div>
        )}

        {!loading && !error && comments.length > 0 && (
          <>
            <div className="space-y-4 px-2 py-2">
              {comments.map((comment) => (
                <OneComment
                  key={comment.id}
                  comment={comment}
                  onReply={handleReply}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleLike={handleToggleLike}
                  onOpenAuth={onOpenAuth}
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
    </div>
  );
}