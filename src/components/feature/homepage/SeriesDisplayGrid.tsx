import { LoadingEffect } from "@/components/ui/LoadingEffect";
import { Series } from "@/types/Series";
import SeriesGridLayout from "../series/SeriesGridLayout";
import { ExpandableButton } from "@/components/ui/ExpandableButton";

export interface SeriesDisplayGridProps {
  seriesList?: Series[];
  loading?: boolean;
}

export function SeriesDisplayGrid({ seriesList, loading }: SeriesDisplayGridProps) {

  if(loading){
    return (
      <LoadingEffect message="Đang tải..." />
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="font-bold lg:text-lg md:text-lg sm:text-base text-base">Các series nổi bật</div>
        <ExpandableButton href="/allSeries" message="Xem tất cả" size="sm"/>
      </div>
      <SeriesGridLayout series={seriesList || []} loading={loading || false} />
    </div>
  );
}