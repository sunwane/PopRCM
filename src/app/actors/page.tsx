"use client";

import PageHeader from "@/components/layout/PageHeader";
import PageFooter from "@/components/layout/PageFooter";
import { useActorsData } from "@/hooks/useData/useActorsData";
import { LoadingEffect } from "@/components/ui/LoadingEffect";

export default function ActorPage() {

  const {allActors, loading} = useActorsData();

  if (loading) {
    return (
      <div className="max-w-[2000px]">
        <PageHeader />
        <LoadingEffect />
        <PageFooter />
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
            Diễn viên
          </h1>
        </div>

        {/* {Diễn viên} */}
        <div className="mt-6">

        </div>
      </div>
      <PageFooter />
    </div>
  );
}