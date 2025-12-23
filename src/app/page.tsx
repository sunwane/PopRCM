'use client';
import ListHeroMovies from "@/components/feature/homepage/ListHeroMovies";
import { SeriesDisplayGrid } from "@/components/feature/homepage/SeriesDisplayGrid";
import PageFooter from "@/components/layout/PageFooter";
import PageHeader from "@/components/layout/PageHeader";
import { useAnimeMovies, useHeroData, usePopularSeries, useTopSeriesThisWeek, useTopSinglesThisWeek } from "@/hooks/useData/useHomeData";
import { useMoviesFromGenreById } from "@/hooks/useData/useHomeData";
import { OneGenreMovies } from "@/components/feature/homepage/OneGenreMovies";
import { LoadingEffect } from "@/components/ui/LoadingEffect";
import { RankingSection } from "@/components/feature/homepage/RankingSection";
import { MoviesDisplayGrid } from "@/components/feature/homepage/MoviesDisplayGrid";
import ListAnimeHeroMovies from "@/components/feature/homepage/ListAnimeHeroMovies";

export default function Home() {
  const { heroMovies, isLoading: heroLoading } = useHeroData();
  const { seriesList, loading: seriesLoading } = usePopularSeries();
  
  const { moviesList: seriesTopList, isLoading: seriesTopLoading } = useTopSeriesThisWeek();
  const { moviesList: singleTopList, isLoading: singleTopLoading } = useTopSinglesThisWeek();
  const { animeList, isLoading: animeLoading } = useAnimeMovies();

  const { movies: actionMovies, isLoading: actionLoading } = useMoviesFromGenreById('hanh-dong', 9);
  const { movies: fictionMovies, isLoading: fictionLoading } = useMoviesFromGenreById('vien-tuong', 9);
  const { movies: romanceMovies, isLoading: romanceLoading } = useMoviesFromGenreById('tinh-cam', 9);
  const { movies: comedyMovies, isLoading: comedyLoading } = useMoviesFromGenreById('hai-huoc', 15);
  const { movies: adventureMovies, isLoading: adventureLoading } = useMoviesFromGenreById('phieu-luu', 15);
  const { movies: mysteryMovies, isLoading: mysteryLoading } = useMoviesFromGenreById('bi-an', 15);

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
          {actionLoading || fictionLoading || romanceLoading ? (
            <div className="p-8">
              <LoadingEffect message="Đang tải thể loại phim hot..." />
            </div>
          ) : (
            <div className="lg:p-8 md:p-8 sm:p-6 p-5 bg-linear-to-b from-(--surface) via-70% via-(--background) to-(--background) rounded-2xl">
              {actionLoading ? (
                <div className="p-8">
                  <LoadingEffect message="Đang tải phim hành động..." />
                </div>
              ) : (
                <OneGenreMovies
                  title="Phim Hành động"
                  movies={actionMovies}
                  titleColor="text-gradient-orange"
                  linkText="Xem tất cả"
                  genreSlug="hanh-dong"
                />
              )}
        
              {fictionLoading ? (
                <div className="p-8">
                  <LoadingEffect message="Đang tải phim kinh dị..." />
                </div>
              ) : (
                <OneGenreMovies
                  title="Phim Viễn tưởng"
                  movies={fictionMovies}
                  titleColor="text-gradient-green"
                  linkText="Xem tất cả"
                  genreSlug="vien-tuong"
                />
              )}
        
              {romanceLoading ? (
                <div className="p-8">
                  <LoadingEffect message="Đang tải phim tình cảm..." />
                </div>
              ) : (
                <OneGenreMovies
                  title="Phim Tình cảm"
                  movies={romanceMovies}
                  titleColor="text-gradient-pink"
                  linkText="Xem tất cả"
                  genreSlug="tinh-cam"
                />
              )}
          </div>
          )}
        </div>
        
        {/* Rankings Section */}
        <div className="px-4 sm:px-6 lg:px-8">
          <RankingSection />
        </div>

        <div className="px-4 md:px-6 lg:px-8 mt-12 mb-12">
          {comedyLoading ? (
            <div className="p-8">
              <LoadingEffect message="Đang tải phim..." />
            </div>
          ) : (
            <MoviesDisplayGrid
              title="Phim hài hước giải trí"
              href="/genre/hai-huoc"
              moviesList={comedyMovies}
              loading={comedyLoading}
            />
          )}
        </div>

        <div className="px-4 md:px-6 lg:px-8 mt-12 mb-12">
          {singleTopLoading ? (
            <div className="p-8">
              <LoadingEffect message="Đang tải phim..." />
            </div>
          ) : (
            <div>
              {singleTopList.length === 0 ? (
                <div className="">
                  <div className="font-bold lg:text-xl md:text-xl sm:text-lg text-lg">
                    Top 10 phim lẻ tuần này
                  </div>
                  <div className="p-24 border-2 border-gray-800 text-gray-300 rounded-2xl mt-4 text-center">
                    Chưa có dữ liệu phim bộ tuần này
                  </div>
                </div>
              ) : (
              <div>
                <MoviesDisplayGrid
                  title="Top 10 phim bộ tuần này"
                  moviesList={singleTopList}
                  loading={singleTopLoading}
                  type="top"
                />
              </div>
            )}
          </div>
          )}
        </div>

        <div className="px-4 md:px-6 lg:px-8 mt-12 mb-12">
          {adventureLoading ? (
            <div className="p-8">
              <LoadingEffect message="Đang tải phim..." />
            </div>
          ) : (
            <MoviesDisplayGrid
              title="Nào mình cùng phiêu lưu"
              href="/genre/phieu-luu"
              moviesList={adventureMovies}
              loading={adventureLoading}
            />
          )}
        </div>

        <div className="px-4 md:px-6 lg:px-8 mt-12 mb-12">
          {seriesTopLoading ? (
            <div className="p-8">
              <LoadingEffect message="Đang tải phim..." />
            </div>
          ) : (
            <div>
              {seriesTopList.length === 0 ? (
                <div className="">
                  <div className="font-bold lg:text-xl md:text-xl sm:text-lg text-lg">
                    Top 10 phim bộ tuần này
                  </div>
                  <div className="p-24 border-2 border-gray-800 text-gray-300 rounded-2xl mt-4 text-center">
                    Chưa có dữ liệu phim bộ tuần này
                  </div>
                </div>
              ) : (
              <div>
                <MoviesDisplayGrid
                  title="Top 10 phim bộ tuần này"
                  moviesList={seriesTopList}
                  loading={seriesTopLoading}
                  type="top"
                />
              </div>
            )}
          </div>
          )}
        </div>

        <div className="mb-12 mt-12">
          {animeLoading ? (
            <div className="p-8">
              <LoadingEffect message="Đang tải phim..." />
            </div>
          ) : (
            <div className="px-4 md:px-6 lg:px-8">
              <ListAnimeHeroMovies animeMovies={animeList} isLoading={animeLoading} />
            </div>
          )}
        </div>

        <div className="px-4 md:px-6 lg:px-8 mt-12 mb-12">
          {mysteryLoading ? (
            <div className="p-8">
              <LoadingEffect message="Đang tải phim..." />
            </div>
          ) : (
            <MoviesDisplayGrid
              title="Cùng nhau khám phá các bí ẩn"
              href="/genre/bi-an"
              moviesList={mysteryMovies}
              loading={mysteryLoading}
            />
          )}
        </div>
      </main>
      <PageFooter />
    </div>
  );
}
