import { useState, useEffect } from "react";
import { ActorService } from "../../services/ActorService";
import { Actor } from "@/types/Actor";

export function useActorsData() {
  const [allActors, setAllActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const actors = await ActorService.getAllActors();
        setAllActors(actors);
      } catch (err) {
        setError("Lỗi khi tải danh sách thể loại");
      } finally {
        setLoading(false);
      }
    };

    fetchActors();
  }, []);

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