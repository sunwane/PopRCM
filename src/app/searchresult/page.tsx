"use client";

import MoviesFilter from "@/components/feature/movies/MoviesFilter";
import PageHeader from "@/components/layout/PageHeader";
import { useSearchParams } from "next/navigation";
import { useFilterResults } from "@/hooks/useFilter";
import MovieGridLayout from "@/components/feature/movies/MoviesGridLayout";

export default function SearchResultPage() {
  const params = useSearchParams();
  const query = params.get("query") || "";

  // Gọi useFilterResults với genreIds thay vì Genre objects
  const result = useFilterResults(
    query,
    undefined, // countryId
    undefined, // genreIds
    undefined, // type
    undefined, // language
    undefined, // year
    undefined, // status
    undefined, // sortBy
  );

  if (result.loading) {
    return <div className="text-center text-white">Đang tải...</div>;
  }

  return (
    <div className="max-w-[2000px]">
      <PageHeader />

      {/* Content */}
      <div className="mx-6">
        <div className="my-4">
        {/* {Tiêu đề} */}
          <h1 className="text-2xl font-bold tracking-wide">
            Kết quả tìm kiếm cho "{query}"
          </h1>
        </div>

        {/* {Bộ lọc} */}
        <MoviesFilter query={query} />

        {/* {Phim} */}
        <div className="mt-6">
          <MovieGridLayout filteredMovies={result.filteredMovies} />
        </div>
      </div>
    </div>
  );
}