import { useState, useCallback, useMemo, useEffect } from 'react';
import { useFilterResults } from '../useFilter';

export interface MoviesPaginationProps {
  query?: string;
  countryId?: string;
  genreIds?: string[];
  type?: string;
  language?: string;
  year?: string | null;
  status?: string;
  sortBy?: string;
  initialPage?: number;
  pageSize?: number;
}

export function useMoviesPagination(props: MoviesPaginationProps = {}) {
  const {
    query = "",
    countryId,
    genreIds,
    type,
    language,
    year,
    status,
    sortBy,
    initialPage = 1,
    pageSize = 24,
  } = props;

  // Pagination state - merged from useMoviesPagination
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalItems, setTotalItems] = useState(0);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / pageSize) || 1;
  }, [totalItems, pageSize]);

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
  const startIndex = useMemo(() => (currentPage - 1) * pageSize + 1, [currentPage, pageSize]);
  const endIndex = useMemo(() => Math.min(currentPage * pageSize, totalItems), [currentPage, pageSize, totalItems]);

  // Get filtered results with pagination
  const filterResults = useFilterResults(
    query,
    countryId,
    genreIds,
    type,
    language,
    year,
    status,
    sortBy,
    currentPage - 1, // Convert to 0-based page
    pageSize
  );

  // Update total items when filter results change
  useEffect(() => {
    if (filterResults.totalCount !== totalItems) {
      setTotalItems(filterResults.totalCount);
    }
  }, [filterResults.totalCount, totalItems]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, countryId, genreIds, type, language, year, status, sortBy]);

  return {
    // Filter results
    movies: filterResults.filteredMovies,
    loading: filterResults.loading,
    error: filterResults.error,
    
    // Pagination
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    hasNextPage,
    hasPrevPage,
    startIndex,
    endIndex,
    
    // Actions
    goToPage,
    nextPage,
    prevPage,
  };
}