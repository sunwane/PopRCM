export interface EpisodesTabProps {
  movieInfo: any;
  episodes?: any[];
}

export function EpisodesTab({ movieInfo, episodes = [] }: EpisodesTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">Tập phim</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Nội dung episodes sẽ được thêm vào sau */}
        <div className="p-4 bg-gray-800 rounded-lg">
          <p className="text-gray-400">Nội dung tập phim sẽ được cập nhật sau...</p>
        </div>
      </div>
    </div>
  );
}
