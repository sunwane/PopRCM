"use client";
import { useEpisodeData, useMovieByEpisodeId, useEpisodesByMovieId } from "@/hooks/useData/useEpisodeData";
import { useParams } from "next/navigation";
import { PlayList } from "@/components/feature/watch/PlayList";
import { Episode } from "@/types/Movies";
import PageHeader from "@/components/layout/PageHeader";
import PageFooter from "@/components/layout/PageFooter";
import { ListTopMovies } from "@/components/feature/movieDetails/ListTopMovies";
import { useResponsive } from "@/hooks/useResponsive";
import { DetailsTab } from "@/components/feature/movieDetails/DetailsTab";
import { useRecommendedMovies, useSeriesDataByMovieId } from "@/hooks/useData/useMoviesData";
import { Genre } from "@/types/Genres";
import { getStatusText, getViewDisplayText } from "@/utils/getTextUtils";
import { getStatusColor, getViewLabelColor } from "@/utils/getColorUtils";

export default function WatchPage() {
  const params = useParams();
  const episode = params.episode;

  const { movie, loading } = useMovieByEpisodeId(episode?.toString() || '');
  const { episode: episodeData, loading: episodesLoading } = useEpisodeData(episode?.toString() || '');
  const { episodes, loading: episodesListLoading } = useEpisodesByMovieId(movie?.id || null);
  const { seriesInfo } = useSeriesDataByMovieId(movie?.toString() ?? "");
  const { recommendedMovies } = useRecommendedMovies(movie?.toString() || "");

  const { isMobile } = useResponsive();

  const handleEpisodeSelect = (selectedEpisode: Episode, serverName?: string) => {
    // Navigate to the selected episode with optional server parameter
    const url = serverName 
      ? `/watch/${selectedEpisode.id}?server=${encodeURIComponent(serverName)}`
      : `/watch/${selectedEpisode.id}`;
    window.location.href = url;
  };

  if (loading || episodesLoading || episodesListLoading) {
    return (
      <div className="min-h-screen bg-(--background) flex items-center justify-center">
        <div className="text-white">Đang tải...</div>
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
      <div className="py-4 px-6 w-full">
        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row md:flex-row gap-6 w-full">
          
          {/* Left Side - Video Player */}
          <div className="grow">
            {/* Video Player */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
              <video 
                className="w-full h-full"
                controls
                poster="/placeholder/video-thumbnail.jpg"
              >
                <source src={episodeData.m3u8Url} type="video/mp4" />
              </video>
            </div>

            {/* Movie Info */}
            <div className="grid grid-cols-2 gap-6 px-4">
              <div>
                <h1 className="text-2xl font-bold text-white">{movie.title}</h1>
                <p className="text-gray-300 mb-4">Đang xem: {episodeData.title}</p>
                
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
                <div className="font-light text-gray-400 text-[15px] leading-7">{movie.description}</div>
                <button className="flex gap-1 items-center mt-4">
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
              <DetailsTab movieInfo={movie} seriesInfo={seriesInfo ?? undefined} recommendations={recommendedMovies} />
            </div>
          </div>

          {/* Right Side - Playlist */}
          <div className="w-96">
            {isMobile ? null : (
              <PlayList
                movie={movie}
                episodes={episodes}
                currentEpisode={episodeData}
                onEpisodeSelect={handleEpisodeSelect}
              />
            )}

            <div className="grid grid-cols-3 py-3 px-4 rounded-lg border-2 border-(--surface-divine) shadow-lg mt-6">
              <button className="w-full flex flex-col items-center justify-center gap-1 text-nowrap rounded transition-colors text-sm text-white">
                <img src="/icons/CircledPlay.png" alt="Play" className="h-7 w-7 -m-0.5" />
                <span>Xem ngay</span>
              </button>
              <button className="w-full flex flex-col items-center justify-center gap-1 text-nowrap rounded transition-colors text-sm text-white">
                <img src="/icons/Heart.png" alt="Heart" className="h-6 w-6" />
                <span>Yêu thích</span>
              </button>
              <button className="w-full flex flex-col items-center justify-center gap-1 text-nowrap rounded transition-colors text-sm text-white">
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
      <PageFooter />
    </div>
  );
}