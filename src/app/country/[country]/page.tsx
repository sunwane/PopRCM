"use client";

import { useEffect, useState} from "react";
import MoviesFilter from "@/components/feature/movies/MoviesFilter";
import PageHeader from "@/components/layout/PageHeader";
import { useParams } from "next/navigation";
import { usePagination } from "@/hooks/usePagination";
import MovieGridLayout from "@/components/feature/movies/MoviesGridLayout";
import { useCountryData } from "@/hooks/useData/useCountryData";
import { Country } from "@/types/Country";
import PageFooter from "@/components/layout/PageFooter";
import { LoadingPage } from "@/components/ui/LoadingPage";

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

  // Use pagination with filter
  const {
    movies,
    loading,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    goToPage,
  } = usePagination({
    countryId: country,
  });

  if (filtercountry === null) {
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
          <h1 className="text-2xl font-bold tracking-wide">
            Phim {filtercountry ? filtercountry.name : "Không xác định"}
          </h1>
        </div>

        {/* {Bộ lọc} */}
        <MoviesFilter countryProps={filtercountry ? filtercountry.id : ""} />

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