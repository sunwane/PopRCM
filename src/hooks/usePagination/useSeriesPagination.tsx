import { useState, useCallback, useMemo, useEffect } from 'react';
import { Series } from '@/types/Series';
import { useSeriesData } from '../useData/useSeriesData';

export interface SeriesPaginationProps {
  query?: string; // Từ khóa tìm kiếm
  initialPage?: number; // Trang bắt đầu
  pageSize?: number; // Số lượng series trên mỗi trang
}

export function useSeriesPagination(props: SeriesPaginationProps) {
  const {
    query = "", // Từ khóa tìm kiếm
    initialPage = 1, // Trang bắt đầu
    pageSize = 24, // Số lượng series trên mỗi trang
  } = props;

  // State
  const [series, setSeries] = useState<Series[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tính tổng số trang
  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / pageSize) || 1;
  }, [totalItems, pageSize]);

  // Fetch dữ liệu series
  const { allSeries, loading: dataLoading, error: dataError } = useSeriesData();

  useEffect(() => {
    setLoading(dataLoading);
    setError(dataError);
    setSeries(allSeries);
  }, [dataLoading]);

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
    paginatedSeries: series, // Danh sách series đã lọc và phân trang
    loading, // Trạng thái tải dữ liệu
    error, // Lỗi nếu có
    totalItems, // Tổng số series sau khi lọc
    currentPage, // Trang hiện tại
    totalPages, // Tổng số trang
    pageSize, // Số lượng series trên mỗi trang
    hasNextPage, // Có trang tiếp theo không
    hasPrevPage, // Có trang trước không

    // Actions
    goToPage, // Chuyển đến trang cụ thể
    nextPage, // Chuyển đến trang tiếp theo
    prevPage, // Quay lại trang trước
  };
}