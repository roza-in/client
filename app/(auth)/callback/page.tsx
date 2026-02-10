'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/slices/auth.slice';
import { LoadingSpinner } from '@/components/shared';
import { getDashboardUrl, isSubdomainEnabled, type UserRole } from '@/config/subdomains';

/**
 * OAuth Callback Page Content
 * Handles Supabase OAuth redirect with tokens in URL hash or code in query params
 */
function CallbackContent() {
    const router = useRouter();
    const { login } = useAuthStore();
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        const processCallback = async () => {
            try {
                // 1. Handle PKCE Flow (code in query params) - Standard & Secure
                const code = searchParams.get('code');
                const errorParam = searchParams.get('error');
                const errorDescription = searchParams.get('error_description');

                if (errorParam) {
                    throw new Error(errorDescription || errorParam);
                }

                if (code) {
                    // Exchange code for session via backend
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

                    // Call GET /auth/google/callback?code=...
                    // Note: backend handles the exchange and sets HttpOnly cookies
                    const response = await fetch(`${apiUrl}/auth/google/callback?code=${code}`, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(errorData.message || 'Authentication failed');
                    }

                    const data = await response.json();

                    if (data.data?.user) {
                        login({
                            user: data.data.user,
                            tokens: data.data.tokens || {},
                            isNewUser: data.data.isNewUser || false
                        });

                        // Handle Redirect
                        handleRedirect(data.data.user);
                        return;
                    }
                }

                // 2. Handle Implicit Flow (tokens in hash) - Legacy/Fallback
                // Only run on client-side
                if (typeof window !== 'undefined') {
                    const hash = window.location.hash.substring(1);
                    if (hash) {
                        const params = new URLSearchParams(hash);
                        const accessToken = params.get('access_token');
                        const errorHash = params.get('error');
                        const errorDescHash = params.get('error_description');

                        if (errorHash) {
                            throw new Error(errorDescHash || errorHash);
                        }

                        if (accessToken) {
                            // Decode the JWT to get user info (for userId)
                            const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
                            const userId = tokenPayload.sub;

                            // Send tokens to our backend to create a session
                            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
                            const response = await fetch(`${apiUrl}/auth/google/callback`, {
                                method: 'POST',
                                credentials: 'include',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    accessToken,
                                    userId,
                                }),
                            });

                            if (!response.ok) {
                                const errorData = await response.json().catch(() => ({}));
                                throw new Error(errorData.message || 'Authentication failed');
                            }

                            const data = await response.json();

                            if (data.data?.user) {
                                login({
                                    user: data.data.user,
                                    tokens: data.data.tokens || {},
                                    isNewUser: data.data.isNewUser || false
                                });
                                // Handle Redirect
                                handleRedirect(data.data.user);
                                return;
                            }
                        }
                    }
                }

            } catch (err) {
                console.error('OAuth callback error:', err);
                setError(err instanceof Error ? err.message : 'Authentication failed');
            }
        };

        const handleRedirect = (user: any) => {
            const role = (user.role || 'patient') as UserRole;
            const explicitRedirect = searchParams.get('redirect');

            let destination: string;
            if (explicitRedirect) {
                destination = explicitRedirect;
            } else if (isSubdomainEnabled()) {
                destination = getDashboardUrl(role);
            } else {
                destination = `/${role}`;
            }

            // CRITICAL: Redirect immediately
            window.location.replace(destination);
        };

        processCallback();
    }, [router, login, searchParams]);

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg text-center">
                    <div className="mb-4 rounded-full bg-red-100 p-3 text-red-600 mx-auto w-fit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Authentication Failed</h2>
                    <p className="text-sm text-muted-foreground mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <LoadingSpinner size="lg" className="mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">Completing secure login...</p>
            </div>
        </div>
    );
}

export default function CallbackPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        }>
            <CallbackContent />
        </Suspense>
    );
}
