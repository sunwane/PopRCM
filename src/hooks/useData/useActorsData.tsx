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

  const findActorById = (id: string): Actor | null => {
    return allActors.find(actor => actor.id === id) || null;
  };

  return {
    allActors,
    loading,
    error,
    findActorById,
  };
}