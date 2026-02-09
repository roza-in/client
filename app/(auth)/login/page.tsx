'use client';

import { useEffect, useState } from 'react';
import { LoginForm } from '@/components/auth';
import { LoadingSpinner } from '@/components/shared';

/**
 * Login Page with OAuth Hash Detection
 * If OAuth tokens are present in URL hash, redirect to callback page
 */
export default function LoginPage() {
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hash = window.location.hash;

            if (hash && hash.includes('access_token=')) {
                setIsRedirecting(true);
                window.location.href = `/callback${hash}`;
            }
        }
    }, []);

    if (isRedirecting) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner size="lg" className="mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Completing sign in...</p>
                </div>
            </div>
        );
    }

    return <LoginForm />;
}
