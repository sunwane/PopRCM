import { useState } from "react";
import { Movie } from "@/types/Movies";
import { RankPopup } from "./RankPopup";
import { RankingList } from "./RankingList";
import { LoadingEffect } from "@/components/ui/LoadingEffect";
import { useRankingsData } from "@/hooks/useData/useHomeData";

export function RankingSection() {
  const [popupState, setPopupState] = useState<{
    isOpen: boolean;
    movies: Movie[];
    title: string;
    icon: string;
    titleColor: string;
  }>({
    isOpen: false,
    movies: [],
    title: '',
    icon: '',
    titleColor: ''
  })

  const { rankings, isLoading } = useRankingsData();


  const openPopup = (movies: Movie[], title: string, icon: string, titleColor: string) => {
    setPopupState({
      isOpen: true,
      movies,
      title,
      icon,
      titleColor
    });
  };

  const closePopup = () => {
    setPopupState(prev => ({ ...prev, isOpen: false }));
  };

  if (isLoading) {
    return (
      <div className="bg-(--background) rounded-lg p-6">
        <LoadingEffect message="Đang tải bảng xếp hạng..." />
      </div>
    );
  }

  return (
    <div className="bg-(--background) rounded-lg">
      {/* Section Title */}
      <h2 className="lg:text-2xl md:text-2xl sm:text-xl text-lg font-black text-BXH mb-3 w-fit">
        BXH Tháng
      </h2>

      {/* Rankings Flex Scrollable */}
      <div
        className="
          flex 
          lg:flex-row flex-nowrap 
          gap-6 
          bg-(--surface)/20
          shadow-[1px_1px_8px_4px_var(--shadow-red)]
          px-6 
          border-2 border-(--border-blue) 
          rounded-lg 
          overflow-x-auto 
          no-scrollbar
          w-full
        "
      >
        <RankingList
          movies={rankings.topViewed}
          title="SÔI NỔI NHẤT"
          icon="/icons/Ranking.png"
          titleColor="text-fire"
          onShowMore={() => openPopup(rankings.topViewed, "SÔI NỔI NHẤT", "/icons/Ranking.png", "text-blue-400")}
          maxDisplay={5}
          containerClassName="flex-1 pr-6 py-6 border-r-2 border-(--border-blue) min-w-0"
        />
        <RankingList
          movies={rankings.topFavorites}
          title="YÊU THÍCH NHẤT"
          icon="/icons/Heart.png"
          titleColor="text-pink"
          onShowMore={() => openPopup(rankings.topFavorites, "YÊU THÍCH NHẤT", "/icons/Heart.png", "text-pink-400")}
          maxDisplay={5}
          containerClassName="flex-1 pr-6 py-6 border-r-2 border-(--border-blue) min-w-0"
        />
        <RankingList
          movies={rankings.topComments}
          title="XEM NHIỀU NHẤT"
          icon="/icons/Popular.png"
          titleColor="text-green"
          onShowMore={() => openPopup(rankings.topComments, "XEM NHIỀU NHẤT", "/icons/Popular.png", "text-green-400")}
          maxDisplay={5}
          containerClassName="flex-1 py-6 min-w-0"
        />
      </div>

      {/* Popup */}
      <RankPopup
        isOpen={popupState.isOpen}
        onClose={closePopup}
        movies={popupState.movies}
        title={popupState.title}
        icon={popupState.icon}
        titleColor={popupState.titleColor}
      />
    </div>
  );
}