import { useState, useCallback, useMemo, useEffect } from 'react';
import { ActorService } from '@/services/ActorService';
import { Actor } from '@/types/Actor';

export interface ActorPaginationProps {
  query?: string; // Từ khóa tìm kiếm
  initialPage?: number; // Trang bắt đầu
  pageSize?: number; // Số lượng diễn viên trên mỗi trang
}

export function useActorPagination(props: ActorPaginationProps) {
  const {
    query = "", // Từ khóa tìm kiếm
    initialPage = 1, // Trang bắt đầu
    pageSize = 24, // Số lượng diễn viên trên mỗi trang
  } = props;

  // State
  const [actors, setActors] = useState<Actor[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tính tổng số trang
  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / pageSize) || 1;
  }, [totalItems, pageSize]);

  // Load data từ service layer
  useEffect(() => {
    const fetchActors = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (query.trim()) {
          // Nếu có search query, sử dụng searchActors
          const searchResults = await ActorService.searchActors(query);
          setActors(searchResults);
          setTotalItems(searchResults.length);
        } else {
          // Nếu không có query, lấy tất cả actors với pagination
          const allActors = await ActorService.getAllActors(currentPage - 1, pageSize);
          setActors(allActors);
          
          // Để tính totalItems chính xác, cần load toàn bộ dữ liệu một lần
          const fullActors = await ActorService.getAllActors(0, 1000);
          setTotalItems(fullActors.length);
        }
      } catch (err) {
        setError('Lỗi khi tải danh sách diễn viên');
        setActors([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    fetchActors();
  }, [currentPage, pageSize, query]);

  // Navigation functions
  const goToPage = useCallback((page: number) => {
    const targetPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(targetPage);
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  // Computed values
  const hasNextPage = useMemo(() => currentPage < totalPages, [currentPage, totalPages]);
  const hasPrevPage = useMemo(() => currentPage > 1, [currentPage]);

  // Reset to page 1 when query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  return {
    // Filtered and paginated actors
    actors, // Danh sách diễn viên đã lọc và phân trang
    loading, // Trạng thái tải dữ liệu
    error, // Lỗi nếu có
    totalItems, // Tổng số diễn viên sau khi lọc
    currentPage, // Trang hiện tại
    totalPages, // Tổng số trang
    pageSize, // Số lượng diễn viên trên mỗi trang
    hasNextPage, // Có trang tiếp theo không
    hasPrevPage, // Có trang trước không

    // Actions
    goToPage, // Chuyển đến trang cụ thể
    nextPage, // Chuyển đến trang tiếp theo
    prevPage, // Quay lại trang trước
  };
}