/**
 * ROZX Healthcare Platform - Filter Hook
 * 
 * Filter state management for lists and tables with URL sync.
 */

'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

// =============================================================================
// Types
// =============================================================================

export type FilterValue = string | number | boolean | string[] | null | undefined;

export interface FilterConfig<T extends Record<string, FilterValue>> {
    /** Initial filter values */
    initialValues: T;
    /** Keys to sync with URL (default: all) */
    urlKeys?: (keyof T)[];
    /** Debounce delay for URL updates (default: 300ms) */
    debounceMs?: number;
    /** Callback when filters change */
    onChange?: (filters: T) => void;
    /** Sync with URL params */
    syncUrl?: boolean;
}

export interface UseFilterReturn<T extends Record<string, FilterValue>> {
    // State
    filters: T;
    activeFilters: Partial<T>;
    activeCount: number;
    isDirty: boolean;

    // Actions
    setFilter: <K extends keyof T>(key: K, value: T[K]) => void;
    setFilters: (filters: Partial<T>) => void;
    removeFilter: (key: keyof T) => void;
    clearFilters: () => void;
    resetFilters: () => void;
    toggleArrayFilter: (key: keyof T, value: string) => void;

    // For API calls
    filterParams: Record<string, string | string[]>;
    queryString: string;
}

// =============================================================================
// Helper Functions
// =============================================================================

function isEmptyValue(value: FilterValue): boolean {
    if (value === null || value === undefined) return true;
    if (value === '') return true;
    if (Array.isArray(value) && value.length === 0) return true;
    return false;
}

function serializeValue(value: FilterValue): string | string[] | undefined {
    if (isEmptyValue(value)) return undefined;
    if (Array.isArray(value)) return value;
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    return String(value);
}

function deserializeValue(value: string | string[] | null, defaultValue: FilterValue): FilterValue {
    if (value === null) return defaultValue;

    // Handle arrays
    if (Array.isArray(value)) return value;
    if (Array.isArray(defaultValue)) return value.split(',').filter(Boolean);

    // Handle booleans
    if (typeof defaultValue === 'boolean') return value === 'true';

    // Handle numbers
    if (typeof defaultValue === 'number') {
        const num = parseFloat(value);
        return isNaN(num) ? defaultValue : num;
    }

    return value;
}

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * Filter state management hook with URL synchronization.
 * 
 * @example
 * const { filters, setFilter, clearFilters, filterParams } = useFilter({
 *   initialValues: {
 *     status: '',
 *     startDate: '',
 *     endDate: '',
 *     search: '',
 *   },
 *   syncUrl: true,
 * });
 * 
 * // Use with API
 * const { data } = useQuery(['items', filterParams], fetchItems);
 * 
 * // Update filters
 * <Select value={filters.status} onChange={(v) => setFilter('status', v)} />
 */
export function useFilter<T extends Record<string, FilterValue>>(
    config: FilterConfig<T>
): UseFilterReturn<T> {
    const {
        initialValues,
        urlKeys,
        debounceMs = 300,
        onChange,
        syncUrl = false,
    } = config;

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Initialize from URL if syncing
    const getInitialFilters = useCallback((): T => {
        if (!syncUrl) return initialValues;

        const filters = { ...initialValues };
        const keysToSync = urlKeys || (Object.keys(initialValues) as (keyof T)[]);

        keysToSync.forEach((key) => {
            const urlValue = searchParams.get(String(key));
            const urlValues = searchParams.getAll(String(key));

            if (urlValue !== null || urlValues.length > 0) {
                const defaultValue = initialValues[key];
                const value = Array.isArray(defaultValue) && urlValues.length > 0
                    ? urlValues
                    : deserializeValue(urlValue, defaultValue);
                (filters as Record<keyof T, FilterValue>)[key] = value as T[keyof T];
            }
        });

        return filters;
    }, [syncUrl, urlKeys, initialValues, searchParams]);

    const [filters, setFiltersState] = useState<T>(getInitialFilters);

    // Sync from URL on mount/change
    useEffect(() => {
        if (syncUrl) {
            setFiltersState(getInitialFilters());
        }
    }, [syncUrl, searchParams, getInitialFilters]);

    // Debounced URL update using inline implementation to avoid generic type issues
    const updateUrlTimerRef = useRef<NodeJS.Timeout | null>(null);

    const updateUrl = useCallback(
        (newFilters: T) => {
            if (!syncUrl) return;

            if (updateUrlTimerRef.current) {
                clearTimeout(updateUrlTimerRef.current);
            }

            updateUrlTimerRef.current = setTimeout(() => {
                const params = new URLSearchParams();
                const keysToSync = urlKeys || (Object.keys(initialValues) as (keyof T)[]);

                keysToSync.forEach((key) => {
                    const value = newFilters[key];
                    const serialized = serializeValue(value);

                    if (serialized !== undefined) {
                        if (Array.isArray(serialized)) {
                            serialized.forEach((v) => params.append(String(key), v));
                        } else {
                            params.set(String(key), serialized);
                        }
                    }
                });

                const queryString = params.toString();
                router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
            }, debounceMs);
        },
        [syncUrl, urlKeys, initialValues, pathname, router, debounceMs]
    );

    // Set single filter
    const setFilter = useCallback(
        <K extends keyof T>(key: K, value: T[K]) => {
            setFiltersState((prev) => {
                const newFilters = { ...prev, [key]: value };
                updateUrl(newFilters);
                onChange?.(newFilters);
                return newFilters;
            });
        },
        [updateUrl, onChange]
    );

    // Set multiple filters
    const setFilters = useCallback(
        (newFilters: Partial<T>) => {
            setFiltersState((prev) => {
                const merged = { ...prev, ...newFilters };
                updateUrl(merged);
                onChange?.(merged);
                return merged;
            });
        },
        [updateUrl, onChange]
    );

    // Remove filter
    const removeFilter = useCallback(
        (key: keyof T) => {
            setFiltersState((prev) => {
                const newFilters = { ...prev, [key]: initialValues[key] };
                updateUrl(newFilters);
                onChange?.(newFilters);
                return newFilters;
            });
        },
        [initialValues, updateUrl, onChange]
    );

    // Clear all filters
    const clearFilters = useCallback(() => {
        setFiltersState(initialValues);
        updateUrl(initialValues);
        onChange?.(initialValues);
    }, [initialValues, updateUrl, onChange]);

    // Reset to initial (alias)
    const resetFilters = clearFilters;

    // Toggle value in array filter
    const toggleArrayFilter = useCallback(
        (key: keyof T, value: string) => {
            setFiltersState((prev) => {
                const current = prev[key];
                if (!Array.isArray(current)) return prev;

                const newArray = current.includes(value)
                    ? current.filter((v) => v !== value)
                    : [...current, value];

                const newFilters = { ...prev, [key]: newArray as T[keyof T] };
                updateUrl(newFilters);
                onChange?.(newFilters);
                return newFilters;
            });
        },
        [updateUrl, onChange]
    );

    // Get active (non-empty) filters
    const activeFilters = useMemo(() => {
        const active: Partial<T> = {};
        Object.entries(filters).forEach(([key, value]) => {
            if (!isEmptyValue(value) && value !== initialValues[key as keyof T]) {
                active[key as keyof T] = value as T[keyof T];
            }
        });
        return active;
    }, [filters, initialValues]);

    const activeCount = Object.keys(activeFilters).length;
    const isDirty = activeCount > 0;

    // Filter params for API calls
    const filterParams = useMemo(() => {
        const params: Record<string, string | string[]> = {};
        Object.entries(filters).forEach(([key, value]) => {
            const serialized = serializeValue(value);
            if (serialized !== undefined) {
                params[key] = serialized;
            }
        });
        return params;
    }, [filters]);

    // Query string for API
    const queryString = useMemo(() => {
        const params = new URLSearchParams();
        Object.entries(filterParams).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((v) => params.append(key, v));
            } else {
                params.set(key, value);
            }
        });
        return params.toString();
    }, [filterParams]);

    return useMemo(
        () => ({
            filters,
            activeFilters,
            activeCount,
            isDirty,
            setFilter,
            setFilters,
            removeFilter,
            clearFilters,
            resetFilters,
            toggleArrayFilter,
            filterParams,
            queryString,
        }),
        [
            filters, activeFilters, activeCount, isDirty,
            setFilter, setFilters, removeFilter, clearFilters,
            resetFilters, toggleArrayFilter, filterParams, queryString,
        ]
    );
}

export default useFilter;
