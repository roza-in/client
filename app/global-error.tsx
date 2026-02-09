'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <html lang="en">
            <body>
                <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center bg-background">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                        <AlertTriangle className="h-10 w-10 text-destructive" />
                    </div>

                    <h1 className="mt-6 text-2xl font-bold">Something went wrong!</h1>
                    <p className="mt-2 max-w-md text-muted-foreground">
                        We're sorry, an unexpected error occurred. Our team has been notified.
                    </p>

                    {error.digest && (
                        <p className="mt-4 text-xs text-muted-foreground">
                            Error ID: {error.digest}
                        </p>
                    )}

                    <div className="mt-8 flex gap-4">
                        <button
                            onClick={reset}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Try Again
                        </button>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-medium hover:bg-muted"
                        >
                            <Home className="h-4 w-4" />
                            Go Home
                        </Link>
                    </div>
                </div>
            </body>
        </html>
    );
}
