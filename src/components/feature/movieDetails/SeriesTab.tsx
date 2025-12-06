export interface SeriesTabProps {
  movieInfo: any;
  relatedSeries?: any[];
  seriesData?: any[];
}

export function SeriesTab({ movieInfo, relatedSeries = [], seriesData = [] }: SeriesTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">Series liên quan</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Nội dung series sẽ được thêm vào sau */}
        <div className="p-4 bg-gray-800 rounded-lg">
          <p className="text-gray-400">Nội dung series liên quan sẽ được cập nhật sau...</p>
        </div>
      </div>
    </div>
  );
}
