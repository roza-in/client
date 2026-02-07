'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/slices/auth.slice';
import { LoadingSpinner } from '@/components/shared';
import { getDashboardUrl, isSubdomainEnabled, type UserRole } from '@/config/subdomains';

/**
 * OAuth Callback Page
 * Handles Supabase OAuth redirect with tokens in URL hash
 * Sends tokens to backend to create session, then redirects to dashboard
 */
export default function CallbackPage() {
    const router = useRouter();
    const { login } = useAuthStore();
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        const processCallback = async () => {
            try {
                // Parse hash fragment (tokens are after #)
                const hash = window.location.hash.substring(1);
                const params = new URLSearchParams(hash);

                const accessToken = params.get('access_token');
                const refreshToken = params.get('refresh_token');
                const errorParam = params.get('error');
                const errorDescription = params.get('error_description');

                // Handle OAuth errors
                if (errorParam) {
                    setError(errorDescription || errorParam);
                    setIsProcessing(false);
                    return;
                }

                if (!accessToken) {
                    setError('No access token received from OAuth provider');
                    setIsProcessing(false);
                    return;
                }

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

                // Determine redirect path FIRST, before any state updates
                const role = (data.data?.user?.role || 'patient') as UserRole;

                // Check for explicit redirect in URL query
                const searchParams = new URLSearchParams(window.location.search);
                const redirectUrl = searchParams.get('redirect');

                // Calculate final destination
                let destination: string;
                if (redirectUrl) {
                    destination = redirectUrl;
                } else if (isSubdomainEnabled()) {
                    destination = getDashboardUrl(role);
                } else {
                    destination = `/${role}`;
                }

                // Store auth state (for local state sync, cookies already set by server)
                if (data.data?.user) {
                    login({
                        user: data.data.user,
                        tokens: data.data.tokens || {},
                        isNewUser: data.data.isNewUser || false
                    });
                }

                // CRITICAL: Redirect immediately - don't let React re-render
                window.location.replace(destination);

            } catch (err) {
                console.error('OAuth callback error:', err);
                setError(err instanceof Error ? err.message : 'Authentication failed');
                setIsProcessing(false);
            }
        };

        processCallback();
    }, [router, login]);

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
                <p className="text-sm text-muted-foreground">Redirecting...</p>
            </div>
        </div>
    );
}
