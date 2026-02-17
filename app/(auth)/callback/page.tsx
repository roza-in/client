'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/slices/auth.slice';
import { LoadingSpinner } from '@/components/shared';
import { getDashboardUrl, getLoginUrl, isSubdomainEnabled, type UserRole } from '@/config/subdomains';

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
                // ── 1. Handle error params from Supabase ──────────────
                const errorParam = searchParams.get('error');
                const errorDescription = searchParams.get('error_description');

                if (errorParam) {
                    throw new Error(errorDescription || errorParam);
                }

                // ── 2. Handle PKCE Flow (code in query params) — Standard & Secure ──
                const code = searchParams.get('code');

                if (code) {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

                    // Resolve the OAuth state for PKCE code_verifier lookup.
                    // Priority: URL params > sessionStorage > empty (server cookie/fallback)
                    let resolvedState = searchParams.get('rozx_state') || searchParams.get('state') || '';
                    if (!resolvedState) {
                        try { resolvedState = sessionStorage.getItem('rozx_oauth_state') || ''; } catch { /* SSR */ }
                    }
                    // Clean up sessionStorage after reading
                    try { sessionStorage.removeItem('rozx_oauth_state'); } catch { /* SSR */ }

                    const params = new URLSearchParams({ code, state: resolvedState });

                    // Note: Do NOT set Content-Type on a GET request — 'application/json'
                    // is not a CORS-safe header and would trigger a CORS preflight (OPTIONS)
                    // that adds latency and can fail if the server doesn't handle it properly.
                    const response = await fetch(`${apiUrl}/auth/google/callback?${params}`, {
                        method: 'GET',
                        credentials: 'include',
                    });

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        console.error('[OAuth Callback] Server error:', response.status, errorData);
                        throw new Error(errorData.message || `Authentication failed (${response.status})`);
                    }

                    const data = await response.json();

                    if (data.data?.user) {
                        login({
                            user: data.data.user,
                            isNewUser: data.data.isNewUser || false
                        });

                        handleRedirect(data.data.user);
                        return;
                    }
                }

                // ── 3. Handle Implicit Flow (tokens in URL hash) — Fallback ──
                // Supabase may return tokens in the hash when PKCE is unavailable.
                // The hash is only available client-side (window.location.hash).
                const hash = typeof window !== 'undefined' ? window.location.hash : '';
                if (hash) {
                    const hashParams = new URLSearchParams(hash.replace('#', ''));
                    const accessToken = hashParams.get('access_token');
                    const userId = hashParams.get('user_id') || hashParams.get('provider_token');

                    if (accessToken) {
                        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

                        const response = await fetch(`${apiUrl}/auth/google/callback`, {
                            method: 'POST',
                            credentials: 'include',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ accessToken, userId }),
                        });

                        if (!response.ok) {
                            const errorData = await response.json().catch(() => ({}));
                            console.error('[OAuth Callback] Token exchange error:', response.status, errorData);
                            throw new Error(errorData.message || `Authentication failed (${response.status})`);
                        }

                        const data = await response.json();

                        if (data.data?.user) {
                            login({
                                user: data.data.user,
                                isNewUser: data.data.isNewUser || false
                            });

                            handleRedirect(data.data.user);
                            return;
                        }
                    }
                }

                // No valid code or token found
                throw new Error('No authorization code found in callback URL');

            } catch (err) {
                console.error('[OAuth Callback] Error:', err);
                setError(err instanceof Error ? err.message : 'Authentication failed');
            }
        };

        const handleRedirect = (user: any) => {
            const role = (user.role || 'patient') as UserRole;
            const explicitRedirect = searchParams.get('redirect');

            let destination: string;
            // Validate redirect URL — must be a relative path, not protocol-relative
            if (explicitRedirect && explicitRedirect.startsWith('/') && !explicitRedirect.startsWith('//') && !explicitRedirect.includes('\\')) {
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
                        onClick={() => window.location.replace(getLoginUrl())}
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
