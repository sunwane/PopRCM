"use client";

import PageHeader from "@/components/layout/PageHeader";
import PageFooter from "@/components/layout/PageFooter";
import SeriesGridLayout from "@/components/feature/series/SeriesGridLayout";
import { useSeriesPagination } from "@/hooks/usePagination/useSeriesPagination";

export default function SeriesPage() {

  const {
    paginatedSeries,
    loading,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    goToPage,
  } = useSeriesPagination({ initialPage: 1, pageSize: 24 });

  return (
    <div className="max-w-[2000px]">
      <PageHeader />

      {/* Content */}
      <div className="mx-6">
        <div className="my-4">
        {/* {Tiêu đề} */}
          <h1 className="text-2xl font-bold tracking-wide">
            Danh sách Series
          </h1>
        </div>

        <div className="mt-6">
          <SeriesGridLayout 
            series={paginatedSeries}
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