import { useState, useEffect } from "react";
import { ActorService } from "../../services/ActorService";
import { Actor } from "@/types/Actor";
import { Movie } from "@/types/Movies";
import { useMoviesByYear, useMovieStats } from "./useMovieService";

export function useActorsData(
  page?: number,
  size?: number
) {
  const [allActors, setAllActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const actors = await ActorService.getAllActors(
          page ?? 0, 
          size ?? 1000
        );
        setAllActors(actors);
      } catch (err) {
        setError("Lỗi khi tải danh sách diễn viên");
      } finally {
        setLoading(false);
      }
    };

    fetchActors();
  }, [page, size]);

  return {
    allActors,
    loading,
    error,
  };
}

export function useActorDataByID(id: string) {
  const [actor, setActor] = useState<Actor | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActor = async () => {
      try {
        setLoading(true);
        const [actorData, moviesData] = await Promise.all([
          ActorService.getActorById(id),
          ActorService.getMoviesByActorId(id)
        ]);
        
        setActor(actorData);
        setMovies(moviesData || []);
        console.log("Fetched actor:", actorData);
        console.log("Fetched movies:", moviesData);
      } catch (err) {
        setError("Lỗi khi tải thông tin diễn viên");
        console.error("Error fetching actor data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchActor();
    }
  }, [id]);

  // Sử dụng useMovieService để xử lý logic phim
  const { moviesByYear, sortedYears } = useMoviesByYear(movies);
  const movieStats = useMovieStats(movies);

  return { 
    actor, 
    movies, 
    moviesByYear, 
    sortedYears, 
    movieStats,
    loading, 
    error 
  };
}