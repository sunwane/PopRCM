import { useState, useEffect } from 'react';
import { ActorService } from '@/services/ActorService';
import { Actor } from '@/types/Actor';

export function useActorSearch(query: string) {
  const [actors, setActors] = useState<Actor[]>([]);
  const [totalActors, setTotalActors] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchActors = async () => {
      if (!query.trim()) {
        setActors([]);
        setTotalActors(0);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await ActorService.searchActors(query, 0, 50); // Lấy tối đa 50 diễn viên
        setActors(result.actors);
        setTotalActors(result.totalElements);
      } catch (err) {
        setError('Lỗi khi tìm kiếm diễn viên');
        setActors([]);
        setTotalActors(0);
      } finally {
        setLoading(false);
      }
    };

    searchActors();
  }, [query]);

  return {
    actors,
    totalActors,
    loading,
    error,
  };
}