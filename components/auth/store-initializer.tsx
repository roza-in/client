'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/slices/auth.slice';
import { onUnauthorized, clearCsrfToken } from '@/lib/api/client';
import { clearSession } from '@/lib/auth/session';
import { getLoginUrl } from '@/config/subdomains';

export function AuthStoreInitializer() {
    const initialized = useRef(false);
    const initialize = useAuthStore((state) => state.initialize);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            initialize();

            // Register global 401 handler:
            // When the API client detects an unrecoverable 401 (refresh failed),
            // clear all persisted auth state and redirect to login.
            // Uses ?logout=true so the proxy clears httpOnly cookies that the
            // client cannot delete (they may still have a valid JWT exp but
            // the server session was revoked).
            onUnauthorized(() => {
                // Skip if we're already on the login page (e.g. during active logout)
                if (typeof window !== 'undefined' && window.location.pathname === '/login') {
                    return;
                }
                useAuthStore.getState().clearAuth();
                clearCsrfToken();
                clearSession();
                window.location.replace(getLoginUrl({ logout: 'true', session: 'expired' }));
            });
        }
    }, [initialize]);

    return null;
}
