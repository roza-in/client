/**
 * ROZX Healthcare Platform - Query Provider
 * 
 * React Query (TanStack Query) configuration for data fetching.
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';
import { env } from '@/config';

// =============================================================================
// Types
// =============================================================================

interface QueryProviderProps {
    children: ReactNode;
}

// =============================================================================
// Query Client Configuration
// =============================================================================

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // Don't refetch on window focus in production
                refetchOnWindowFocus: !env.debug,
                // Retry failed requests up to 3 times
                retry: 3,
                // Stale time: 5 minutes
                staleTime: 5 * 60 * 1000,
                // Cache time: 30 minutes
                gcTime: 30 * 60 * 1000,
                // Refetch on reconnect
                refetchOnReconnect: true,
            },
            mutations: {
                // Retry mutations once on failure
                retry: 1,
            },
        },
    });
}

// Global query client instance for SSR
let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
    if (typeof window === 'undefined') {
        // Server: always make a new query client
        return makeQueryClient();
    } else {
        // Browser: make a new query client if we don't already have one
        // This is important for initial render to avoid hydration mismatches
        if (!browserQueryClient) {
            browserQueryClient = makeQueryClient();
        }
        return browserQueryClient;
    }
}

// =============================================================================
// Provider Component
// =============================================================================

export function QueryProvider({ children }: QueryProviderProps) {
    // Use useState to create query client to ensure it's the same instance
    // across re-renders but unique per client
    const [queryClient] = useState(() => getQueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {/* Show devtools only in development */}
            {env.debug && (
                <ReactQueryDevtools
                    initialIsOpen={false}
                    buttonPosition="bottom-left"
                />
            )}
        </QueryClientProvider>
    );
}

// =============================================================================
// Export Query Client for Direct Use
// =============================================================================

export { getQueryClient };

export default QueryProvider;
