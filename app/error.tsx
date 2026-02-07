'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        // Log error to monitoring service
        console.error('Page error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-6">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
                <p className="text-muted-foreground mb-6">
                    We encountered an unexpected error. Please try again.
                </p>

                <div className="flex gap-3 justify-center">
                    <button
                        onClick={reset}
                        className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </button>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="rounded-lg border px-6 py-2.5 text-sm font-medium hover:bg-muted"
                    >
                        Go Home
                    </button>
                </div>

                {error.digest && (
                    <p className="mt-6 text-xs text-muted-foreground">
                        Error ID: {error.digest}
                    </p>
                )}

                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-6">
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="text-sm text-muted-foreground underline"
                        >
                            {showDetails ? 'Hide' : 'Show'} details
                        </button>
                        {showDetails && (
                            <pre className="mt-4 p-4 bg-muted rounded-lg text-left text-xs overflow-auto max-h-48">
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
