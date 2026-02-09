'use client';

import React, { type ReactNode } from 'react';
import { Loading } from '@/components/ui/loading';
import { ErrorFallback } from '@/components/ui/error-boundary';
import { EmptyState, type EmptyStateVariant } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

// Re-export EmptyStateVariant for convenience
export type { EmptyStateVariant };

interface QueryStateProps<T> {
    /** Data from the query */
    data: T | undefined;
    /** Whether the query is loading */
    isLoading: boolean;
    /** Error from the query */
    error: Error | null;
    /** Function to refetch/retry the query */
    onRetry?: () => void;
    /** Children to render when data is available */
    children: (data: T) => ReactNode;
    /** Custom loading component */
    loadingComponent?: ReactNode;
    /** Custom error component */
    errorComponent?: ReactNode;
    /** Custom empty component */
    emptyComponent?: ReactNode;
    /** Empty state variant */
    emptyVariant?: EmptyStateVariant;
    /** Custom empty title */
    emptyTitle?: string;
    /** Custom empty description */
    emptyDescription?: string;
    /** Custom empty icon */
    emptyIcon?: LucideIcon;
    /** Empty state action */
    emptyAction?: {
        label: string;
        onClick: () => void;
    };
    /** Check if data is empty - defaults to checking array length or null/undefined */
    isEmpty?: (data: T) => boolean;
    /** Show loading as overlay instead of replacing content */
    loadingOverlay?: boolean;
    /** Loading title */
    loadingTitle?: string;
    /** Loading description */
    loadingDescription?: string;
    /** Use compact variants */
    compact?: boolean;
    /** Additional className */
    className?: string;
}

/**
 * QueryState component for handling loading, error, and empty states uniformly
 * Works seamlessly with TanStack Query
 */
export function QueryState<T>({
    data,
    isLoading,
    error,
    onRetry,
    children,
    loadingComponent,
    errorComponent,
    emptyComponent,
    emptyVariant = 'default',
    emptyTitle,
    emptyDescription,
    emptyIcon,
    emptyAction,
    isEmpty,
    loadingOverlay = false,
    loadingTitle = 'Loading...',
    loadingDescription,
    compact = false,
    className,
}: QueryStateProps<T>) {
    // Default isEmpty check
    const checkEmpty = isEmpty ?? ((d: T): boolean => {
        if (d === null || d === undefined) return true;
        if (Array.isArray(d)) return d.length === 0;
        if (typeof d === 'object') return Object.keys(d).length === 0;
        return false;
    });

    // Loading state
    if (isLoading) {
        if (loadingComponent) return <>{loadingComponent}</>;

        return (
            <div className={cn('relative', className)}>
                <Loading
                    title={loadingTitle}
                    description={loadingDescription}
                    fullscreen={false}
                    className={compact ? 'min-h-[200px]' : 'min-h-[300px]'}
                />
            </div>
        );
    }

    // Error state
    if (error) {
        if (errorComponent) return <>{errorComponent}</>;

        return (
            <ErrorFallback
                error={error}
                onRetry={onRetry}
                compact={compact}
                className={className}
            />
        );
    }

    // Empty state
    if (!data || checkEmpty(data)) {
        if (emptyComponent) return <>{emptyComponent}</>;

        return (
            <EmptyState
                variant={emptyVariant}
                title={emptyTitle}
                description={emptyDescription}
                icon={emptyIcon}
                action={emptyAction}
                compact={compact}
                className={className}
            />
        );
    }

    // Success state - render children with data
    return <>{children(data)}</>;
}

/**
 * Simpler hook-friendly wrapper for common patterns
 */
interface UseQueryStateOptions {
    emptyVariant?: EmptyStateVariant;
    emptyTitle?: string;
    emptyDescription?: string;
    compact?: boolean;
}

export function createQueryStateProps<T>(
    query: {
        data: T | undefined;
        isLoading: boolean;
        error: Error | null;
        refetch?: () => void;
    },
    options: UseQueryStateOptions = {}
) {
    return {
        data: query.data,
        isLoading: query.isLoading,
        error: query.error,
        onRetry: query.refetch,
        emptyVariant: options.emptyVariant,
        emptyTitle: options.emptyTitle,
        emptyDescription: options.emptyDescription,
        compact: options.compact,
    };
}
