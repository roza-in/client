/**
 * Rozx Healthcare Platform - Combined Providers
 * 
 * Wraps all application providers in the correct order.
 */

'use client';

import { type ReactNode } from 'react';
import { ThemeProvider } from './theme-provider';
import { ToastProvider } from './toast-provider';
import { QueryProvider } from './query-provider';
import { AuthProvider } from './auth-provider';

// =============================================================================
// Types
// =============================================================================

interface ProvidersProps {
    children: ReactNode;
}

// =============================================================================
// Combined Provider Component
// =============================================================================

/**
 * Wraps all application providers in the correct nesting order:
 * 1. QueryProvider - Data fetching (outermost for cache access)
 * 2. ThemeProvider - Theme context 
 * 3. ToastProvider - Toast notifications (needs theme)
 * 4. AuthProvider - Authentication (innermost, may trigger toasts)
 */
export function Providers({ children }: ProvidersProps) {
    return (
        <QueryProvider>
            <ThemeProvider>
                <ToastProvider>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </ToastProvider>
            </ThemeProvider>
        </QueryProvider>
    );
}

// =============================================================================
// Individual Provider Exports
// =============================================================================

export { ThemeProvider } from './theme-provider';
export { ToastProvider, ToasterComponent } from './toast-provider';
export { QueryProvider, getQueryClient } from './query-provider';
export { AuthProvider, useAuthContext } from './auth-provider';

export default Providers;
