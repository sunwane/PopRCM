import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
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
}: MovieGridLayoutProps) {
  const [isAlignLeft, setIsAlignLeft] = useState(false);
  const { isMobile } = useResponsive();

  useEffect(() => {
    const updateAlignment = () => {
      if (!isMobile) {
        // Tính số lượng phim có thể hiển thị trên một hàng
        const screenWidth = window.innerWidth - gapWidth;
        const movieWidth = 168; // Kích thước tối thiểu của mỗi phim (px)
        const gap = 4; // Khoảng cách giữa các phim (px)
        const moviesPerRow = Math.floor(screenWidth / (movieWidth + gap));
        // Nếu số lượng phim ít hơn số lượng phim trên một hàng, căn trái
        setIsAlignLeft(filteredMovies.length > 0 && filteredMovies.length < moviesPerRow);
      } else if (isMobile) {
        console.log("Filtered Movies Length:", filteredMovies.length);
        setIsAlignLeft(filteredMovies.length < 2);
      } else {
        setIsAlignLeft(false);
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
  }, [filteredMovies]);

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

  return (
    <div className="max-w-[2000px]">
      <div
        className={`${
          isAlignLeft ? "flex justify-start gap-6 flex-wrap" 
          : `grid lg:grid-cols-[repeat(auto-fit,minmax(168px,1fr))] 
          md:grid-cols-[repeat(auto-fit,minmax(168px,1fr))] 
          sm:grid-cols-[repeat(auto-fit,minmax(28vw,1fr))] 
          grid-cols-[repeat(auto-fit,minmax(40vw,1fr))] 
          lg:gap-4 md:gap-4 sm:gap-4 gap-2 gap-y-6 justify-items-center`
        }`}
      >
        {filteredMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
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