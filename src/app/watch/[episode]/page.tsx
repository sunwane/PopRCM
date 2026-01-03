"use client";
import { useEpisodeData } from "@/hooks/useData/useEpisodeData";
import { useParams, useSearchParams } from "next/navigation";
import { PlayList } from "@/components/feature/watch/PlayList";
import { Episode } from "@/types/Movies";
import PageHeader from "@/components/layout/PageHeader";
import PageFooter from "@/components/layout/PageFooter";
import { ListTopMovies } from "@/components/feature/movieDetails/ListTopMovies";
import { useResponsive } from "@/hooks/useResponsive";
import { DetailsTab } from "@/components/feature/movieDetails/DetailsTab";
import { useMoviesDataByID, useRecommendedMovies, useSeriesDataByMovieId } from "@/hooks/useData/useMoviesData";
import { Genre } from "@/types/Genres";
import { getStatusText, getViewDisplayText } from "@/utils/getTextUtils";
import { getStatusColor, getViewLabelColor } from "@/utils/getColorUtils";
import { useRouter } from "next/navigation";
import { useFavoriteHandler } from "@/hooks/useFavoriteHandler";
import Message from "@/components/ui/Message";
import { LoadingPage } from "@/components/ui/LoadingPage";
import { CmtReviewSection } from "@/components/feature/commentReview/CmtReviewSection";
import { AuthBackground } from "@/components/feature/auth/AuthBackground";
import { ReviewPopup } from "@/components/feature/commentReview/ReviewPopup";
import { useState, Suspense, useRef, useEffect } from "react";
import { useWatchProgress } from "@/hooks/useWatchProgress";
import { useWatchedEpisodes } from "@/hooks/useWatchedEpisodes";
import { useEpisodeProgress } from "@/hooks/useEpisodeProgress";

export default function WatchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-(--background) flex items-center justify-center"><LoadingPage /></div>}>
      <WatchPageContent />
    </Suspense>
  );
}

function WatchPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const episode = params.episode;
  const route = useRouter();
  const movieId = searchParams.get('movieId');
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [activeCommentTab, setActiveCommentTab] = useState<'comments' | 'reviews'>('comments');
  const [showVideoError, setShowVideoError] = useState(false);

  // Video element ref để tracking progress
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Use favorite handler hook
  const { isProcessing, message, isFavorited, handleFavoriteToggle, clearMessage } = useFavoriteHandler();

  const { movieInfo: movie, loading} = useMoviesDataByID(movieId || "");
  const { episode: episodeData, loading: episodesLoading } = useEpisodeData(episode?.toString() || '');
  console.log("Episode Data:", episodeData);
  const { seriesInfo } = useSeriesDataByMovieId(movieId);
  const { recommendedMovies } = useRecommendedMovies(movieId || "");

  // 📊 HOOK LƯU LỊCH SỬ XEM: Tự động lưu thời gian xem hiện tại vào localStorage
  // Mỗi khi user xem video, nó sẽ lưu currentTime để lần sau tiếp tục từ đó
  const { isTracking } = useWatchProgress({
    episodeId: episodeData?.id || '', // ID của episode đang xem
    movieId: movieId || '',           // ID của movie
    videoElement: videoRef.current    // Element video để track progress
  });

  // 📚 HOOK THEO DÕI CÁC TẬP ĐÃ XEM: Lưu danh sách các tập đã xem hoàn thành
  // Đánh dấu tập nào đã xem xong để hiển thị trạng thái "đã xem" trong playlist
  const { 
    watchedEpisodesSet,      // Set chứa ID các tập đã xem xong
    isEpisodeWatched,        // Function kiểm tra tập có được xem xong chưa
    refreshWatchedEpisodes   // Function refresh lại danh sách đã xem
  } = useWatchedEpisodes(movieId || '');

  // ⏰ HOOK LẤY LỊCH SỬ THỜI GIAN XEM: Lấy thời điểm đã lưu của tập hiện tại
  // Dùng để auto-resume từ vị trí đã xem trước đó
  const { 
    savedProgress,    // Thời gian đã lưu (số giây) - VD: 1250 (tức 20:50)
    hasProgress,      // Boolean: có lịch sử hay không
    loading: progressLoading  // Loading state khi đang load lịch sử
  } = useEpisodeProgress(episodeData?.id || '');

  // Set video ref when video element is available và auto-play/resume
  useEffect(() => {
    if (!episodeData) return;

    // 📋 DEBUG: Log thông tin lịch sử xem
    console.log('🔍 Episode Progress Info:', {
      episodeId: episodeData.id,
      hasProgress,
      savedProgress,
      progressLoading
    });

    // Kiểm tra cả 2 link có rỗng không
    const hasValidVideoUrl = episodeData.videoUrl && episodeData.videoUrl.trim() !== '';
    const hasValidM3u8Url = episodeData.m3u8Url && episodeData.m3u8Url.trim() !== '';
    
    if (!hasValidVideoUrl && !hasValidM3u8Url) {
      console.log('Both video URLs are empty, showing error overlay');
      setShowVideoError(true);
      return;
    } else {
      setShowVideoError(false);
    }

    const video = document.querySelector('video') as HTMLVideoElement;
    if (video && episodeData) {
      videoRef.current = video;
      console.log('Video element found and attached to ref');

      const handleLoadedMetadata = () => {
        console.log('Video metadata loaded');
        
        // 🎬 XỬ LÝ LỊCH SỬ XEM: Phân ra 2 trường hợp rõ ràng
        if (hasProgress && savedProgress > 0) {
          console.log(`📍 TRƯỜNG HỢP 1: Có lịch sử xem - Resume từ ${savedProgress}s`);
          
          // Đặt thời điểm phát từ lịch sử
          video.currentTime = savedProgress;
          
          // 🎯 Chờ seeked event để đảm bảo video đã jump đến đúng vị trí
          const handleSeeked = () => {
            console.log(`✅ Video đã seek đến ${video.currentTime}s, bắt đầu auto-play`);
            
            // Bây giờ mới auto-play từ vị trí đúng
            video.play().then(() => {
              console.log('✅ Video resumed from saved position and auto-playing');
            }).catch((error) => {
              console.log("⚠️ Resume auto-play failed:", error);
            });
            
            // Remove listener sau khi xử lý xong
            video.removeEventListener('seeked', handleSeeked);
          };
          
          // Listen for seeked event
          video.addEventListener('seeked', handleSeeked);
          
        } else {
          console.log('🆕 TRƯỜNG HỢP 2: Chưa có lịch sử - Bắt đầu từ giây 0 và auto-play');
          
          // Đặt về đầu video (đảm bảo)
          video.currentTime = 0;
          
          // 🚀 Tự động phát từ đầu luôn (không cần chờ seek vì đã ở vị trí 0)
          video.play().then(() => {
            console.log('✅ Video started from beginning and auto-playing');
          }).catch((error) => {
            console.log("⚠️ Auto-play from beginning failed (user interaction required):", error);
          });
        }
      };

      const handleLoadedData = () => {
        console.log('Video data loaded');
        handleLoadedMetadata();
      };

      // Add event listeners
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('loadeddata', handleLoadedData);

      // If video is already loaded
      if (video.readyState >= 1) {
        handleLoadedMetadata();
      }

      // Cleanup function
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('loadeddata', handleLoadedData);
      };
    }
  }, [episodeData, hasProgress, savedProgress]);

  const { isMobile } = useResponsive();

  const handleEpisodeSelect = (selectedEpisode: Episode, serverName?: string, movieId?: string) => {
    // Navigate to the selected episode with optional server parameter
    const url = `/watch/${selectedEpisode.id}?movieId=${encodeURIComponent(movieId ?? "")}&server=${encodeURIComponent(serverName ?? "")}`
    window.location.href = url;
  };

  const scrollToCommentSection = (tab: 'comments' | 'reviews') => {
    setActiveCommentTab(tab);
    // Scroll to comment section after a brief delay to allow for state update
    setTimeout(() => {
      const commentSection = document.getElementById('comment-review-section');
      if (commentSection) {
        commentSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (loading || episodesLoading) {
    return (
      <div className="min-h-screen bg-(--background) flex items-center justify-center">
        <LoadingPage />
      </div>
    );
  }

  if (!movie || !episodeData) {
    return (
      <div className="min-h-screen bg-(--background) flex items-center justify-center">
        <div className="text-white">Phim không tồn tại</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--background)">
      <PageHeader />
      <div className="py-2 px-6 w-full">
        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row md:flex-row gap-6 w-full">
          
          {/* Left Side - Video Player */}
          <div className="grow">
            {/* Video Player */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
              {progressLoading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                  <div className="text-white text-sm">Đang tải vị trí phát lại...</div>
                </div>
              )}

              {/* Video Error Overlay */}
              {showVideoError && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 text-center p-6">
                  <div className="text-red-400 text-6xl mb-4">⚠️</div>
                  <h3 className="text-white text-xl font-bold mb-2">Lỗi link phim</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Rất tiếc, link phim hiện tại đang gặp sự cố.<br />
                    Mong bạn thông cảm, chúng tôi sẽ khắc phục sớm nhất.
                  </p>
                  <button 
                    onClick={() => route.back()}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Quay lại
                  </button>
                </div>
              )}

              <video 
                ref={videoRef}
                className="w-full h-full"
                controls
                autoPlay
                poster="/placeholder/video-thumbnail.jpg"
              >
                {!showVideoError && (
                  <source 
                    src={
                      episodeData.m3u8Url && episodeData.m3u8Url.trim() !== "" 
                        ? episodeData.m3u8Url 
                        : episodeData.videoUrl
                    } 
                    type="video/mp4" 
                  />
                )}
              </video>
            </div>

            {/* Movie Info */}
            <div className="grid grid-cols-2 gap-6 px-4">
              <div>
                <h1 className="text-2xl font-bold text-white">{movie.title}</h1>
                <div className="flex items-center gap-2">
                  <p className="text-gray-300 mb-4">Đang xem: {episodeData.title}</p>
                </div>
                
                {/* Rating and Labels */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {movie.tmdbScore && (
                    <div className="flex items-center space-x-1.5 border-2 border-blue-500 bg-blue-500/30 text-white px-2.5 py-1.5 rounded-lg">
                      <div className="font-bold lg:text-[13px] md:text-[13px] text-[11px] text-blue-500">TMDB</div> 
                      <div className="font-bold lg:text-sm md:text-sm text-xs">
                        {movie.tmdbScore.toFixed(1)}
                      </div>
                    </div>
                  )}
                  {movie.imdbScore && (
                    <div className="flex items-center space-x-1.5 border-2 border-yellow-500 bg-yellow-500/30 text-white px-2.5 py-1.5 rounded-lg">
                      <div className="font-bold lg:text-[13px] md:text-[13px] text-[11px] text-yellow-500">TMDB</div> 
                      <div className="font-bold lg:text-sm md:text-sm text-xs">
                        {movie.imdbScore.toFixed(1)}
                      </div>
                    </div>
                  )}
                  <div className="capitalize bg-(--primary) px-2.5 py-2 border-2 border-(--primary) rounded-lg font-bold tracking-wide text-black lg:text-sm md:text-sm text-xs">
                    {movie.type}
                  </div>
                  {movie.PopRating && (
                    <div className="flex items-center space-x-1.5 border-2 border-blue-500 bg-blue-500/10 text-white px-2.5 py-1.5 rounded-lg">
                      <div className="font-bold lg:text-[13px] md:text-[13px] text-[11px]">TMDB</div> 
                      <div className="font-bold text-(--hover) lg:text-sm md:text-sm text-xs">
                        {movie.PopRating.toFixed(1)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-2.5">
                    {movie.genres && movie.genres.map((genre: Genre) => (
                    <div 
                      key={genre.id}
                      className="bg-white/20 px-3 py-2 rounded-lg text-sm"
                    >
                      {genre.genresName}
                    </div>
                    ))}
                </div>

                {/* Episode Info */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <div className={`flex items-center gap-1 rounded-md px-2.5 py-2 ${getStatusColor(movie.status || "")}`}>
                    {movie.status === "ongoing" && (
                      <div className="status-ongoing"></div>
                    )}
                    {movie.status === "completed" && (
                      <div className="status-completed"></div>
                    )}
                    {movie.status === "trailer" && (
                      <div className="status-trailer"></div>
                    )}
                    <span className="text-sm">{getStatusText(movie.status)}: {movie.currentEpisode} / {movie.totalEpisodes || "?"} tập</span>
                  </div>
                  <div className={`px-2.5 py-1.5 rounded text-sm tracking-wide flex items-center space-x-1 ${getViewLabelColor(movie.view || 0)}`}>
                    <div className="font-black">{getViewDisplayText(movie.view || 0)}</div>
                    <div className="text-xs font-medium">lượt xem</div>
                  </div>
                </div>
              </div>
              <div className="">
                <div 
                  className="font-light text-gray-400 text-[15px] leading-7"
                  dangerouslySetInnerHTML={{
                  __html: movie.description || "Không có mô tả cho movie này."
                }}/>
                <button 
                  className="flex gap-1 items-center mt-4" 
                  onClick={() => {route.push(`/movie/${movie.id}`)}}
                >
                  <div className="text-sm text-(--hover)">Thông tin chi tiết</div>
                  <svg 
                    className='w-4 h-4 text-(--hover)'
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={3} 
                      d="M9 5l7 7-7 7" 
                    />
                  </svg>
              </button>
              </div>
            </div>

            {/* Movies */}
            <div className="mb-6 mt-6 mr-6 ml-2">
              <DetailsTab 
                movieInfo={movie} 
                seriesInfo={seriesInfo ?? undefined} 
                recommendations={recommendedMovies} 
                currentEpisode={episodeData ?? undefined}
                watchedEpisodes={watchedEpisodesSet}
              />
            </div>

            {/* Comment and Review Section */}
            <div id="comment-review-section">
              <CmtReviewSection
                movieId={movieId || ""}
                movieTitle={movie.title}
                episodeId={episodeData?.id}
                showCommentInput={true}
                onOpenAuth={() => setShowAuthOverlay(true)}
                initialTab={activeCommentTab}
              />
            </div>
          </div>

          {/* Right Side - Playlist */}
          <div className="min-w-[400px]">
            {isMobile ? null : (
              <PlayList
                movie={movie}
                episodes={movie.episodes ?? []}
                loading={episodesLoading}
                currentEpisode={episodeData}
                onEpisodeSelect={handleEpisodeSelect}
                watchedEpisodes={watchedEpisodesSet}
              />
            )}

            <div className="grid grid-cols-3 py-3 px-4 rounded-lg border-2 border-(--surface-divine) shadow-lg mt-6">
              <button 
                className="w-full flex flex-col items-center justify-center gap-1 text-nowrap rounded transition-colors text-sm text-white disabled:opacity-50"
                onClick={() => movie && handleFavoriteToggle(movie.id)}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <img 
                    src={isFavorited(movie.id) ? "/icons/HeartHover.png" : "/icons/Heart.png"} 
                    alt="Heart" 
                    className="h-6 w-6" 
                  />
                )}
                <span>Yêu thích</span>
              </button>
              <button 
                className="w-full flex flex-col items-center justify-center gap-1 text-nowrap rounded transition-colors text-sm text-white hover:bg-white/10"
                onClick={() => scrollToCommentSection('comments')}
              >
                <img src="/icons/Comment.png" alt="Comment" className="h-6 w-6" />
                <span>Bình luận</span>
              </button>
              <button 
                className="w-full flex flex-col items-center justify-center gap-1 text-nowrap rounded transition-colors text-sm text-white hover:bg-white/10"
                onClick={() => setShowReviewPopup(true)}
              >
                <img src="/icons/Popular.png" alt="Review" className="h-6 w-6" />
                <span>Đánh giá</span>
              </button>
            </div>

            {/* Top Movies List */}
            <div className="mt-8">
              <ListTopMovies />
            </div>
          </div>
        </div>
      </div>

      {/* Message component */}
      {message && (
        <Message
          isVisible={true}
          message={message.text}
          type={message.type}
          onClose={clearMessage}
          autoClose={true}
          autoCloseDelay={3000}
          position="bottom-right"
        />
      )}

      {/* Auth Overlay */}
      <AuthBackground 
        isOpen={showAuthOverlay}
        onClose={() => setShowAuthOverlay(false)}
      />

      {/* Review Popup */}
      <ReviewPopup 
        isOpen={showReviewPopup}
        onClose={() => setShowReviewPopup(false)}
        movieId={movieId || ""}
        movieTitle={movie?.title}
        onOpenAuth={() => setShowAuthOverlay(true)}
      />

      <PageFooter />
    </div>
  );
}