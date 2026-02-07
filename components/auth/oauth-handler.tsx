'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { LoadingSpinner } from '@/components/shared';

/**
 * OAuth Token Handler
 * 
 * Detects OAuth tokens in URL hash (from Supabase OAuth redirect) 
 * and redirects to the callback page for processing.
 * 
 * SSR-compatible: renders children by default, only shows loading
 * after mount if tokens are detected.
 */
export function OAuthHandler({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        // Skip if already on callback page
        if (pathname === '/callback') return;

        const hash = window.location.hash;

        // Check if OAuth tokens are present in URL hash
        if (hash && hash.includes('access_token=')) {
            setIsRedirecting(true);
            // Redirect immediately to callback page with the hash
            window.location.replace(`/callback${hash}`);
        }
    }, [pathname]);

    // Show loading spinner while redirecting (after tokens detected)
    if (isRedirecting) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="text-center">
                    <LoadingSpinner size="lg" className="mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Completing sign in...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

export default OAuthHandler;


