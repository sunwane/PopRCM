"use client";

import PageHeader from "@/components/layout/PageHeader";
import { useParams } from "next/navigation";
import PageFooter from "@/components/layout/PageFooter";
import { LoadingPage } from "@/components/ui/LoadingPage";
import NotFoundDiv from "@/components/ui/NotFoundDiv";
import { use, useEffect } from "react";
import { useSeriesDataByID } from "@/hooks/useData/useSeriesData";
import { getStatusLabelColor } from "@/utils/getColorUtils";
import MovieGridLayout from "@/components/feature/movies/MoviesGridLayout";

export default function SeriePage() {
  const params = useParams();
  const serie = params.serie;

  const { serieInfo, loading, error } = useSeriesDataByID(serie?.toString() ?? "");

  if (loading) {
    return (
      <div className="max-w-[2000px]">
        <LoadingPage />
      </div>
    );
  }

  if (!serieInfo) {
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

      <div className="min-h-[60vh] lg:-mt-20 md:-mt-20">
        <div className="relative">
          <img 
            src={serieInfo.posterUrl || "/placeholder/placeholder-thumbnail.jpg"} 
            alt={serieInfo.name} 
            className="w-full lg:h-[90vh] md:h-[90vh] sm:h-[50vh] h-[50vh] object-center object-cover shadow-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder/placeholder-thumbnail.jpg";
            }}
          />

          {/* Overlay */}
          <div className="absolute bottom-0 left-0 w-full h-full bg-linear-to-b from-(--background)/70 via-transparent to-(--background)"></div>

          {/* Text Content */}
          <div className="absolute lg:bottom-8 lg:left-12 md:bottom-8 md:left-10 sm:bottom-6 sm:left-6
              bottom-6 left-6 text-white">
            <h1 className="lg:text-4xl md:text-3xl sm:text-2xl text-2xl font-bold lg:mb-3 md:mb-3 sm:mb-2 mb-2">{serieInfo.name}</h1>
            <div className="lg:text-[16px] md:text-[16px] sm:text-sm text-sm text-gray-400 
              flex items-center gap-3">
              <div className="py-1 px-2 font-black border-2 rounded-md">
                {serieInfo.releaseYear}
              </div>
              <div className="py-1 px-2 font-bold border-2 rounded-md text-(--hover)">
                {serieInfo.movieCount ?? 0} phim
              </div>
              <div className={`py-1 px-3 rounded-md ${getStatusLabelColor(serieInfo.status)}`}>
                {serieInfo.status}
              </div>
            </div>
          </div>

        </div>
        <div className="lg:px-12 md:px-10 sm:px-6 px-6 py-2">
          <h2 className="lg:text-2xl md:text-xl sm:text-lg text-lg font-bold mb-2">Mô tả</h2>
          <p className="text-(--text-secondary) lg:text-lg md:text[16px] sm:text-sm text-m leading-relaxed">
            {serieInfo.description || "Không có mô tả cho series này."}
          </p>
          <h2 className="lg:text-2xl md:text-xl sm:text-lg text-lg font-bold mb-3 lg:mt-8 md:mt-8 mt-6">Các phần phim</h2>
          <MovieGridLayout filteredMovies={serieInfo.movies ?? []} loading={loading} gapWidth={96} />
        </div>

      </div>
      
      <PageFooter />
    </div>
  );
}