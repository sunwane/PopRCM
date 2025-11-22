import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";

export interface MovieGridLayoutProps {
  filteredMovies: any[];
}

export default function MovieGridLayout({ filteredMovies }: MovieGridLayoutProps) {
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

  if (filteredMovies.length === 0) {
    return (
      <p className="text-white text-center">Không tìm thấy phim phù hợp với bộ lọc.</p>
    );
  }

  return (
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
  );
}