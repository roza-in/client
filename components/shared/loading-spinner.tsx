/**
 * Shared Components - Loading Spinner
 */

'use client';

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-3',
    xl: 'h-12 w-12 border-4',
};

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
    return (
        <div
            className={cn(
                'animate-spin rounded-full border-teal-600 border-t-transparent',
                sizeClasses[size],
                className
            )}
            role="status"
            aria-label="Loading"
        />
    );
}

interface LoadingOverlayProps {
    message?: string;
}

export function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
                <LoadingSpinner size="xl" />
                <p className="text-sm text-muted-foreground">{message}</p>
            </div>
        </div>
    );
}

interface PageLoaderProps {
    message?: string;
}

export function PageLoader({ message }: PageLoaderProps) {
    return (
        <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <LoadingSpinner size="lg" />
                {message && <p className="text-sm text-muted-foreground">{message}</p>}
            </div>
        </div>
    );
}

export default LoadingSpinner;
