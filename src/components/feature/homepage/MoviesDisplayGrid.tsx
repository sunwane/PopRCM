import { useRef } from "react";
import { LoadingEffect } from "@/components/ui/LoadingEffect";
import { Movie } from "@/types/Movies";
import { ExpandableButton } from "@/components/ui/ExpandableButton";
import MovieCard from "../movies/MovieCard";
import TopMoviesCard from "./TopMoviesCard";

export interface MoviesDisplayGridProps {
  title?: string;
  href?: string;
  moviesList?: Movie[];
  loading?: boolean;
  type?: 'default' | 'top';
}

export function MoviesDisplayGrid({ title, href, moviesList, loading, type = 'default' }: MoviesDisplayGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Chỉ drag khi click vào khoảng trống (không phải MovieCard)
    if ((e.target as HTMLElement).closest(".movie-card")) return;
    isDown = true;
    startX = e.pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeft = scrollRef.current?.scrollLeft || 0;
    document.body.style.cursor = "grabbing";
  };

  const handleMouseLeave = () => {
    isDown = false;
    document.body.style.cursor = "";
  };

  const handleMouseUp = () => {
    isDown = false;
    document.body.style.cursor = "";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = x - startX;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  if (loading) {
    return <LoadingEffect message="Đang tải..." />;
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-1">
        <div className="font-bold lg:text-xl md:text-xl sm:text-lg text-lg">{title}</div>
        {type === 'top' ? null : (
          <ExpandableButton href={href || ""} message="Xem tất cả" size="md"/>
        )}
      </div>
      <div
        className="w-full overflow-x-auto no-scrollbar select-none"
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ cursor: "grab" }}
      >
        {type === 'top' ? (
          <div className="flex flex-nowrap gap-x-6 py-2 px-1">
            {moviesList?.map((movie, idx) => (
              <TopMoviesCard key={movie.id} movie={movie} rank={idx + 1} />
            ))}
          </div>
        ) : (
          <div className="flex flex-nowrap gap-x-7 py-2.5 px-1">
          {moviesList?.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
      </div>
    </div>
  );
}