import { useEffect, useState } from "react";
import MovieCard, { MovieCardSize, getMovieCardWidth } from "./MovieCard";
import Pagination from "@/components/ui/Pagination";
import { LoadingEffect } from "@/components/ui/LoadingEffect";
import NotFoundDiv from "@/components/ui/NotFoundDiv";
import { useResponsive } from "@/hooks/useResponsive";
import { Movie } from "@/types/Movies";

export interface MovieGridLayoutProps {
  filteredMovies: Movie[];
  loading?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  gapWidth?: number;
  cardSize?: MovieCardSize;
}

export default function MovieGridLayout({ 
  filteredMovies, 
  loading,
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPrevPage,
  gapWidth = 0,
  cardSize = 'medium',
}: MovieGridLayoutProps) {
  const [isAlignLeft, setIsAlignLeft] = useState(false);
  const [moviesPerRow, setMoviesPerRow] = useState(0);
  const { isMobile, isTablet, isDesktop } = useResponsive();

  useEffect(() => {
    const updateAlignment = () => {
      // Tính toán responsive dựa trên breakpoints
      let screenWidth = window.innerWidth - gapWidth;
      let movieWidth = getMovieCardWidth(cardSize);
      let gap = 16; // Khoảng cách giữa các phim (px)
      let padding = 32; // Padding của container
      
      // Điều chỉnh cho mobile
      if (isMobile) {
        // Trên mobile, sử dụng viewport width thay vì px
        screenWidth = window.innerWidth - padding;
        gap = 8;
        // Tính toán dựa trên vw cho mobile
        const vwWidth = cardSize === 'small' ? 0.36 : cardSize === 'medium' ? 0.40 : 0.44;
        movieWidth = screenWidth * vwWidth;
        const calculatedMoviesPerRow = Math.floor(screenWidth / (movieWidth + gap));
        setMoviesPerRow(calculatedMoviesPerRow);
        setIsAlignLeft(filteredMovies.length > 0 && filteredMovies.length < calculatedMoviesPerRow);
      } else if (isTablet) {
        // Tablet responsiveness
        screenWidth = window.innerWidth - padding;
        gap = 12;
        const calculatedMoviesPerRow = Math.floor(screenWidth / (movieWidth + gap));
        setMoviesPerRow(calculatedMoviesPerRow);
        setIsAlignLeft(filteredMovies.length > 0 && filteredMovies.length < calculatedMoviesPerRow);
      } else {
        // Desktop
        screenWidth = Math.min(screenWidth, 2000) - padding; // Max container width
        gap = 16;
        const calculatedMoviesPerRow = Math.floor(screenWidth / (movieWidth + gap));
        setMoviesPerRow(calculatedMoviesPerRow);
        setIsAlignLeft(filteredMovies.length > 0 && filteredMovies.length < calculatedMoviesPerRow);
      }
    };

    // Gọi hàm khi component mount
    updateAlignment();

    // Lắng nghe sự kiện resize để cập nhật
    window.addEventListener("resize", updateAlignment);

    // Cleanup sự kiện khi component unmount
    return () => {
      window.removeEventListener("resize", updateAlignment);
    };
  }, [filteredMovies, cardSize, gapWidth, isMobile, isTablet, isDesktop]);

  if (loading) {
    return (
      <LoadingEffect message="Đang tải dữ liệu phim..." />
    );
  }

  if (filteredMovies.length === 0) {
    return (
      <NotFoundDiv message="Không tìm thấy phim phù hợp." />
    );
  }

  // Dynamic grid class based on card size
  const getGridClass = () => {
    const sizes = {
      small: {
        desktop: 'lg:grid-cols-[repeat(auto-fit,minmax(152px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(152px,1fr))]',
        mobile: 'sm:grid-cols-[repeat(auto-fit,minmax(20vw,1fr))] grid-cols-[repeat(auto-fit,minmax(24vw,1fr))]'
      },
      medium: {
        desktop: 'lg:grid-cols-[repeat(auto-fit,minmax(168px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(168px,1fr))]',
        mobile: 'sm:grid-cols-[repeat(auto-fit,minmax(28vw,1fr))] grid-cols-[repeat(auto-fit,minmax(40vw,1fr))]'
      },
      large: {
        desktop: 'lg:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]',
        mobile: 'sm:grid-cols-[repeat(auto-fit,minmax(28vw,1fr))] grid-cols-[repeat(auto-fit,minmax(40vw,1fr))]'
      }
    };
    
    return `grid ${sizes[cardSize].desktop} ${sizes[cardSize].mobile} lg:gap-4 md:gap-4 sm:gap-3 gap-2 gap-y-6 justify-items-center`;
  };

  return (
    <div className="max-w-[2000px]">
      <div
        className={`${
          isAlignLeft ? "flex justify-start lg:gap-4 md:gap-4 sm:gap-3 gap-2 flex-wrap" 
          : getGridClass()
        }`}
      >
        {filteredMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} size={cardSize} />
        ))}
      </div>
      {totalPages && totalPages > 1 && onPageChange && (
        <div className="mt-8 mb-16">
          <Pagination 
            currentPage={currentPage || 1}
            totalPages={totalPages}
            onPageChange={onPageChange}
            hasNextPage={hasNextPage || false}
            hasPrevPage={hasPrevPage || false}
          />
        </div>
      )}
    </div>
  );
}