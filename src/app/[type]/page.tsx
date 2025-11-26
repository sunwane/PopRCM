"use client";

import MoviesFilter from "@/components/feature/movies/MoviesFilter";
import PageHeader from "@/components/layout/PageHeader";
import { useParams } from "next/navigation";
import { useMoviesPagination } from "@/hooks/usePagination/useMoviesPagination";
import MovieGridLayout from "@/components/feature/movies/MoviesGridLayout";
import { getMovieTypesText } from "@/utils/getText";
import PageFooter from "@/components/layout/PageFooter";

export default function TypePage() {
  const params = useParams(); // Lấy dynamic route params
  const type = params.type; // Lấy giá trị của [type]

  const {
    movies,
    loading,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    goToPage,
  } = useMoviesPagination({
    type: type?.toString(),
  });

  return (
    <div className="max-w-[2000px]">
      <PageHeader />

      {/* Content */}
      <div className="mx-6">
        <div className="my-4">
        {/* {Tiêu đề} */}
          <h1 className="text-2xl uppercase font-extrabold tracking-wider">
            {getMovieTypesText(type?.toString() || "")}
          </h1>
        </div>

        {/* {Bộ lọc} */}
        <MoviesFilter typeProps={type?.toString()} />

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
      {/* Footer */}
      <div>
        <PageFooter />
      </div>
    </div>
  );
}