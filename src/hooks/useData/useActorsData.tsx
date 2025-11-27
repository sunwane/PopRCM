import { useState, useEffect } from "react";
import { ActorService } from "../../services/ActorService";
import { Actor } from "@/types/Actor";

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
        // Nếu không truyền page/size, lấy toàn bộ dữ liệu
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
  const [movies, setMovies] = useState<any[]>([]); // Nếu cần trả về danh sách phim
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActor = async () => {
      try {
        setLoading(true);
        const actor = await ActorService.getActorById(id);
        const movies = await ActorService.getMoviesByActorId(id);
        setActor(actor);
        setMovies(movies);
      } catch (err) {
        setError("Lỗi khi tải thông tin diễn viên");
      } finally {
        setLoading(false);
      }
    };

    fetchActor();
  }, [id]);

  return { actor, movies, loading, error };
}