/**
 * ROZX Healthcare Platform - Theme Provider
 * 
 * Handles dark/light mode with system preference support.
 * Uses next-themes for SSR-compatible theme switching.
 */

'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ReactNode } from 'react';

// =============================================================================
// Types
// =============================================================================

interface ThemeProviderProps {
    children: ReactNode;
    /** Default theme (default: 'system') */
    defaultTheme?: 'light' | 'dark' | 'system';
    /** Storage key for theme preference */
    storageKey?: string;
    /** Enable system theme detection */
    enableSystem?: boolean;
    /** Disable transitions on theme change to prevent flash */
    disableTransitionOnChange?: boolean;
}

// =============================================================================
// Provider Component
// =============================================================================

export function ThemeProvider({
    children,
    defaultTheme = 'system',
    storageKey = 'rozx-theme',
    enableSystem = true,
    disableTransitionOnChange = false,
}: ThemeProviderProps) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme={defaultTheme}
            storageKey={storageKey}
            enableSystem={enableSystem}
            disableTransitionOnChange={disableTransitionOnChange}
        >
            {children}
        </NextThemesProvider>
    );
}

export default ThemeProvider;
