'use client';

import HotGenresMoviesList from "@/components/feature/homepage/HotGenresMoviesList";
import ListHeroMovies from "@/components/feature/homepage/ListHeroMovies";
import { SeriesDisplayGrid } from "@/components/feature/homepage/SeriesDisplayGrid";
import PageFooter from "@/components/layout/PageFooter";
import PageHeader from "@/components/layout/PageHeader";
import { useHeroData, usePopularSeries } from "@/hooks/useData/useHomeData";

export default function Home() {
  const { heroMovies, isLoading: heroLoading } = useHeroData();
  const { seriesList, loading: seriesLoading } = usePopularSeries();

  return (
    <div className="max-w-[2000px]">
      <PageHeader />
      <main className="min-h-screen lg:-mt-20 md:-mt-20 sm:mt-0 mt-0">
        <ListHeroMovies 
          heroMovies={heroMovies}
          isLoading={heroLoading}
        />
        <div className="px-4 sm:px-6 lg:px-8 mt-12 mb-12">
          <SeriesDisplayGrid seriesList={seriesList} loading={seriesLoading} />
        </div>
        <div className="px-4 sm:px-6 lg:px-8 mt-12 mb-12">
          <HotGenresMoviesList />
        </div>
      </main>
      <PageFooter />
    </div>
  );
}
