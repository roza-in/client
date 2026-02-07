/**
 * Doctor Components - Doctor List
 */

'use client';

import { cn } from '@/lib/utils';
import { DoctorCard } from './doctor-card';
import { LoadingSpinner, EmptyState, Pagination } from '@/components/shared';
import { Search, Filter } from 'lucide-react';
import type { DoctorListItem } from '@/types';

interface DoctorListProps {
    doctors: DoctorListItem[];
    isLoading?: boolean;
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    gridCols?: 1 | 2 | 3;
    className?: string;
}

export function DoctorList({
    doctors,
    isLoading = false,
    currentPage,
    totalPages,
    onPageChange,
    gridCols = 2,
    className,
}: DoctorListProps) {
    if (isLoading) {
        return (
            <div className="flex min-h-[300px] items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (doctors.length === 0) {
        return (
            <EmptyState
                icon={Search}
                title="No doctors found"
                description="Try adjusting your search filters or browse all doctors."
            />
        );
    }

    return (
        <div className={className}>
            <div
                className={cn(
                    'grid gap-4',
                    gridCols === 1 && 'grid-cols-1',
                    gridCols === 2 && 'grid-cols-1 md:grid-cols-2',
                    gridCols === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                )}
            >
                {doctors.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
            </div>

            {currentPage && totalPages && onPageChange && totalPages > 1 && (
                <div className="mt-8">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />
                </div>
            )}
        </div>
    );
}

// Doctor List Skeleton
export function DoctorListSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="rounded-xl border p-4 animate-pulse">
                    <div className="flex gap-4">
                        <div className="h-20 w-20 rounded-lg bg-muted" />
                        <div className="flex-1 space-y-2">
                            <div className="h-5 w-3/4 rounded bg-muted" />
                            <div className="h-4 w-1/2 rounded bg-muted" />
                            <div className="h-4 w-2/3 rounded bg-muted" />
                        </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <div className="h-4 w-16 rounded bg-muted" />
                        <div className="h-4 w-24 rounded bg-muted" />
                    </div>
                    <div className="mt-4 flex justify-between border-t pt-4">
                        <div className="flex gap-2">
                            <div className="h-6 w-16 rounded-full bg-muted" />
                            <div className="h-6 w-20 rounded-full bg-muted" />
                        </div>
                        <div className="h-6 w-16 rounded bg-muted" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default DoctorList;
