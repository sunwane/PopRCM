"use client";

import { useEffect, useState, useMemo } from "react";
import MoviesFilter from "@/components/feature/movies/MoviesFilter";
import PageHeader from "@/components/layout/PageHeader";
import { useParams } from "next/navigation";
import { useMoviesPagination } from "@/hooks/usePagination/useMoviesPagination";
import MovieGridLayout from "@/components/feature/movies/MoviesGridLayout";
import { useGenreData } from "@/hooks/useData/useGenreData";
import { Genre } from "@/types/Genres";
import PageFooter from "@/components/layout/PageFooter";
import { LoadingPage } from "@/components/ui/LoadingPage";

export default function GenrePage() {
  const params = useParams();
  const genre = params.genre as string;

  const { findGenreById, loading: genreLoading } = useGenreData();
  const [filterGenre, setFilterGenre] = useState<Genre | null>(null);

  // Tìm genre khi dữ liệu đã load
  useEffect(() => {
    if (!genreLoading && genre) {
      const matchedGenre = findGenreById(genre);
      setFilterGenre(matchedGenre);
    }
  }, [genre, genreLoading, findGenreById]);

  // Memoize genreIds để tránh tạo mảng mới mỗi lần render
  const genreIds = useMemo(() => {
    return filterGenre ? [filterGenre.id] : undefined;
  }, [filterGenre?.id]);

  // Use pagination with filter
  const {
    movies,
    loading,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    goToPage,
  } = useMoviesPagination({
    genreIds,
  });

  if (filterGenre === null) {
    return (
      <div className="max-w-[2000px]">
        <LoadingPage />
      </div>
    );
  }

  return (
    <div className="max-w-[2000px]">
      <PageHeader />

      {/* Content */}
      <div className="mx-6">
        <div className="my-4">
        {/* {Tiêu đề} */}
          <h1 className="text-[21px] font-bold tracking-wide">
            Phim {filterGenre ? filterGenre.genresName : "Không xác định"}
          </h1>
        </div>

        {/* {Bộ lọc} */}
        <MoviesFilter genresProps={filterGenre ? [filterGenre.id] : ["all"]} />

        {/* {Phim} */}
        <div className="mt-6">
          <MovieGridLayout 
            filteredMovies={movies} 
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
          />
        </div>
      </div>
      <PageFooter />
    </div>
  );
}