/**
 * Shared Components - Data Table
 */

'use client';

import { cn } from '@/lib/utils';
import { LoadingSpinner } from './loading-spinner';
import { EmptyState } from './empty-state';
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from 'lucide-react';

// =============================================================================
// Types
// =============================================================================

export interface Column<T> {
    key: string;
    header: string;
    render?: (item: T, index: number) => React.ReactNode;
    sortable?: boolean;
    className?: string;
}

export interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyExtractor: (item: T) => string;
    isLoading?: boolean;
    emptyMessage?: string;
    onRowClick?: (item: T) => void;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    onSort?: (key: string) => void;
    className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function DataTable<T>({
    columns,
    data,
    keyExtractor,
    isLoading = false,
    emptyMessage = 'No data found',
    onRowClick,
    sortBy,
    sortOrder,
    onSort,
    className,
}: DataTableProps<T>) {
    const getSortIcon = (key: string) => {
        if (sortBy !== key) {
            return <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />;
        }
        return sortOrder === 'asc' ? (
            <ChevronUp className="h-4 w-4" />
        ) : (
            <ChevronDown className="h-4 w-4" />
        );
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[200px] items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <EmptyState
                icon={Search}
                title={emptyMessage}
                description="Try adjusting your filters or search criteria."
            />
        );
    }

    return (
        <div className={cn('w-full overflow-auto', className)}>
            <table className="w-full caption-bottom text-sm">
                <thead className="border-b bg-muted/50">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className={cn(
                                    'h-12 px-4 text-left align-middle font-medium text-muted-foreground',
                                    column.sortable && 'cursor-pointer select-none hover:text-foreground',
                                    column.className
                                )}
                                onClick={() => column.sortable && onSort?.(column.key)}
                            >
                                <div className="flex items-center gap-2">
                                    {column.header}
                                    {column.sortable && getSortIcon(column.key)}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr
                            key={keyExtractor(item)}
                            className={cn(
                                'border-b transition-colors hover:bg-muted/50',
                                onRowClick && 'cursor-pointer'
                            )}
                            onClick={() => onRowClick?.(item)}
                        >
                            {columns.map((column) => (
                                <td key={column.key} className={cn('p-4 align-middle', column.className)}>
                                    {column.render
                                        ? column.render(item, index)
                                        : (item as Record<string, unknown>)[column.key]?.toString()}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DataTable;
