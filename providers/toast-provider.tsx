/**
 * ROZX Healthcare Platform - Toast Provider
 * 
 * Provides toast notification functionality using Sonner.
 */

'use client';

import { Toaster } from 'sonner';
import { useTheme } from 'next-themes';
import { type ReactNode } from 'react';

// =============================================================================
// Types
// =============================================================================

interface ToastProviderProps {
    children: ReactNode;
}

// =============================================================================
// Provider Component
// =============================================================================

export function ToastProvider({ children }: ToastProviderProps) {
    const { theme, systemTheme } = useTheme();

    // Determine actual theme (considering system preference)
    const resolvedTheme = theme === 'system' ? systemTheme : theme;

    return (
        <>
            {children}
            <Toaster
                theme={resolvedTheme as 'light' | 'dark' | undefined}
                position="top-right"
                expand={false}
                richColors
                closeButton
                duration={4000}
                toastOptions={{
                    style: {
                        background: 'var(--card)',
                        color: 'var(--card-foreground)',
                        border: '1px solid var(--border)',
                    },
                    className: 'font-sans',
                }}
            />
        </>
    );
}

// =============================================================================
// Standalone Toaster Component (for use without provider)
// =============================================================================

export function ToasterComponent() {
    const { theme, systemTheme } = useTheme();
    const resolvedTheme = theme === 'system' ? systemTheme : theme;

    return (
        <Toaster
            theme={resolvedTheme as 'light' | 'dark' | undefined}
            position="top-right"
            expand={false}
            richColors
            closeButton
            duration={4000}
            toastOptions={{
                style: {
                    background: 'var(--card)',
                    color: 'var(--card-foreground)',
                    border: '1px solid var(--border)',
                },
            }}
        />
    );
}

export default ToastProvider;
