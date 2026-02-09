'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/auth-context';
import { AuthStoreInitializer } from '@/components/auth/store-initializer';
import { OAuthHandler } from '@/components/auth';

// Create a new QueryClient for each request (SSR-safe pattern)
function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000, // 1 minute
                refetchOnWindowFocus: false,
                retry: 1,
            },
            mutations: {
                retry: 0,
            },
        },
    });
}

// Browser: reuse the same QueryClient to preserve cache
let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
    if (typeof window === 'undefined') {
        // Server: always create a new QueryClient per request
        return makeQueryClient();
    }
    // Browser: reuse existing client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
}

export function Providers({ children }: { children: ReactNode }) {
    const queryClient = getQueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <AuthProvider>
                    <AuthStoreInitializer />
                    <OAuthHandler>
                        {children}
                    </OAuthHandler>
                    <Toaster
                        position="top-right"
                        richColors
                        closeButton
                        toastOptions={{
                            duration: 4000,
                        }}
                    />
                </AuthProvider>
            </ThemeProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

