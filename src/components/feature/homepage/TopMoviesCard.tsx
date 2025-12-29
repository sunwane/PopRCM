import { Movie } from "@/types/Movies";
import { getStatusText } from "@/utils/getTextUtils";

interface TopMoviesCardProps {
  movie: Movie;
  rank: number;
}

export default function TopMoviesCard({ movie, rank }: TopMoviesCardProps) {
  const isEven = rank % 2 === 0;
  const clipPath = isEven
    ? "polygon(0 4%, 100% 0, 100% 100%, 0% 96%)"
    : "polygon(0 0, 100% 4%, 100% 96%, 0% 100%)";

  return (
    <div className="movie-card flex flex-col items-center w-68">
      {/* Poster với polygon mask */}
      <div
        className="w-68 h-full aspect-2/3 rounded-xl overflow-hidden shadow-lg bg-gray-800 cursor-pointer group relative"
        onClick={() => window.location.href = `/movie/${movie.id}`}
        style={{ clipPath }}
      >
        <img
          src={movie.posterUrl ?? "/placeholder/placeholder-poster.png"}
          alt={movie.title}
          className="w-full h-full object-cover transition-all duration-200 group-hover:brightness-110"
        />
      </div>
      <div className="flex gap-4 mt-4 w-full">
        {/* Số thứ tự lớn ở góc dưới trái */}
        <div className="text-gradient font-black text-5xl drop-shadow-lg select-none pointer-events-none">
          {rank}
        </div>
        <div className="w-[80%]">
          {/* Tiêu đề phim */}
            <div className="text-white font-bold text-base text-left w-full mt-2 truncate px-1">{movie.title}</div>
            {/* Subtitle (ví dụ: tên tiếng Anh hoặc phụ đề) */}
            <div className="text-gray-500 text-xs text-left w-full px-1 truncate line-clamp-1">{movie.originalName}</div>
            {/* Thông tin phụ */}
            <div className="flex items-center gap-2 text-xs text-gray-400 w-full px-1 mt-1">
              <span className="font-bold text-white">{getStatusText(movie.status) || "Ongoing"}</span>
              <span>•</span>
              <span>{movie.releaseYear || "2025"}</span>
              <span>•</span>
              <span>{movie.totalEpisodes ? `${movie.totalEpisodes} tập` : "20 tập"}</span>
            </div>
        </div>
      </div>
    </div>
  );
}