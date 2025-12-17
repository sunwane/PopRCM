import { useState, useEffect } from "react";
import { EpisodesService } from "@/services/EpisodesService";
import { Episode, Movie } from "@/types/Movies";

export function useEpisodeData(episodeId: string) {
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedEpisode = await EpisodesService.getEpisodeById(episodeId);
        setEpisode(fetchedEpisode);
        console.log("Fetched episode data:", fetchedEpisode);
      } catch (err) {
        console.error("Error fetching episode data:", err);
        setError("Lỗi khi tải thông tin tập phim");
        setEpisode(null);
      }
      finally {
        setLoading(false);
      }
    };

    fetchEpisode();
  }, [episodeId]);

  return {
    episode,
    loading,
    error,
  };
}

export function useMovieByEpisodeId(episodeId: string, movieId?: string) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let fetchedMovie: Movie | null = null;
        
        if (movieId) {
          // Nếu có movieId, sử dụng MoviesService để lấy thông tin movie
          const { MoviesService } = await import("@/services/MoviesService");
          fetchedMovie = await MoviesService.getMovieById(movieId);
        } else {
          // Fallback: sử dụng episodeId để tìm movie (legacy method)
          fetchedMovie = await EpisodesService.getMovieByEpisodeId(episodeId);
        }
        
        setMovie(fetchedMovie);
        console.log("Fetched movie data:", fetchedMovie);
      } catch (err) {
        console.error("Error fetching movie data:", err);
        setError("Lỗi khi tải thông tin phim");
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [episodeId, movieId]);

  return {
    movie,
    loading,
    error,
  };
}

export function useEpisodesByMovieId(movieId: string | null) {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEpisodes = async () => {
      if (!movieId) {
        setEpisodes([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const fetchedEpisodes = await EpisodesService.getEpisodesByMovieId(movieId);
        setEpisodes(fetchedEpisodes);
        console.log("Fetched episodes for movie:", fetchedEpisodes);
      } catch (err) {
        console.error("Error fetching episodes for movie:", err);
        setError("Lỗi khi tải danh sách tập phim");
        setEpisodes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [movieId]);

  return {
    episodes,
    loading,
    error,
  };
}