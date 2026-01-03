"use client";
import { useState, useEffect } from 'react';

interface TrailerPopupProps {
  isOpen: boolean;
  onClose: () => void;
  trailerUrl?: string;
  movieTitle: string;
}

// 🎥 Hàm chuyển đổi YouTube URL thành embed URL
const getYouTubeEmbedUrl = (url: string): string | null => {
  try {
    // Xử lý các định dạng YouTube URL khác nhau
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);
    
    if (match && match[1]) {
      const videoId = match[1];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&controls=1&modestbranding=1`;
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing YouTube URL:', error);
    return null;
  }
};

// 🎬 Kiểm tra có phải YouTube URL không
const isYouTubeUrl = (url: string): boolean => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

export default function TrailerPopup({ 
  isOpen, 
  onClose, 
  trailerUrl, 
  movieTitle 
}: TrailerPopupProps) {
  const [showVideoError, setShowVideoError] = useState(false);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);

  // Reset error state when popup opens/closes or URL changes
  useEffect(() => {
    if (isOpen && trailerUrl) {
      const isValidUrl = trailerUrl && trailerUrl.trim() !== '';
      console.log('🎬 Trailer URL check:', { trailerUrl, isValidUrl });
      
      if (isValidUrl) {
        // Nếu là YouTube URL, chuyển đổi thành embed URL
        if (isYouTubeUrl(trailerUrl)) {
          const embedUrl = getYouTubeEmbedUrl(trailerUrl);
          console.log('YouTube embed URL:', embedUrl);
          setEmbedUrl(embedUrl);
          setShowVideoError(!embedUrl);
        } else {
          // URL video thường (MP4, etc.)
          setEmbedUrl(trailerUrl);
          setShowVideoError(false);
        }
      } else {
        setShowVideoError(true);
      }
    } else if (isOpen) {
      console.log('⚠️ No trailer URL provided');
      setShowVideoError(false);
      setEmbedUrl(null);
    }
  }, [isOpen, trailerUrl]);

  // Close popup when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle ESC key to close popup
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // Prevent body scroll when popup is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      {/* Popup Container - Full Screen Video */}
      <div 
        className="relative bg-black overflow-hidden"
        style={{
          width: '80vw',
          height: '80vh',
          maxWidth: '1200px',
          maxHeight: '800px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 📹 OVERLAY HEADER - Floating on top of video */}
        <div className="absolute top-0 left-0 right-0 z-30 bg-linear-to-b from-black/80 via-black/60 to-transparent p-4 flex items-center justify-between">
          <h3 className="text-white text-lg font-bold truncate pr-4 drop-shadow-lg tracking-wide">
            Trailer: {movieTitle}
          </h3>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="shrink-0 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200 backdrop-blur-sm bg-black/30"
            aria-label="Đóng trailer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Video Container - Full Screen */}
        <div className="relative w-full h-full bg-black">
          {/* Video Error Overlay */}
          {showVideoError && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 text-center p-6">
              <div className="text-red-400 text-6xl mb-4">⚠️</div>
              <h3 className="text-white text-xl font-bold mb-2">Lỗi trailer</h3>
              <p className="text-gray-300 text-sm mb-4 max-w-md">
                Rất tiếc, trailer hiện tại đang gặp sự cố hoặc không có sẵn.<br />
                Mong bạn thông cảm, chúng tôi sẽ khắc phục sớm nhất.
              </p>
              <button 
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Đóng
              </button>
            </div>
          )}

          {/* 🎥 YOUTUBE IFRAME - Full screen video */}
          {!showVideoError && embedUrl && isYouTubeUrl(trailerUrl || '') && (
            <iframe
              className="w-full h-full"
              src={embedUrl}
              title={`Trailer: ${movieTitle}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onError={() => {
                console.error('YouTube iframe error');
                setShowVideoError(true);
              }}
            />
          )}

          {/* 📹 REGULAR VIDEO ELEMENT - For non-YouTube videos */}
          {!showVideoError && embedUrl && !isYouTubeUrl(trailerUrl || '') && (
            <video 
              className="w-full h-full object-cover"
              controls
              autoPlay
              onError={() => {
                console.error('Video playback error');
                setShowVideoError(true);
              }}
              onLoadStart={() => {
                console.log('Trailer video started loading');
              }}
              onCanPlay={() => {
                console.log('Trailer video can play');
                setShowVideoError(false);
              }}
            >
              <source 
                src={embedUrl} 
                type="video/mp4" 
              />
              {/* Fallback message */}
              <div className="flex items-center justify-center h-full text-white">
                Trình duyệt của bạn không hỗ trợ phát video.
              </div>
            </video>
          )}

          {/* No Trailer URL */}
          {!trailerUrl && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-center p-6">
              <div className="text-gray-400 text-5xl mb-4">📽️</div>
              <h3 className="text-white text-xl font-bold mb-2">Chưa có trailer</h3>
              <p className="text-gray-300 text-sm mb-4">
                Trailer cho phim này chưa có sẵn.
              </p>
              <button 
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Đóng
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}