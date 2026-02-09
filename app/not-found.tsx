'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
            <div className="relative">
                <h1 className="text-[150px] font-bold text-muted-foreground/20 md:text-[200px]">
                    404
                </h1>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-4xl">🏥</span>
                    </div>
                </div>
            </div>

            <h2 className="mt-4 text-2xl font-bold">Page Not Found</h2>
            <p className="mt-2 max-w-md text-muted-foreground">
                Oops! The page you're looking for doesn't exist or has been moved.
                Let's get you back on track.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                    <Home className="h-4 w-4" />
                    Go Home
                </Link>
                <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-medium hover:bg-muted transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Go Back
                </button>
            </div>
        </div>
    );
}
