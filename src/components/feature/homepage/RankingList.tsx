import { Movie } from "@/types/Movies";
import { RankingListItem } from "./RankingListItem";

export interface RankingListProps {
  movies: Movie[];
  title: string;
  icon: string;
  titleColor: string;
  onShowMore?: () => void;
  showMoreButton?: boolean;
  maxDisplay?: number;
  containerClassName?: string;
}

export function RankingList({ 
  movies, 
  title, 
  icon, 
  titleColor, 
  onShowMore,
  showMoreButton = true,
  maxDisplay = 5,
  containerClassName = ""
}: RankingListProps) {
  const displayMovies = maxDisplay > 0 ? movies.slice(0, maxDisplay) : movies;

  return (
    <div className={containerClassName}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <img src={icon} alt="Ranking Icon" className="w-6 h-6" />
          <h3 className={`font-extrabold tracking-wider text-base ${titleColor}`}>{title}</h3>
        </div>
      </div>

      {/* Movies List */}
      <div className="space-y-3">
        {displayMovies.map((movie, index) => (
          <RankingListItem
            key={movie.id}
            movie={movie}
            index={index}
          />
        ))}
      </div>

      {/* See More Button */}
      {showMoreButton && onShowMore && (
        <button
          onClick={onShowMore}
          className="w-full mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors border-t border-gray-600 pt-3"
        >
          Xem thêm
        </button>
      )}
    </div>
  );
}