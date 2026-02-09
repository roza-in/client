'use client';

import { cn } from '@/lib/utils';

type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';

interface SkeletonProps {
    className?: string;
    variant?: SkeletonVariant;
    width?: string | number;
    height?: string | number;
    lines?: number;
    animate?: boolean;
}

const variantStyles: Record<SkeletonVariant, string> = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
};

/**
 * Skeleton component for loading placeholders
 * Optimized with CSS animations instead of JS
 */
export function Skeleton({
    className,
    variant = 'text',
    width,
    height,
    lines = 1,
    animate = true,
}: SkeletonProps) {
    const baseStyles = cn(
        'bg-muted',
        animate && 'animate-pulse',
        variantStyles[variant],
        className
    );

    const style = {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
    };

    if (lines > 1) {
        return (
            <div className="space-y-2">
                {Array.from({ length: lines }).map((_, i) => (
                    <div
                        key={i}
                        className={cn(baseStyles, 'h-4', i === lines - 1 && 'w-3/4')}
                        style={i === lines - 1 ? undefined : style}
                    />
                ))}
            </div>
        );
    }

    return <div className={baseStyles} style={style} />;
}

// Pre-built skeleton variants for common use cases
export function SkeletonText({ className, lines = 1 }: { className?: string; lines?: number }) {
    return <Skeleton variant="text" lines={lines} className={cn('h-4 w-full', className)} />;
}

export function SkeletonAvatar({ className, size = 40 }: { className?: string; size?: number }) {
    return <Skeleton variant="circular" width={size} height={size} className={className} />;
}

export function SkeletonButton({ className }: { className?: string }) {
    return <Skeleton variant="rounded" className={cn('h-9 w-24', className)} />;
}

export function SkeletonCard({ className }: { className?: string }) {
    return (
        <div className={cn('rounded-xl border bg-card p-6 space-y-4', className)}>
            <div className="flex items-center gap-4">
                <SkeletonAvatar size={48} />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
            <Skeleton lines={3} />
            <div className="flex gap-2">
                <SkeletonButton />
                <SkeletonButton className="w-20" />
            </div>
        </div>
    );
}

export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
    return (
        <div className="w-full space-y-3">
            {/* Header */}
            <div className="flex gap-4 pb-2 border-b">
                {Array.from({ length: columns }).map((_, i) => (
                    <Skeleton key={i} className="h-4 flex-1" />
                ))}
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, rowIdx) => (
                <div key={rowIdx} className="flex gap-4 py-2">
                    {Array.from({ length: columns }).map((_, colIdx) => (
                        <Skeleton key={colIdx} className="h-4 flex-1" />
                    ))}
                </div>
            ))}
        </div>
    );
}

export function SkeletonList({ items = 3, className }: { items?: number; className?: string }) {
    return (
        <div className={cn('space-y-3', className)}>
            {Array.from({ length: items }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
                    <SkeletonAvatar size={40} />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}
