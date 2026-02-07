import { LoadingSpinner } from '@/components/shared';

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
            <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-muted-foreground animate-pulse">Loading...</p>
            </div>
        </div>
    );
}
