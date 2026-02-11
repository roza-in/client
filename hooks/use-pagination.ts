/**
 * Rozx Healthcare Platform - Pagination Hook
 * 
 * Pagination state management for lists and tables.
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

// =============================================================================
// Types
// =============================================================================

export interface PaginationState {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface UsePaginationOptions {
    /** Initial page (default: 1) */
    initialPage?: number;
    /** Items per page (default: 10) */
    initialLimit?: number;
    /** Available limit options */
    limitOptions?: number[];
    /** Total items (can be updated dynamically) */
    total?: number;
    /** Sync with URL params */
    syncUrl?: boolean;
    /** Callback when page changes */
    onPageChange?: (page: number) => void;
    /** Callback when limit changes */
    onLimitChange?: (limit: number) => void;
}

export interface UsePaginationReturn {
    // State
    page: number;
    limit: number;
    total: number;
    totalPages: number;

    // Computed
    offset: number;
    hasNext: boolean;
    hasPrev: boolean;
    startItem: number;
    endItem: number;
    isFirstPage: boolean;
    isLastPage: boolean;

    // Actions
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
    setTotal: (total: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    firstPage: () => void;
    lastPage: () => void;
    reset: () => void;

    // For API calls
    paginationParams: { page: number; limit: number; offset: number };

    // For UI
    pageNumbers: number[];
    limitOptions: number[];
}

// =============================================================================
// Default Values
// =============================================================================

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const DEFAULT_LIMIT_OPTIONS = [10, 20, 50, 100];
const MAX_VISIBLE_PAGES = 5;

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * Pagination state management hook.
 * 
 * @example
 * // Basic usage
 * const { page, limit, setPage, paginationParams } = usePagination();
 * const { data } = useQuery(['items', paginationParams], fetchItems);
 * 
 * // With URL sync
 * const pagination = usePagination({ syncUrl: true, total: 100 });
 * 
 * // Render pagination
 * <Pagination
 *   page={pagination.page}
 *   totalPages={pagination.totalPages}
 *   onPageChange={pagination.setPage}
 * />
 */
export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
    const {
        initialPage = DEFAULT_PAGE,
        initialLimit = DEFAULT_LIMIT,
        limitOptions = DEFAULT_LIMIT_OPTIONS,
        total: initialTotal = 0,
        syncUrl = false,
        onPageChange,
        onLimitChange,
    } = options;

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Get initial values from URL if syncing
    const getInitialPage = () => {
        if (syncUrl) {
            const urlPage = searchParams.get('page');
            if (urlPage) return parseInt(urlPage, 10) || initialPage;
        }
        return initialPage;
    };

    const getInitialLimit = () => {
        if (syncUrl) {
            const urlLimit = searchParams.get('limit');
            if (urlLimit) return parseInt(urlLimit, 10) || initialLimit;
        }
        return initialLimit;
    };

    const [page, setPageState] = useState(getInitialPage);
    const [limit, setLimitState] = useState(getInitialLimit);
    const [total, setTotal] = useState(initialTotal);

    // Computed values
    const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);
    const offset = useMemo(() => (page - 1) * limit, [page, limit]);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    const isFirstPage = page === 1;
    const isLastPage = page === totalPages;
    const startItem = total === 0 ? 0 : offset + 1;
    const endItem = Math.min(offset + limit, total);

    // Generate visible page numbers
    const pageNumbers = useMemo(() => {
        const pages: number[] = [];
        let start = Math.max(1, page - Math.floor(MAX_VISIBLE_PAGES / 2));
        const end = Math.min(totalPages, start + MAX_VISIBLE_PAGES - 1);

        // Adjust start if we're near the end
        if (end - start + 1 < MAX_VISIBLE_PAGES) {
            start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    }, [page, totalPages]);

    // Update URL params
    const updateUrl = useCallback(
        (newPage: number, newLimit: number) => {
            if (!syncUrl) return;

            const params = new URLSearchParams(searchParams.toString());
            params.set('page', newPage.toString());
            params.set('limit', newLimit.toString());
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        },
        [syncUrl, searchParams, pathname, router]
    );

    // Set page
    const setPage = useCallback(
        (newPage: number) => {
            const validPage = Math.max(1, Math.min(newPage, totalPages));
            setPageState(validPage);
            updateUrl(validPage, limit);
            onPageChange?.(validPage);
        },
        [totalPages, limit, updateUrl, onPageChange]
    );

    // Set limit
    const setLimit = useCallback(
        (newLimit: number) => {
            setLimitState(newLimit);
            setPageState(1); // Reset to first page when limit changes
            updateUrl(1, newLimit);
            onLimitChange?.(newLimit);
        },
        [updateUrl, onLimitChange]
    );

    // Navigation helpers
    const nextPage = useCallback(() => {
        if (hasNext) setPage(page + 1);
    }, [hasNext, page, setPage]);

    const prevPage = useCallback(() => {
        if (hasPrev) setPage(page - 1);
    }, [hasPrev, page, setPage]);

    const firstPage = useCallback(() => {
        setPage(1);
    }, [setPage]);

    const lastPage = useCallback(() => {
        setPage(totalPages);
    }, [setPage, totalPages]);

    const reset = useCallback(() => {
        setPageState(initialPage);
        setLimitState(initialLimit);
        if (syncUrl) {
            updateUrl(initialPage, initialLimit);
        }
    }, [initialPage, initialLimit, syncUrl, updateUrl]);

    // Pagination params for API calls
    const paginationParams = useMemo(
        () => ({ page, limit, offset }),
        [page, limit, offset]
    );

    return useMemo(
        () => ({
            // State
            page,
            limit,
            total,
            totalPages,

            // Computed
            offset,
            hasNext,
            hasPrev,
            startItem,
            endItem,
            isFirstPage,
            isLastPage,

            // Actions
            setPage,
            setLimit,
            setTotal,
            nextPage,
            prevPage,
            firstPage,
            lastPage,
            reset,

            // For API calls
            paginationParams,

            // For UI
            pageNumbers,
            limitOptions,
        }),
        [
            page, limit, total, totalPages, offset, hasNext, hasPrev,
            startItem, endItem, isFirstPage, isLastPage,
            setPage, setLimit, nextPage, prevPage, firstPage, lastPage, reset,
            paginationParams, pageNumbers, limitOptions,
        ]
    );
}

export default usePagination;
