import { useRouter } from "next/navigation";
import { Movie } from "@/types/Movies";
import OneSearchDiv from "./OneSearchDiv";

interface SearchDropdownProps {
  suggestions: Movie[];
  loading: boolean;
  query: string;
  onClose: () => void;
}

export function SearchDropdown({ suggestions, loading, query, onClose }: SearchDropdownProps) {
  const router = useRouter();

  const handleMovieClick = (movie: Movie) => {
    onClose();
    router.push(`/movie/${movie.id}`);
  };

  const handleViewAll = () => {
    onClose();
    router.push(`/searchresult?query=${encodeURIComponent(query)}`);
  };

  if (!query.trim() || query.trim().length < 2) {
    return null;
  }

  return (
    <div 
      className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden"
    >
      {loading ? (
        <div className="p-4 text-center">
          <div className="text-gray-400 text-sm">Đang tìm kiếm...</div>
        </div>
      ) : suggestions.length > 0 ? (
        <>
          <div className="px-4 py-3 border-b border-white/10">
            <h3 className="text-white font-medium text-sm">Danh sách phim</h3>
          </div>
          
          <div className="max-h-64 overflow-y-auto no-scrollbar">
            {suggestions.map((movie) => (
              <OneSearchDiv
                key={movie.id}
                movie={movie}
                onClick={() => handleMovieClick(movie)}
              />
            ))}
          </div>

          <div className="border-t border-white/10 p-3">
            <button
              onClick={handleViewAll}
              className="w-full text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors text-center"
            >
              Xem tất cả kết quả cho "{query}"
            </button>
          </div>
        </>
      ) : (
        <div className="p-4 text-center">
          <div className="text-gray-400 text-sm">Không tìm thấy kết quả nào cho "{query}"</div>
          <button
            onClick={handleViewAll}
            className="mt-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            Tìm kiếm nâng cao
          </button>
        </div>
      )}
    </div>
  );
}