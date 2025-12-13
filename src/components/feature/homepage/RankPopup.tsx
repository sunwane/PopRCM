import { Movie } from "@/types/Movies";
import { RankingListItem } from "./RankingListItem";

export interface RankPopupProps {
  isOpen: boolean;
  onClose: () => void;
  movies: Movie[];
  title: string;
  icon: string;
  titleColor: string;
}

export function RankPopup({ 
  isOpen, 
  onClose, 
  movies, 
  title, 
  icon, 
  titleColor 
}: RankPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-(--background) border-2 border-(--border-blue) rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <img src={icon} alt="Ranking Icon" className="w-6 h-6" />
            <h2 className={`font-bold text-lg ${titleColor}`}>{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="space-y-3">
            {movies.map((movie, index) => (
              <RankingListItem
                key={movie.id}
                movie={movie}
                index={index}
                variant="detailed"
              />
            ))}
          </div>

          {movies.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              Không có dữ liệu
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}