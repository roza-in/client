/**
 * Shared Components - Pagination
 */

'use client';

import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange?: (page: number) => void;
    maxVisiblePages?: number;
    showFirstLast?: boolean;
    className?: string;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    maxVisiblePages = 5,
    showFirstLast = true,
    className,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const getPageNumbers = (): (number | 'ellipsis')[] => {
        const pages: (number | 'ellipsis')[] = [];
        const half = Math.floor(maxVisiblePages / 2);

        let start = Math.max(1, currentPage - half);
        let end = Math.min(totalPages, currentPage + half);

        if (currentPage <= half) {
            end = Math.min(totalPages, maxVisiblePages);
        }
        if (currentPage > totalPages - half) {
            start = Math.max(1, totalPages - maxVisiblePages + 1);
        }

        if (showFirstLast && start > 1) {
            pages.push(1);
            if (start > 2) pages.push('ellipsis');
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (showFirstLast && end < totalPages) {
            if (end < totalPages - 1) pages.push('ellipsis');
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <nav
            className={cn('flex items-center justify-center gap-1', className)}
            aria-label="Pagination"
        >
            {/* Previous */}
            <button
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={currentPage === 1}
                className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-md border',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    'hover:bg-muted'
                )}
                aria-label="Previous page"
            >
                <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Page Numbers */}
            {pageNumbers.map((page, index) => {
                if (page === 'ellipsis') {
                    return (
                        <span
                            key={`ellipsis-${index}`}
                            className="flex h-9 w-9 items-center justify-center"
                        >
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </span>
                    );
                }

                const isActive = page === currentPage;

                return (
                    <button
                        key={page}
                        onClick={() => onPageChange?.(page)}
                        className={cn(
                            'flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium',
                            isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                        )}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        {page}
                    </button>
                );
            })}

            {/* Next */}
            <button
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-md border',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    'hover:bg-muted'
                )}
                aria-label="Next page"
            >
                <ChevronRight className="h-4 w-4" />
            </button>
        </nav>
    );
}

// Compact version for small spaces
export function PaginationCompact({
    currentPage,
    totalPages,
    onPageChange,
    className,
}: Omit<PaginationProps, 'maxVisiblePages' | 'showFirstLast'>) {
    if (totalPages <= 1) return null;

    return (
        <div className={cn('flex items-center gap-4', className)}>
            <button
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={currentPage === 1}
                className="text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
                Previous
            </button>
            <span className="text-sm">
                Page {currentPage} of {totalPages}
            </span>
            <button
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
}

export default Pagination;
