import { useEffect, useState } from "react";
import { LoadingEffect } from "@/components/ui/LoadingEffect";
import NotFoundDiv from "@/components/ui/NotFoundDiv";
import { Actor } from "@/types/Actor";
import OneActor from "./OneActor";
import Pagination from "@/components/ui/Pagination";
import { useResponsive } from "@/hooks/useResponsive";

export interface ActorGridLayoutProps {
  actors: Actor[];
  loading: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export default function ActorGridLayout({ 
  actors, 
  loading, 
  currentPage, 
  totalPages, 
  onPageChange, 
  hasNextPage, 
  hasPrevPage 
}: ActorGridLayoutProps) {
  const [isAlignLeft, setIsAlignLeft] = useState(false);
  const {isMobile, isTablet} = useResponsive();

  useEffect(() => {
    const updateAlignment = () => {
      const screenWidth = window.innerWidth;

      // Tính số lượng diễn viên có thể hiển thị trên một hàng
      const actorWidth = 180; // Kích thước tối thiểu của mỗi diễn viên (px)
      const gap = 8; // Khoảng cách giữa các diễn viên (px)
      const actorsPerRow = isMobile? 2 : Math.floor(screenWidth / (actorWidth + gap));

      // Nếu số lượng diễn viên ít hơn số lượng diễn viên trên một hàng, căn trái
      setIsAlignLeft(actors.length > 0 && actors.length < actorsPerRow);
    };

    // Gọi hàm khi component mount
    updateAlignment();

    // Lắng nghe sự kiện resize để cập nhật
    window.addEventListener("resize", updateAlignment);

    // Cleanup sự kiện khi component unmount
    return () => {
      window.removeEventListener("resize", updateAlignment);
    };
  }, [actors]);

  if (loading) {
    return <LoadingEffect message="Đang tải diễn viên..." />;
  }

  if (actors.length === 0) {
    return <NotFoundDiv message="Không tìm thấy diễn viên nào." />;
  }

  return (
    <div>
      <div
        className={`${
          isAlignLeft
            ? "flex gap-6 justify-start"
            : `grid lg:grid-cols-[repeat(auto-fit,minmax(160px,1fr))] 
               md:grid-cols-[repeat(auto-fit,minmax(160px,1fr))] 
               sm:grid-cols-[repeat(auto-fit,minmax(28vw,1fr))]
               grid-cols-[repeat(auto-fit,minmax(40vw,1fr))] lg:gap-6 md:gap-6 sm:gap-4 gap-2 gap-y-4 justify-items-center`
        }`}
      >
        {actors.map((actor) => (
          <OneActor key={actor.id} actor={actor} />
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