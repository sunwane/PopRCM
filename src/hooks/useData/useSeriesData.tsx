import { useState, useEffect } from "react";
import { SeriesService } from "../../services/SeriesService";
import { Series } from "@/types/Series";

export function useSeriesData(
  page?: number,
  size?: number
) {
  const [allSeries, setAllSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        // Nếu không truyền page/size, lấy toàn bộ dữ liệu
        const series = await SeriesService.getAllSeries(
          page ?? 0, 
          size ?? 1000
        );
        setAllSeries(series);
      } catch (err) {
        setError("Lỗi khi tải danh sách thể loại");
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, [page, size]);

  const findSeriesById = (id: string): Series | null => {
    return allSeries.find(series => series.id === id) || null;
  };

  return {
    allSeries,
    loading,
    error,
    findSeriesById,
  };
}