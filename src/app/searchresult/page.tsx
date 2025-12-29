"use client";

import MoviesFilter from "@/components/feature/movies/MoviesFilter";
import PageHeader from "@/components/layout/PageHeader";
import { useSearchParams } from "next/navigation";
import { useMoviesPagination } from "@/hooks/usePagination/useMoviesPagination";
import MovieGridLayout from "@/components/feature/movies/MoviesGridLayout";
import PageFooter from "@/components/layout/PageFooter";
import { Suspense, useState } from "react";
import { LoadingPage } from "@/components/ui/LoadingPage";
import SearchTabs from "@/components/feature/search/SearchTabs";
import ActorGridLayout from "@/components/feature/actors/ActorGridLayout";
import { useActorSearch } from "@/hooks/useActorSearch";

export default function SearchResultPage() {
  return (
    <Suspense fallback={<div className="max-w-[2000px]"><LoadingPage /></div>}>
      <SearchResultPageContent />
    </Suspense>
  );
}

function SearchResultPageContent() {
  const params = useSearchParams();
  const query = params.get("query") || "";
  const [activeTab, setActiveTab] = useState<'movies' | 'actors'>('movies');

  // Hook cho tìm kiếm phim
  const {
    movies,
    loading: moviesLoading,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    goToPage,
    totalItems: totalMovies,
  } = useMoviesPagination({
    query,
  });

  // Hook cho tìm kiếm diễn viên
  const {
    actors,
    totalActors,
    loading: actorsLoading,
  } = useActorSearch(query);

  return (
    <div className="max-w-[2000px]">
      <PageHeader />

      {/* Content */}
      <div className="mx-6">
        <div className="my-4">
          {/* Tiêu đề */}
          <h1 className="text-2xl font-bold tracking-wide mb-4">
            Kết quả tìm kiếm cho "{query}"
          </h1>
          
          {/* Search Tabs */}
          <SearchTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            moviesCount={totalMovies}
            actorsCount={totalActors}
          />
        </div>

        {/* Tab Content */}
        {activeTab === 'movies' ? (
          <>
            {/* Bộ lọc chỉ hiển thị cho tab phim */}
            <MoviesFilter query={query} />

            {/* Danh sách phim */}
            <div className="mt-6">
              <MovieGridLayout 
                filteredMovies={movies} 
                loading={moviesLoading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
                hasNextPage={hasNextPage}
                hasPrevPage={hasPrevPage}
              />
            </div>
          </>
        ) : (
          /* Danh sách diễn viên (không có bộ lọc) */
          <div className="mt-6">
            <ActorGridLayout 
              actors={actors}
              loading={actorsLoading}
            />
          </div>
        )}
      </div>
      <PageFooter />
    </div>
  );
}