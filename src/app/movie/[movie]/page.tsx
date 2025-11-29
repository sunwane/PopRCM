"use client";
import { useParams } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import PageFooter from "@/components/layout/PageFooter";
import { LoadingPage } from "@/components/ui/LoadingPage";
import NotFoundDiv from "@/components/ui/NotFoundDiv";
import { useMoviesDataByID } from "@/hooks/useData/useMoviesData";

export default function MoviesPage() {
  const params = useParams();
  const movie = params.movie;

  const { movieInfo, loading } = useMoviesDataByID(movie?.toString() ?? "");

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
          <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-b from-(--background)/80 via-transparent to-(--background)"></div>
          
          {/* Title and Original Name - positioned at bottom-0 of hero image, next to poster */}
          <div className="absolute bottom-0 left-0 w-full lg:px-12 md:px-10 sm:px-6 px-6">
            <div className="flex lg:space-x-6 md:space-x-4 sm:space-x-3 space-x-3 items-end">
              {/* Poster placeholder to maintain spacing */}
              <div className="lg:w-[14vw] md:w-[14vw] sm:w-24 w-24"></div>
              
              {/* Movie Title Info */}
              <div className="text-white pb-4 flex-1">
                <h1 className="lg:text-4xl md:text-3xl sm:text-xl text-lg font-bold text-white mb-2">
                  {movieInfo.title} {movieInfo.releaseYear ? `(${movieInfo.releaseYear})` : ""}
                </h1>
                {movieInfo.originalName && (
                  <h2 className="lg:text-xl md:text-lg sm:text-sm text-sm text-(--text-secondary)">
                    {movieInfo.originalName}
                  </h2>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section - Below hero image */}
        <div className="relative lg:px-12 md:px-10 sm:px-6 px-6">
          {/* Main Layout: 2 Columns */}
          <div className="flex lg:gap-8 md:gap-6 sm:gap-4 gap-4 items-start">
            
            {/* Left Column: Poster + Movie Information */}
            <div className="flex lg:space-x-6 md:space-x-4 sm:space-x-3 space-x-3 items-start flex-1">
              {/* Poster - 1/3 overlapping hero image */}
              <img 
                src={movieInfo.posterUrl || "/placeholder/placeholder-poster.png"} 
                alt={movieInfo.title}
                onError={(e) => e.currentTarget.src = "/placeholder/placeholder-poster.png"}
                className="lg:w-[14vw] md:w-[14vw] sm:w-24 w-24 h-auto aspect-[2/3] object-cover rounded-md 
                shadow-lg lg:-mt-32 md:-mt-32 sm:-mt-20 -mt-20 flex-shrink-0"
              />
              
              {/* Movie Information - Next to poster */}
              <div className="flex-1 text-white pt-4">
                {/* Rating and Labels */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <div className="bg-yellow-500 text-black px-3 py-1 rounded font-bold text-sm">
                    TMDB 9.9
                  </div>
                  <div className="bg-orange-500 text-white px-3 py-1 rounded font-bold text-sm">
                    IMDB 9.9
                  </div>
                  <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                    Series
                  </div>
                  <div className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                    POPCORN 9.9
                  </div>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-gray-700 px-3 py-1 rounded text-sm">Hành động</span>
                  <span className="bg-gray-700 px-3 py-1 rounded text-sm">Drama</span>
                  <span className="bg-gray-700 px-3 py-1 rounded text-sm">Viễn tưởng</span>
                  <span className="bg-gray-700 px-3 py-1 rounded text-sm">Gay cấn</span>
                  <span className="bg-gray-700 px-3 py-1 rounded text-sm">Khoa học</span>
                </div>

                {/* Episode Info */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400">📺</span>
                    <span className="text-sm">Ongoing: 12 / 24 tập</span>
                  </div>
                  <div className="bg-orange-600 px-3 py-1 rounded text-sm">
                    2K lượt xem
                  </div>
                </div>

                {/* Movie Details */}
                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex flex-col sm:flex-row">
                    <span className="w-32 text-gray-400 font-semibold">Mô tả:</span>
                    <span className="flex-1">
                      Trò Chơi Ảo giác (TRON: Ares) theo chân Ares – một thực thể ảo có kỹ năng vượt 
                      trội từ thế giới ảo của Tron lọt vào thế giới thực một nhiệm vụ nguy hiểm đầm đầu 
                      trận đấu tiến gửi loài người và những thực thể trí tuệ nhân tạo.
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <span className="w-32 text-gray-400 font-semibold">Năm sản xuất:</span>
                    <span>{movieInfo.releaseYear || "2028"}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <span className="w-32 text-gray-400 font-semibold">Thời lượng:</span>
                    <span>1h 59p</span>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <span className="w-32 text-gray-400 font-semibold">Quốc gia:</span>
                    <span>Anh, Mỹ</span>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <span className="w-32 text-gray-400 font-semibold">Đạo diễn:</span>
                    <span>Joachim Ronning, Tom Struthers, Scott Rogers, Donald Sparks</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Action Buttons */}
            <div className="lg:w-64 md:w-56 sm:w-48 w-40 flex-shrink-0 pt-4">
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded transition-colors text-sm font-medium">
                  <span>👁️</span>
                  <span>Xem ngay</span>
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded transition-colors text-sm text-white">
                  <span>❤️</span>
                  <span>Yêu thích</span>
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded transition-colors text-sm text-white">
                  <span>⭐</span>
                  <span>Đánh giá</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <PageFooter />
    </div>
  );
}