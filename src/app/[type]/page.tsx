"use client";

import MoviesFilter from "@/components/feature/movies/MoviesFilter";
import PageHeader from "@/components/layout/PageHeader";
import { useParams } from "next/navigation";
import { useFilterResults } from "@/hooks/useFilter";
import MovieGridLayout from "@/components/feature/movies/MoviesGridLayout";
import { getMovieTypesText } from "@/utils/getText";

export default function TypePage() {
  const params = useParams(); // Lấy dynamic route params
  const type = params.type; // Lấy giá trị của [type]

  const result = useFilterResults(
    "",
    undefined,
    undefined,
    type?.toString(),
    undefined,
    undefined,
    undefined,
    undefined,
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
          <h1 className="text-2xl uppercase font-extrabold tracking-wider">
            {getMovieTypesText(type?.toString() || "")}
          </h1>
        </div>

        {/* {Bộ lọc} */}
        <MoviesFilter typeProps={type?.toString()} />

        {/* {Phim} */}
        <div className="mt-6">
          <MovieGridLayout filteredMovies={result.filteredMovies} />
        </div>
      </div>
    </div>
  );
}