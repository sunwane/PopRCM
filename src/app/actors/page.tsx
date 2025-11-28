"use client";

import PageHeader from "@/components/layout/PageHeader";
import PageFooter from "@/components/layout/PageFooter";
import ActorGridLayout from "@/components/feature/actors/ActorGridLayout";
import { useActorPagination } from "@/hooks/usePagination/useActorPagination";

export default function ActorPage() {

  const {
    actors,
    loading,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    goToPage,
  } = useActorPagination({
  });

  return (
    <div className="max-w-[2000px]">
      <PageHeader />

      {/* Content */}
      <div className="mx-6">
        <div className="my-4">
        {/* {Tiêu đề} */}
          <h1 className="text-[21px] font-bold tracking-wide">
            Diễn viên
          </h1>
        </div>

        {/* {Diễn viên} */}
        <div className="mt-6">
          <ActorGridLayout 
            actors={actors} 
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