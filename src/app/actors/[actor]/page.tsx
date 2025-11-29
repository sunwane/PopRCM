"use client";

import PageHeader from "@/components/layout/PageHeader";
import { useParams } from "next/navigation";
import PageFooter from "@/components/layout/PageFooter";
import { useActorDataByID } from "@/hooks/useData/useActorsData";
import { LoadingPage } from "@/components/ui/LoadingPage";
import NotFoundDiv from "@/components/ui/NotFoundDiv";
import { getGenderText } from "@/utils/getTextUtils";
import MovieGridLayout from "@/components/feature/movies/MoviesGridLayout";
import MoviesByYear from "@/components/feature/movies/MoviesByYear";
import ToggleButton from "@/components/ui/ToggleButton";
import { useState } from "react";

export default function ActorPage() {
  const params = useParams();
  const actor = params.actor;
  const [imageError, setImageError] = useState(false);
  const [activeTab, setActiveTab] = useState<'grid' | 'timeline'>('grid');

  const {
    actor: actorInfo, 
    movies, 
    moviesByYear, 
    sortedYears, 
    movieStats,
    loading
  } = useActorDataByID(actor?.toString() || "");

  const handleToggle = () => {
    setActiveTab(activeTab === 'grid' ? 'timeline' : 'grid');
  };

  if (loading) {
    return (
      <div className="max-w-[2000px]">
        <LoadingPage />
      </div>
    );
  }

  if (!actorInfo) {
    return (
      <div className="max-w-[2000px]">
        <PageHeader />
        <NotFoundDiv message="Không tìm thấy diễn viên" />
        <PageFooter />
      </div>
    );
  }

  return (
    <div className="max-w-[2000px]">
      <PageHeader />
      <div className="lg:flex lg:flex-row md:flex md:flex-row sm:flex sm:flex-col
      flex flex-col items-center lg:items-start md:items-start sm:items-center 
      pb-6 pt-2 mx-4">
        <div className="p-4 lg:max-w-[30vw] lg:min-w-[250px] lg:w-1/5 md:w-1/5 md:max-w-[300px] md:min-w-[250px]
          w-full flex flex-col items-center lg:items-start
          lg:border-b-0 lg:pr-6 md:border-b-0 md:pr-6 sm:border-b-2 sm:pb-10 
          border-gray-800">
          <div className="mb-3">
            {imageError ? (
              <div className="w-32 h-32 flex items-center justify-center bg-gray-800 rounded-2xl">
                <span className="text-[16px] text-gray-500">No Avatar</span>
              </div>
            ) : (
              <img
                src={actorInfo.profilePath}
                alt={actorInfo.originName}
                className="w-32 h-32 object-cover rounded-2xl"
                onError={() => setImageError(true)}
              />
            )}
          </div>
          <p className="text-2xl font-bold mb-5">{actorInfo.originName}</p>

          <div className="text-(--text-primary) space-y-2 text-sm px-1">
            <div className="flex space-x-2">
              <strong>TMDB ID:</strong>
              <div className="text-gray-400">{actorInfo.tmdbId || "Không rõ"}</div>
            </div>
            <div className="flex space-x-2">
              <strong>Giới tính:</strong>
              <div className="text-gray-400">{getGenderText(actorInfo.gender)}</div>
            </div>
            <div className="flex space-x-2">
              <strong>Tổng phim:</strong>
              <div className="text-gray-400">{movieStats.totalMovies} phim</div>
            </div>
            <div><strong>Tên khác:</strong></div>
            <ul className="list-disc pl-5">
              {actorInfo.alsoKnownAs?.map((name, index) => (
                <li key={index} className="text-gray-400 mb-0.5">
                  {name}
                </li>
              )) || <li>N/A</li>}
            </ul>
          </div>
        </div>

        <div className="mt-4 lg:mt-0 lg:pl-6 md:pl-6 md:mt-0 sm:pl-0 w-full 
          lg:w-4/5 md:w-4/5 sm:w-full lg:border-l-2 lg:border-b-2 border-gray-800 lg:pb-6 rounded-lg">
          <div className="flex items-center justify-between mb-6 sm:pt-4">
            <h2 className="lg:text-xl md:text-[16px] text-[16px] font-semibold">
              Các phim đã tham gia 
              <span className=" text-gray-500 ml-1.5">({movieStats.totalMovies})</span>
            </h2>
            
            <ToggleButton
              isActive={activeTab === 'timeline'}
              onToggle={handleToggle}
              leftLabel="Tất cả"
              rightLabel="Theo năm"
            />
          </div>

          {/* Content dựa theo tab được chọn */}
          {activeTab === 'grid' ? (
            <MovieGridLayout filteredMovies={movies} gapWidth={ window.innerWidth * 0.8 + 20} loading={loading} />
          ) : (
            <MoviesByYear moviesByYear={moviesByYear} sortedYears={sortedYears} />
          )}
        </div>
      </div>
      <PageFooter />
    </div>
  );
}