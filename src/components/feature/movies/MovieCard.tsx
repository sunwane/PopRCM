import { Movie } from "@/types/Movies";

export interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const goToDetails = () => {
    window.location.href = `/movie/${movie.id}`;
  }

  return (
    <div 
      className="lg:w-42 md:w-42 sm:w-32 w-32 text-white cursor-pointer hover:scale-105 transition-transform"
      onClick={goToDetails}
    >
      {/* Image */}
      <div 
        className="lg:w-42 md:w-42 sm:w-32 w-32 aspect-2/3 bg-gray-300 rounded-lg mb-2
        border-2 border-(--border-blue) shadow-[3px_3px_2px_1px_var(--shadow-red)]"
      >
        <img
          src={movie.posterUrl ?? "/placeholder/placeholder-poster.png"}
          onError={(e) => {
            e.currentTarget.src = "/placeholder/placeholder-poster.png"
          }}
          alt={movie.title}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Title and originName */}
      <div className="text-center">
        <h2 className="lg:text-[15px] md:text-[15px] sm:text-[13px] text-[13px] font-bold truncate line-clamp-1">{movie.title}</h2>
        <p className="lg:text-[13px] md:text-[13px] sm:text-[11px] text-[11px] text-gray-500 truncate line-clamp-1">{movie.originalName}</p>
      </div>
    </div>
  );
}