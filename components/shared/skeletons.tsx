'use client';

import { cn } from '@/lib/utils';
import { SkeletonAvatar } from '@/components/ui/skeleton';

/**
 * Skeleton for an appointment row item
 * Matches the structure of AppointmentRow component
 */
export function AppointmentRowSkeleton() {
    return (
        <div className="flex items-center gap-4 bg-card rounded-xl border p-4">
            {/* Doctor Avatar */}
            <div className="h-12 w-12 rounded-xl bg-muted animate-pulse shrink-0" />

            {/* Main Info */}
            <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2">
                    <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                    <div className="h-5 w-20 bg-muted rounded-full animate-pulse" />
                </div>
                <div className="h-3 w-40 bg-muted rounded animate-pulse" />
                <div className="flex items-center gap-3 mt-1.5">
                    <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-12 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-14 bg-muted rounded animate-pulse" />
                </div>
            </div>

            {/* Arrow */}
            <div className="h-5 w-5 bg-muted rounded animate-pulse shrink-0" />
        </div>
    );
}

/**
 * Skeleton for the appointments list
 */
export function AppointmentsListSkeleton({ count = 5 }: { count?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <AppointmentRowSkeleton key={i} />
            ))}
        </div>
    );
}

/**
 * Skeleton for doctor card in search results
 */
export function DoctorCardSkeleton() {
    return (
        <div className="bg-card rounded-xl border p-4 space-y-4">
            <div className="flex items-start gap-4">
                <SkeletonAvatar size={64} className="rounded-xl" />
                <div className="flex-1 space-y-2">
                    <div className="h-5 w-40 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                    <div className="flex gap-2">
                        <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
                        <div className="h-5 w-20 bg-muted rounded-full animate-pulse" />
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                <div className="h-9 w-24 bg-muted rounded-lg animate-pulse" />
            </div>
        </div>
    );
}

/**
 * Skeleton for doctor list
 */
export function DoctorsListSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: count }).map((_, i) => (
                <DoctorCardSkeleton key={i} />
            ))}
        </div>
    );
}

/**
 * Skeleton for time slot grid
 */
export function TimeSlotsGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="h-10 bg-muted rounded-lg animate-pulse" />
            ))}
        </div>
    );
}

/**
 * Skeleton for prescription card
 */
export function PrescriptionCardSkeleton() {
    return (
        <div className="bg-card rounded-xl border p-4 space-y-3">
            <div className="flex items-center justify-between">
                <div className="h-5 w-28 bg-muted rounded animate-pulse" />
                <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
            </div>
            <div className="space-y-2">
                <div className="h-4 w-48 bg-muted rounded animate-pulse" />
                <div className="h-3 w-32 bg-muted rounded animate-pulse" />
            </div>
            <div className="flex gap-2 pt-2">
                <div className="h-9 w-24 bg-muted rounded-lg animate-pulse" />
                <div className="h-9 w-20 bg-muted rounded-lg animate-pulse" />
            </div>
        </div>
    );
}

/**
 * Skeleton for queue item in reception dashboard
 */
export function QueueItemSkeleton() {
    return (
        <div className="flex items-center gap-4 bg-card rounded-xl border p-4">
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                <div className="h-3 w-24 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-8 w-20 bg-muted rounded-lg animate-pulse" />
        </div>
    );
}

/**
 * Skeleton for dashboard stats cards
 */
export function StatCardSkeleton() {
    return (
        <div className="bg-card rounded-xl border p-6 space-y-2">
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            <div className="h-8 w-16 bg-muted rounded animate-pulse" />
            <div className="h-3 w-32 bg-muted rounded animate-pulse" />
        </div>
    );
}

export function StatsGridSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div className={cn('grid gap-4', count <= 4 ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2 lg:grid-cols-3')}>
            {Array.from({ length: count }).map((_, i) => (
                <StatCardSkeleton key={i} />
            ))}
        </div>
    );
}
