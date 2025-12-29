"use client";

interface SearchTabsProps {
  activeTab: 'movies' | 'actors';
  onTabChange: (tab: 'movies' | 'actors') => void;
  moviesCount?: number;
  actorsCount?: number;
}

export default function SearchTabs({ 
  activeTab, 
  onTabChange, 
  moviesCount = 0, 
  actorsCount = 0 
}: SearchTabsProps) {
  return (
    <div className="flex items-center space-x-3 mb-6">
      <button
        onClick={() => onTabChange('movies')}
        className={`px-6 py-3 font-semibold rounded-4xl transition-all duration-200 ${
          activeTab === 'movies'
            ? 'text-black bg-(--hover)'
            : 'text-white bg-white/15 hover:bg-white/25'
        }`}
      >
        Phim {moviesCount > 0 && `(${moviesCount})`}
      </button>
      <button
        onClick={() => onTabChange('actors')}
        className={`px-6 py-3 font-semibold rounded-4xl transition-all duration-200 ${
          activeTab === 'actors'
            ? 'text-black bg-(--hover)'
            : 'text-white bg-white/15 hover:bg-white/25'
        }`}
      >
        Diễn viên {actorsCount > 0 && `(${actorsCount})`}
      </button>
    </div>
  );
}