'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

/**
 * Dashboard-scoped error boundary.
 * Renders inside the sidebar/header layout so the user retains navigation.
 */
export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        console.error('Dashboard error:', error);
    }, [error]);

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 mb-5">
                    <AlertCircle className="h-7 w-7 text-destructive" />
                </div>

                <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
                <p className="text-sm text-muted-foreground mb-6">
                    An error occurred while loading this page. Your sidebar and navigation are still available.
                </p>

                <div className="flex gap-3 justify-center">
                    <button
                        onClick={reset}
                        className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
                    >
                        <Home className="h-4 w-4" />
                        Go Home
                    </Link>
                </div>

                {error.digest && (
                    <p className="mt-5 text-xs text-muted-foreground">
                        Error ID: {error.digest}
                    </p>
                )}

                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-5">
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="text-sm text-muted-foreground underline"
                        >
                            {showDetails ? 'Hide' : 'Show'} details
                        </button>
                        {showDetails && (
                            <pre className="mt-3 p-4 bg-muted rounded-lg text-left text-xs overflow-auto max-h-48">
                                {error.message}
                                {error.stack && `\n\n${error.stack}`}
                            </pre>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
