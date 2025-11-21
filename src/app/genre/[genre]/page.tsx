"use client";

import { useEffect, useState, useMemo } from "react";
import MoviesFilter from "@/components/feature/movies/MoviesFilter";
import PageHeader from "@/components/layout/PageHeader";
import { useParams } from "next/navigation";
import { useFilterResults } from "@/hooks/useFilter";
import MovieGridLayout from "@/components/feature/movies/MoviesGridLayout";
import { useGenreData } from "@/hooks/useGenreData";
import { Genre } from "@/types/Genres";

export default function TypePage() {
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

  // Gọi useFilterResults với genreIds thay vì Genre objects
  const result = useFilterResults(
    undefined, // countryId
    genreIds, // genreIds
    undefined, // type
    undefined, // language
    undefined, // year
    undefined, // status
    undefined, // sortBy
  );

  if (genreLoading) {
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
            Phim {filterGenre ? filterGenre.genresName : "Không xác định"}
          </h1>
        </div>

        {/* {Bộ lọc} */}
        <MoviesFilter genresProps={filterGenre ? [filterGenre.genresName] : []} />

        {/* {Phim} */}
        <div className="mt-6">
          <MovieGridLayout filteredMovies={result.filteredMovies} />
        </div>
      </div>
    </div>
  );
}