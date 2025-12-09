import { LoadingEffect } from "@/components/ui/LoadingEffect";
import { useMoviesFromGenreById } from "@/hooks/useData/useHomeData";
import { OneGenreMovies } from "./OneGenreMovies";

export default function HotGenresMoviesList() {
  const { movies: actionMovies, isLoading: actionLoading } = useMoviesFromGenreById('hanh-dong', 9);
  const { movies: horrorMovies, isLoading: horrorLoading } = useMoviesFromGenreById('kinh-di', 9);
  const { movies: romanceMovies, isLoading: romanceLoading } = useMoviesFromGenreById('tinh-cam', 9);

  if (actionLoading || horrorLoading || romanceLoading) {
    return <LoadingEffect message="Đang tải thể loại phim hot..." />;
  }

  return (
    <div className="px-6 py-8 bg-linear-to-b from-(--surface) via-70% via-(--background) to-(--background) rounded-2xl">
      {/* Phim Hành động */}
      <OneGenreMovies
        title="Phim Hành động"
        movies={actionMovies}
        titleColor="text-orange-400"
        linkText="Xem tất cả"
        genreSlug="hanh-dong"
      />

      {/* Phim Kinh dị */}
      <OneGenreMovies
        title="Phim Kinh dị"
        movies={horrorMovies}
        titleColor="text-green-400"
        linkText="Xem tất cả"
        genreSlug="kinh-di"
      />

      {/* Phim Tình cảm */}
      <OneGenreMovies
        title="Phim Tình cảm"
        movies={romanceMovies}
        titleColor="text-pink-400"
        linkText="Xem tất cả"
        genreSlug="tinh-cam"
      />
    </div>
  );
}