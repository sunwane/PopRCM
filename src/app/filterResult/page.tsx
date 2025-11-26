"use client";

import MoviesFilter from "@/components/feature/movies/MoviesFilter";
import PageHeader from "@/components/layout/PageHeader";
import { useSearchParams } from "next/navigation";
import { useMoviesPagination } from "@/hooks/usePagination/useMoviesPagination";
import MovieGridLayout from "@/components/feature/movies/MoviesGridLayout";
import PageFooter from "@/components/layout/PageFooter";

export default function SearchResultPage() {
  const params = useSearchParams();
  const query = params.get("query") || "";
  const countryId = params.get("country") || undefined;
  const genreIdsParam = params.get("genres") || undefined;
  const genreIds = genreIdsParam ? genreIdsParam.split(",") : undefined;
  const type = params.get("type") || undefined;
  const language = params.get("language") || undefined;
  const year = params.get("year") || undefined;
  const status = params.get("status") || undefined;
  const sortBy = params.get("sortBy") || undefined;

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
    query,
    countryId,
    genreIds,
    type,
    language,
    year,
    status,
    sortBy,
  });

  return (
    <div className="max-w-[2000px]">
      <PageHeader />

      {/* Content */}
      <div className="mx-6">
        <div className="my-4">
        {/* {Tiêu đề} */}
          <h1 className="text-2xl font-bold tracking-wide">
            Kết quả lọc {query? `với từ khóa "${query}"` : ""}
          </h1>
        </div>

        {/* {Bộ lọc} */}
        <MoviesFilter query={query} countryProps={countryId} genresProps={genreIds} typeProps={type}
          languageProps={language} statusProps={status} sortByProps={sortBy} active={true}/>

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