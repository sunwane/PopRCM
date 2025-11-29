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

        // Đếm số phim trong mỗi series và thêm vào dữ liệu
        const seriesWithMovieCount = series.map((item) => ({
          ...item,
          movieCount: item.seriesMovies ? item.seriesMovies.length : 0, // Giả sử mỗi series có thuộc tính `movies`
        }));

        setAllSeries(seriesWithMovieCount);
        console.log("Fetched series:", seriesWithMovieCount);
      } catch (err) {
        setError("Lỗi khi tải danh sách thể loại");
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, [page, size]);

  return {
    allSeries,
    loading,
    error,
  };
}

export function useSeriesDataByID(id: string) {
  const [serieInfo, setSerieInfo] = useState<Series | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hàm để thêm seasonNumber vào movies
  const addSeasonNumberToMovies = (seriesData: Series) => {
    if (!seriesData.movies || !seriesData.seriesMovies) return seriesData;

    // Tạo map để lookup seasonNumber dựa trên movieId
    const seasonMap = new Map();
    seriesData.seriesMovies.forEach(sm => {
      if (sm.movie) {
        seasonMap.set(sm.movie.id, sm.seasonNumber);
      }
    });

    // Thêm seasonNumber vào mỗi movie
    const moviesWithSeason = seriesData.movies.map(movie => ({
      ...movie,
      seasonNumber: seasonMap.get(movie.id) || null // Thêm seasonNumber
    }));

    return {
      ...seriesData,
      movies: moviesWithSeason
    };
  };

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setLoading(true);
        const seriesData = await SeriesService.getSeriesById(id);

        if (seriesData) {
          // Thêm seasonNumber vào movies
          const seriesWithSeasonNumbers = addSeasonNumberToMovies(seriesData);
          
          const serieWithMovieCount = {
            ...seriesWithSeasonNumbers,
            movieCount: seriesWithSeasonNumbers.movies ? seriesWithSeasonNumbers.movies.length : 0,
          };

          setSerieInfo(serieWithMovieCount);
          console.log("Fetched series by ID:", seriesWithSeasonNumbers);
          console.log("Movies with season numbers:", seriesWithSeasonNumbers.movies);
        } else {
          setSerieInfo(null);
        }
      } catch (err) {
        setError("Lỗi khi tải thông tin series");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSeries();
    }
  }, [id]);

  return {
    serieInfo,
    loading,
    error,
  };
}