'use client';

import { useState, useCallback, useMemo } from 'react';
import { useSearchParams } from './use-search-params';
import { useDebounce } from './use-debounce';
import type { PaginationMeta } from '@/config/api';

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UsePaginationReturn extends PaginationState {
  // Navigation
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  setLimit: (limit: number) => void;
  
  // Update from API response
  updateFromMeta: (meta: PaginationMeta) => void;
  
  // Computed
  hasNextPage: boolean;
  hasPrevPage: boolean;
  startItem: number;
  endItem: number;
  
  // For API calls
  getParams: () => { page: number; limit: number };
}

/**
 * Hook for managing pagination state
 */
export function usePagination(options?: {
  defaultPage?: number;
  defaultLimit?: number;
  syncWithUrl?: boolean;
}): UsePaginationReturn {
  const { defaultPage = 1, defaultLimit = 10, syncWithUrl = false } = options ?? {};
  
  const searchParams = useSearchParams<{ page: string; limit: string }>();

  // Local state
  const [localState, setLocalState] = useState<PaginationState>({
    page: syncWithUrl ? searchParams.getNumber('page', defaultPage) ?? defaultPage : defaultPage,
    limit: syncWithUrl ? searchParams.getNumber('limit', defaultLimit) ?? defaultLimit : defaultLimit,
    total: 0,
    totalPages: 0,
  });

  const { page, limit, total, totalPages } = localState;

  // Update page
  const goToPage = useCallback(
    (newPage: number) => {
      const validPage = Math.max(1, Math.min(newPage, totalPages || 1));
      setLocalState((prev) => ({ ...prev, page: validPage }));
      if (syncWithUrl) {
        searchParams.setParam('page', String(validPage), { replace: true });
      }
    },
    [totalPages, syncWithUrl, searchParams]
  );

  const nextPage = useCallback(() => {
    if (page < totalPages) {
      goToPage(page + 1);
    }
  }, [page, totalPages, goToPage]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      goToPage(page - 1);
    }
  }, [page, goToPage]);

  const setLimit = useCallback(
    (newLimit: number) => {
      setLocalState((prev) => ({ ...prev, limit: newLimit, page: 1 }));
      if (syncWithUrl) {
        searchParams.setParams({ limit: String(newLimit), page: '1' }, { replace: true });
      }
    },
    [syncWithUrl, searchParams]
  );

  // Update from API response
  const updateFromMeta = useCallback((meta: PaginationMeta) => {
    setLocalState((prev) => ({
      ...prev,
      total: meta.total,
      totalPages: meta.totalPages,
      page: meta.page,
      limit: meta.limit,
    }));
  }, []);

  // Computed values
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const getParams = useCallback(() => ({ page, limit }), [page, limit]);

  return {
    page,
    limit,
    total,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    setLimit,
    updateFromMeta,
    hasNextPage,
    hasPrevPage,
    startItem,
    endItem,
    getParams,
  };
}

/**
 * Hook combining search with pagination
 */
export function useSearchWithPagination<T extends Record<string, unknown>>(options?: {
  defaultFilters?: Partial<T>;
  debounceMs?: number;
  syncWithUrl?: boolean;
}) {
  const { defaultFilters = {}, debounceMs = 300, syncWithUrl = false } = options ?? {};

  const [filters, setFilters] = useState<Partial<T>>(defaultFilters as Partial<T>);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, debounceMs);

  const pagination = usePagination({ syncWithUrl });

  // Reset to page 1 when filters change
  const updateFilters = useCallback(
    (newFilters: Partial<T>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      pagination.goToPage(1);
    },
    [pagination]
  );

  const updateSearch = useCallback(
    (newSearch: string) => {
      setSearch(newSearch);
      pagination.goToPage(1);
    },
    [pagination]
  );

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters as Partial<T>);
    setSearch('');
    pagination.goToPage(1);
  }, [defaultFilters, pagination]);

  // Combined params for API call
  const queryParams = useMemo(
    () => ({
      ...filters,
      search: debouncedSearch || undefined,
      ...pagination.getParams(),
    }),
    [filters, debouncedSearch, pagination]
  );

  return {
    // Search
    search,
    setSearch: updateSearch,
    debouncedSearch,

    // Filters
    filters,
    setFilters: updateFilters,
    resetFilters,

    // Pagination
    pagination,

    // Combined query params
    queryParams,
  };
}
