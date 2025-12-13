"use client";
import { useParams } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import PageFooter from "@/components/layout/PageFooter";
import { LoadingPage } from "@/components/ui/LoadingPage";
import NotFoundDiv from "@/components/ui/NotFoundDiv";
import { useMoviesDataByID, useRecommendedMovies, useSeriesDataByMovieId } from "@/hooks/useData/useMoviesData";
import { DetailsTab } from "@/components/feature/movieDetails/DetailsTab";
import { Genre } from "@/types/Genres";
import { getStatusColor, getViewLabelColor } from "@/utils/getColorUtils";
import { getStatusText, getViewDisplayText } from "@/utils/getTextUtils";
import { ListTopMovies } from "@/components/feature/movieDetails/ListTopMovies";

export default function MoviesPage() {
  const params = useParams();
  const movie = params.movie;

  const { movieInfo, loading } = useMoviesDataByID(movie?.toString() ?? "");
  const { seriesInfo } = useSeriesDataByMovieId(movie?.toString() ?? "");
  const { recommendedMovies } = useRecommendedMovies(movie?.toString() || "");

  if (loading) {
    return (
      <div className="max-w-[2000px]">
        <LoadingPage />
      </div>
    );
  }

  if (!movieInfo) {
    return (
      <div className="max-w-[2000px]">
        <PageHeader />
        <NotFoundDiv message="Không tìm thấy phim" />
        <PageFooter />
      </div>
    );
  }

  return (
    <div className="max-w-[2000px]">
      <PageHeader />
      
      {/* Hero Section */}
      <div className="lg:-mt-20 md:-mt-20 mt-0">
        {/* Hero Image */}
        <div className="relative">
          <img 
            src={movieInfo.thumbnailUrl || "/placeholder/placeholder-thumbnail.jpg"} 
            alt={movieInfo.title}
            onError={(e) => e.currentTarget.src = "/placeholder/placeholder-thumbnail.jpg"}
            className="w-full max-w-[2000px] lg:h-[75vh] md:h-[75vh] sm:h-[50vh] h-[50vh] object-center object-cover"        
          />
          {/* Overlay */}
          <div className="absolute bottom-0 left-0 w-full h-full bg-linear-to-b from-(--background)/80 via-transparent to-(--background)"></div>
          
          {/* Title and Original Name - positioned at bottom-0 of hero image, next to poster */}
          <div className="absolute bottom-0 left-0 w-full lg:px-12 md:px-10 sm:px-6 px-6">
            <div className="flex lg:space-x-6 md:space-x-4 sm:space-x-3 space-x-3 items-end">
              {/* Poster placeholder to maintain spacing */}
              <div className="min-w-30 lg:w-[14vw] md:w-[14vw] sm:w-30 w-20"></div>
              
              {/* Movie Title Info */}
              <div className="text-white lg:pb-3 md:pb-3 sm:pb-2 pb-1 flex-1">
                <h1 className="lg:text-4xl md:text-3xl sm:text-2xl text-xl font-bold text-white lg:mb-1.5 md:mb-1 mb-0">
                  {movieInfo.title}
                </h1>
                {movieInfo.originalName && (
                  <h2 className="lg:text-xl md:text-lg sm:text-sm text-sm text-(--text-highlight)">
                    {movieInfo.originalName}
                  </h2>
                )}
              </div>

              {/* Action Buttons - placeholder to maintain spacing */}
              <div className="lg:w-86 md:w-72 sm:w-0 w-0 shrink-0 lg:-mt-20 md:-mt-16 sm:mt-0 mt-0"></div>
            </div>
          </div>
        </div>

        {/* Content Section - Below hero image */}
        <div className="relative lg:px-12 md:px-10 sm:px-6 px-6">
          {/* Main Layout: 2 Columns */}
          <div className="flex lg:gap-10 md:gap-8 sm:gap-6 gap-4 lg:flex-row md:flex-row flex-col items-start">
            <div className="flex-1">
              {/* Left Column: Poster + Movie Information */}
              <div className="relative flex lg:space-x-6 md:space-x-4 sm:space-x-3 space-x-3 items-start flex-1">
              {/* Poster - 1/3 overlapping hero image */}
                <div className="relative">
                  <img 
                  src={movieInfo.posterUrl || "/placeholder/placeholder-poster.png"} 
                  alt={movieInfo.title}
                  onError={(e) => e.currentTarget.src = "/placeholder/placeholder-poster.png"}
                  className="min-w-30 lg:w-[14vw] md:w-[14vw] sm:w-30 w-20 h-auto aspect-2/3 object-cover rounded-md 
                  shadow-lg lg:-mt-30 md:-mt-26 sm:-mt-18 -mt-18 shrink-0"
                />
                
                {/* Nút nằm giữa poster */}
                <div 
                  className="flex items-center space-x-2 absolute left-1/2 transform -translate-x-1/2 translate-y-1/2 
                  bg-linear-to-b from-(--gradient-secondary-start) to-(--gradient-secondary-end)
                  text-white lg:px-6 lg:py-2.5 md:px-5 md:py-2 sm:px-4 sm:py-1.5 px-4 py-1.5 
                  rounded-lg shadow-lg cursor-pointer lg:-mt-10 md:-mt-8 sm:-mt-6 -mt-6 
                  hover:bg-linear-to-b hover:from-blue-500 hover:to-blue-800 transition w-fit justify-center"
                  onClick={() => {
                    console.log("Xem trailer clicked");
                  }}
                >
                  <img src="/icons/Play.png" alt="Play" className="lg:w-5 lg:h-5 md:h-4 md:w-4 sm:w-3 sm:h-3 w-3 h-3" />
                  <div className="text-nowrap uppercase font-bold lg:text-sm md:text-sm sm:text-xs text-[10px]">Xem Trailer</div>
                </div>
              </div>
                
                {/* Movie Information - Next to poster */}
                <div className="flex-1 text-white pt-2">
                  {/* Rating and Labels */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {movieInfo.tmdbScore && (
                      <div className="flex items-center space-x-1.5 border-2 border-blue-500 bg-blue-500/30 text-white px-2.5 py-1.5 rounded-lg">
                        <div className="font-bold lg:text-[13px] md:text-[13px] text-[11px] text-blue-500">TMDB</div> 
                        <div className="font-bold lg:text-sm md:text-sm text-xs">
                          {movieInfo.tmdbScore.toFixed(1)}
                        </div>
                      </div>
                    )}
                    {movieInfo.imdbScore && (
                      <div className="flex items-center space-x-1.5 border-2 border-yellow-500 bg-yellow-500/30 text-white px-2.5 py-1.5 rounded-lg">
                        <div className="font-bold lg:text-[13px] md:text-[13px] text-[11px] text-yellow-500">TMDB</div> 
                        <div className="font-bold lg:text-sm md:text-sm text-xs">
                          {movieInfo.imdbScore.toFixed(1)}
                        </div>
                      </div>
                    )}
                    <div className="capitalize bg-(--primary) px-2.5 py-2 border-2 border-(--primary) rounded-lg font-bold tracking-wide text-black lg:text-sm md:text-sm text-xs">
                      {movieInfo.type}
                    </div>
                    {movieInfo.PopRating && (
                      <div className="flex items-center space-x-1.5 border-2 border-blue-500 bg-blue-500/10 text-white px-2.5 py-1.5 rounded-lg">
                        <div className="font-bold lg:text-[13px] md:text-[13px] text-[11px]">TMDB</div> 
                        <div className="font-bold text-(--hover) lg:text-sm md:text-sm text-xs">
                          {movieInfo.PopRating.toFixed(1)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-2 mb-2.5">
                      {movieInfo.genres && movieInfo.genres.map((genre: Genre) => (
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
                    <div className={`flex items-center gap-1 rounded-md px-2.5 py-2 ${getStatusColor(movieInfo.status || "")}`}>
                      {movieInfo.status === "ongoing" && (
                        <div className="status-ongoing"></div>
                      )}
                      {movieInfo.status === "completed" && (
                        <div className="status-completed"></div>
                      )}
                      {movieInfo.status === "trailer" && (
                        <div className="status-trailer"></div>
                      )}
                      <span className="text-sm">{getStatusText(movieInfo.status)}: {movieInfo.currentEpisode} / {movieInfo.totalEpisodes || "?"} tập</span>
                    </div>
                    <div className={`px-2.5 py-1.5 rounded text-sm tracking-wide flex items-center space-x-1 ${getViewLabelColor(movieInfo.view || 0)}`}>
                      <div className="font-black">{getViewDisplayText(movieInfo.view || 0)}</div>
                      <div className="text-xs font-medium">lượt xem</div>
                    </div>
                  </div>

                  {/* Movie Details */}
                  <div className="space-y-2 mb-6 text-sm">
                    <div className="flex flex-col gap-1.5 mb-4">
                      <span className="text-white font-semibold">Mô tả:</span>
                      <span className="text-gray-400">
                        {movieInfo.description || "Đang cập nhật mô tả cho phim này."}
                      </span>
                    </div>
                    <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-2.5 mb-3">
                      <div className="flex gap-2">
                        <span className="text-white font-semibold text-nowrap">Năm sản xuất:</span>
                        <span className="text-gray-400">{movieInfo.releaseYear || "Unknown"}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-white font-semibold text-nowrap">Thời lượng:</span>
                        <span className="text-gray-400">{movieInfo.duration || "NaN"}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-white font-semibold text-nowrap">Quốc gia:</span>
                        <span className="text-gray-400">
                          {movieInfo.country && movieInfo.country.length > 0
                            ? movieInfo.country.map((c) => c.name).join(', ')
                            : 'Không rõ'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-white font-semibold text-nowrap">Đạo diễn:</span>
                        <span className="text-gray-400">{movieInfo.director}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Movies */}
              <div className="mb-6 mt-6">
                <DetailsTab movieInfo={movieInfo} seriesInfo={seriesInfo ?? undefined} recommendations={recommendedMovies} />
              </div>
            </div>

            {/* Right Column: Action Buttons */}
            <div className="lg:w-86 md:w-72 sm:w-full w-full shrink-0 lg:-mt-20 md:-mt-16 sm:mt-0 mt-0">

              <div className="grid grid-cols-3 lg:bg-white/10 md:bg-white/10 py-3 px-4 rounded-lg border-2 border-white/50 shadow-lg">
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
              
              {/* Actors Section */}
              <div className="relative mt-10 border-2 border-white/50 rounded-lg py-4 px-2.5 shadow-lg">
                <h3 className="text-white font-bold mb-3 -mt-7 bg-(--background) w-fit px-1">Diễn viên</h3>
                {movieInfo.actors && movieInfo.actors.length > 0 && (
                  <div>
                    <div className="grid grid-cols-3 gap-2 px-1">
                      {movieInfo.actors.map((ma, index) => (
                        <div key={index} className="flex flex-col items-center text-center">
                          {ma.actor?.profilePath || ma.profilePath ? (
                            <img
                              src={ma.actor?.profilePath || ma.profilePath}
                              alt={ma.actor?.originName || ma.originName}
                              onError={(e) => {
                                e.currentTarget.style.display = "none"; // Ẩn ảnh khi lỗi
                                e.currentTarget.parentElement?.querySelector(".no-avatar")?.classList.remove("hidden"); // Hiển thị div thay thế
                              }}
                              className="w-16 h-16 object-cover rounded-full mb-2"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gray-500 flex items-center justify-center text-white text-xs font-bold">
                              No Avatar
                            </div>
                          )}
                          <div className="hidden no-avatar">
                            <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 text-[10px] font-bold mb-2">
                              No Avatar
                            </div>
                          </div>
                          <span className="text-white text-xs font-medium mb-0.5">{ma.originName || ma.actor?.originName}</span>
                          <span className="text-gray-400 text-[10px] mb-2">{ma.characterName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {movieInfo.actors.length === 0 && (
                  <div className="px-3 text-sm text-gray-400 text-center">Không có thông tin diễn viên.</div>
                )}
              </div>
                
              {/* Top Movies */}
              <div className="mt-10">
                <ListTopMovies />
              </div>
            </div>
          </div>
        </div>
      </div>

      <PageFooter />
    </div>
  );
}