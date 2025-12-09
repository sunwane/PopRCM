import { useEffect, useState } from "react";
import { LoadingEffect } from "@/components/ui/LoadingEffect";
import NotFoundDiv from "@/components/ui/NotFoundDiv";
import { Series } from "@/types/Series";
import OneSeries from "./OneSerie";
import Pagination from "@/components/ui/Pagination";

export interface SeriesGridLayoutProps {
  series: Series[];
  loading: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export default function SeriesGridLayout({ 
  series, 
  loading, 
  currentPage, 
  totalPages, 
  onPageChange, 
  hasNextPage, 
  hasPrevPage 
}: SeriesGridLayoutProps) {
  const [isAlignLeft, setIsAlignLeft] = useState(false);

  useEffect(() => {
    const updateAlignment = () => {
      const screenWidth = window.innerWidth;

      // Tính số lượng diễn viên có thể hiển thị trên một hàng
      const seriesWidth = 224; // Kích thước tối thiểu của mỗi diễn viên (px)
      const gap = 8; // Khoảng cách giữa các diễn viên (px)
      const seriessPerRow = Math.floor(screenWidth / (seriesWidth + gap));

      // Nếu số lượng diễn viên ít hơn số lượng diễn viên trên một hàng, căn trái
      setIsAlignLeft(series.length > 0 && series.length < seriessPerRow);
    };

    // Gọi hàm khi component mount
    updateAlignment();

    // Lắng nghe sự kiện resize để cập nhật
    window.addEventListener("resize", updateAlignment);

    // Cleanup sự kiện khi component unmount
    return () => {
      window.removeEventListener("resize", updateAlignment);
    };
  }, [series]);

  if (loading) {
    return <LoadingEffect message="Đang tải series..." />;
  }

  if (series.length === 0) {
    return <NotFoundDiv message="Không tìm thấy series nào." />;
  }

  return (
    <div>
      <div
        className={`${
          isAlignLeft
            ? "flex justify-start lg:gap-4 md:gap-4 sm:gap-3 gap-2 flex-wrap"
            : `grid lg:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] 
               md:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] 
               sm:grid-cols-[repeat(auto-fit,minmax(28vw,1fr))] 
               grid-cols-[repeat(auto-fit,minmax(40vw,1fr))]
               lg:gap-6 md:gap-6 sm:gap-4 gap-x-2 gap-y-4 justify-items-center`
        }`}
      >
        {series.map((serie) => (
          <OneSeries key={serie.id} serie={serie} />
        ))}
      </div>
        {totalPages && totalPages > 1 && onPageChange && (
          <div className="mt-8 mb-16">
            <Pagination 
              currentPage={currentPage || 1}
              totalPages={totalPages}
              onPageChange={onPageChange}
              hasNextPage={hasNextPage || false}
              hasPrevPage={hasPrevPage || false}
            />
          </div>
        )}
    </div>
  );
}