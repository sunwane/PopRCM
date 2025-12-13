'use client';
import ListHeroMovies from "@/components/feature/homepage/ListHeroMovies";
import { SeriesDisplayGrid } from "@/components/feature/homepage/SeriesDisplayGrid";
import PageFooter from "@/components/layout/PageFooter";
import PageHeader from "@/components/layout/PageHeader";
import { useHeroData, usePopularSeries } from "@/hooks/useData/useHomeData";
import { useMoviesFromGenreById } from "@/hooks/useData/useHomeData";
import { OneGenreMovies } from "@/components/feature/homepage/OneGenreMovies";
import { LoadingEffect } from "@/components/ui/LoadingEffect";
import { RankingSection } from "@/components/feature/homepage/RankingSection";

export default function Home() {
  const { heroMovies, isLoading: heroLoading } = useHeroData();
  const { seriesList, loading: seriesLoading } = usePopularSeries();
  const { movies: actionMovies, isLoading: actionLoading } = useMoviesFromGenreById('hanh-dong', 9);
  const { movies: horrorMovies, isLoading: horrorLoading } = useMoviesFromGenreById('kinh-di', 9);
  const { movies: romanceMovies, isLoading: romanceLoading } = useMoviesFromGenreById('tinh-cam', 9);

  return (
    <div className="max-w-[2000px]">
      <PageHeader />
      <main className="min-h-screen lg:-mt-20 md:-mt-20 sm:mt-0 mt-0">
        <ListHeroMovies 
          heroMovies={heroMovies}
          isLoading={heroLoading}
        />
        <div className="px-4 md:px-6 lg:px-8 mt-12 mb-12">
          <SeriesDisplayGrid seriesList={seriesList} loading={seriesLoading} />
        </div>
        <div className="px-4 md:px-6 lg:px-8 mt-12 mb-6">
          {actionLoading || horrorLoading || romanceLoading ? (
            <div className="p-8">
              <LoadingEffect message="Đang tải thể loại phim hot..." />
            </div>
          ) : (
            <div className="lg:p-8 md:p-8 sm:p-6 p-5 bg-linear-to-b from-(--surface) via-70% via-(--background) to-(--background) rounded-2xl">
              {/* Phim Hành động */}
              <OneGenreMovies
                title="Phim Hành động"
                movies={actionMovies}
                titleColor="text-gradient-orange"
                linkText="Xem tất cả"
                genreSlug="hanh-dong"
              />
        
              {/* Phim Kinh dị */}
              <OneGenreMovies
                title="Phim Kinh dị"
                movies={horrorMovies}
                titleColor="text-gradient-green"
                linkText="Xem tất cả"
                genreSlug="kinh-di"
              />
        
              {/* Phim Tình cảm */}
              <OneGenreMovies
                title="Phim Tình cảm"
                movies={romanceMovies}
                titleColor="text-gradient-pink"
                linkText="Xem tất cả"
                genreSlug="tinh-cam"
              />
          </div>
          )}
        </div>
        
        {/* Rankings Section */}
        <div className="px-4 sm:px-6 lg:px-8">
          <RankingSection />
        </div>
      </main>
      <PageFooter />
    </div>
  );
}
