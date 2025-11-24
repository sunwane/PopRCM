import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import Pagination from "@/components/ui/Pagination";
import { LoadingEffect } from "@/components/ui/LoadingEffect";
import NotFoundDiv from "@/components/ui/NotFoundDiv";

export interface MovieGridLayoutProps {
  filteredMovies: any[];
  loading?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export default function MovieGridLayout({ 
  filteredMovies, 
  loading,
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPrevPage
}: MovieGridLayoutProps) {
  const [isAlignLeft, setIsAlignLeft] = useState(false);

  useEffect(() => {
    const updateAlignment = () => {
      const screenWidth = window.innerWidth;

      // Tính số lượng phim có thể hiển thị trên một hàng
      const movieWidth = 180; // Kích thước tối thiểu của mỗi phim (px)
      const gap = 8; // Khoảng cách giữa các phim (px)
      const moviesPerRow = Math.floor(screenWidth / (movieWidth + gap));

      // Nếu số lượng phim ít hơn số lượng phim trên một hàng, căn trái
      setIsAlignLeft(filteredMovies.length > 0 && filteredMovies.length < moviesPerRow);
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
    <div>
      <div
        className={` ${
          isAlignLeft ? "flex gap-6 justify-start" 
          : `grid lg:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] 
          md:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] 
          sm:grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-y-6 justify-items-stretch`
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