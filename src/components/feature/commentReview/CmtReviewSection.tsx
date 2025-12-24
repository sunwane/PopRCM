import { useState, useEffect } from 'react';
import { CommentTab } from './CommentTab';
import { ReviewTab } from './ReviewTab';
import ToggleButton from '@/components/ui/ToggleButton';
import { useCommentsData } from '@/hooks/useData/useCommentsData';
import { useReviewsData } from '@/hooks/useData/useReviewsData';

export interface CmtReviewSectionProps {
  movieId: string;
  movieTitle?: string;
  episodeId?: string;
  showCommentInput?: boolean;
  initialTab?: 'comments' | 'reviews';
  onOpenAuth: () => void;
}

export function CmtReviewSection({ 
  movieId, 
  movieTitle, 
  episodeId, 
  showCommentInput = false,
  initialTab = 'comments',
  onOpenAuth 
}: CmtReviewSectionProps) {
  const [activeTab, setActiveTab] = useState<'comments' | 'reviews'>(initialTab);

  const {
    totalItems: totalComments
  } = useCommentsData(episodeId || '', 10);

  const {
    totalItems: totalReviews
  } = useReviewsData(movieId || '', 10);

  // Update active tab when initialTab prop changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Always show the section, but individual tabs will handle empty states
  const handleToggle = () => {
    setActiveTab(activeTab === 'comments' ? 'reviews' : 'comments');
  };

  return (
    <div className="mt-10">
      {/* Toggle Button Header */}
      <div className="flex mb-4">
        <img src="/icons/Comment.png" alt="Comment & Review" className="h-10 w-10 mr-2" />
        <div className="flex items-center font-bold text-lg text-white mr-4 gap-1">
          <div>
            {activeTab === 'comments' ? 'Bình luận' : 'Đánh giá'}
          </div>
          <div>
            ({activeTab === 'comments' ? totalComments : activeTab === 'reviews' ? totalReviews : '0'})
          </div>
        </div>
        <ToggleButton
          isActive={activeTab === 'reviews'}
          onToggle={handleToggle}
          leftLabel="Bình luận"
          rightLabel="Đánh giá"
          className="w-fit"
        />
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'comments' ? (
          <CommentTab 
            episodeId={episodeId}
            showCommentInput={showCommentInput}
            onOpenAuth={onOpenAuth}
          />
        ) : (
          <ReviewTab 
            movieId={movieId}
            movieTitle={movieTitle}
            onOpenAuth={onOpenAuth}
          />
        )}
      </div>
    </div>
  );
}