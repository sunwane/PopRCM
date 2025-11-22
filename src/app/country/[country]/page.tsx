"use client";

import { useEffect, useState, useMemo } from "react";
import MoviesFilter from "@/components/feature/movies/MoviesFilter";
import PageHeader from "@/components/layout/PageHeader";
import { useParams } from "next/navigation";
import { useFilterResults } from "@/hooks/useFilter";
import MovieGridLayout from "@/components/feature/movies/MoviesGridLayout";
import { useCountryData } from "@/hooks/useData/useCountryData";
import { Country } from "@/types/Country";

export default function CountryPage() {
  const params = useParams();
  const country = params.country as string;

  const { findCountryById, loading: countryLoading } = useCountryData();
  const [filtercountry, setFiltercountry] = useState<Country | null>(null);

  // Tìm country khi dữ liệu đã load
  useEffect(() => {
    if (!countryLoading && country) {
      const matchedcountry = findCountryById(country);
      setFiltercountry(matchedcountry);
    }
  }, [country, countryLoading, findCountryById]);

  // Gọi useFilterResults với countryIds thay vì country objects
  const result = useFilterResults(
    "",
    country, // countryId
    undefined,
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
            Phim {filtercountry ? filtercountry.name : "Không xác định"}
          </h1>
        </div>

        {/* {Bộ lọc} */}
        <MoviesFilter countryProps={filtercountry ? filtercountry.name : "Không xác định"} />

        {/* {Phim} */}
        <div className="mt-6">
          <MovieGridLayout filteredMovies={result.filteredMovies} />
        </div>
      </div>
    </div>
  );
}