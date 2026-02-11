/**
 * Rozx Healthcare Platform - Toast Hook
 * 
 * Wrapper around Sonner for toast notifications with preset styles.
 */

'use client';

import { toast as sonnerToast, type ExternalToast } from 'sonner';
import { useCallback, useMemo } from 'react';

// =============================================================================
// Types
// =============================================================================

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface ToastOptions extends ExternalToast {
    /** Duration in milliseconds */
    duration?: number;
    /** Show close button */
    closeButton?: boolean;
}

export interface UseToastReturn {
    toast: (message: string, options?: ToastOptions) => string | number;
    success: (message: string, options?: ToastOptions) => string | number;
    error: (message: string, options?: ToastOptions) => string | number;
    warning: (message: string, options?: ToastOptions) => string | number;
    info: (message: string, options?: ToastOptions) => string | number;
    loading: (message: string, options?: ToastOptions) => string | number;
    promise: <T>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((error: Error) => string);
        },
        options?: ToastOptions
    ) => Promise<T>;
    dismiss: (id?: string | number) => void;
    dismissAll: () => void;
}

// =============================================================================
// Default Options
// =============================================================================

const defaultOptions: ToastOptions = {
    duration: 4000,
    closeButton: true,
};

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * Toast notification hook with preset methods.
 * 
 * @example
 * const { success, error, promise } = useToast();
 * 
 * // Simple toasts
 * success('Appointment booked successfully');
 * error('Failed to book appointment');
 * 
 * // Promise toast
 * promise(bookAppointment(), {
 *   loading: 'Booking appointment...',
 *   success: 'Appointment booked!',
 *   error: 'Failed to book appointment',
 * });
 */
export function useToast(): UseToastReturn {
    const toast = useCallback((message: string, options?: ToastOptions) => {
        return sonnerToast(message, { ...defaultOptions, ...options });
    }, []);

    const success = useCallback((message: string, options?: ToastOptions) => {
        return sonnerToast.success(message, { ...defaultOptions, ...options });
    }, []);

    const error = useCallback((message: string, options?: ToastOptions) => {
        return sonnerToast.error(message, {
            ...defaultOptions,
            duration: 6000, // Longer duration for errors
            ...options
        });
    }, []);

    const warning = useCallback((message: string, options?: ToastOptions) => {
        return sonnerToast.warning(message, { ...defaultOptions, ...options });
    }, []);

    const info = useCallback((message: string, options?: ToastOptions) => {
        return sonnerToast.info(message, { ...defaultOptions, ...options });
    }, []);

    const loading = useCallback((message: string, options?: ToastOptions) => {
        return sonnerToast.loading(message, {
            ...defaultOptions,
            duration: Infinity, // Loading toasts stay until dismissed
            ...options
        });
    }, []);

    const promise = useCallback(<T,>(
        promiseArg: Promise<T>,
        messages: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((error: Error) => string);
        },
        options?: ToastOptions
    ): Promise<T> => {
        return sonnerToast.promise(promiseArg, {
            loading: messages.loading,
            success: messages.success,
            error: messages.error,
            ...defaultOptions,
            ...options,
        }) as unknown as Promise<T>;
    }, []);

    const dismiss = useCallback((id?: string | number) => {
        sonnerToast.dismiss(id);
    }, []);

    const dismissAll = useCallback(() => {
        sonnerToast.dismiss();
    }, []);

    return useMemo(
        () => ({
            toast,
            success,
            error,
            warning,
            info,
            loading,
            promise,
            dismiss,
            dismissAll,
        }),
        [toast, success, error, warning, info, loading, promise, dismiss, dismissAll]
    );
}

// =============================================================================
// Standalone Toast Functions (for use outside React)
// =============================================================================

export const toast = {
    default: (message: string, options?: ToastOptions) =>
        sonnerToast(message, { ...defaultOptions, ...options }),

    success: (message: string, options?: ToastOptions) =>
        sonnerToast.success(message, { ...defaultOptions, ...options }),

    error: (message: string, options?: ToastOptions) =>
        sonnerToast.error(message, { ...defaultOptions, duration: 6000, ...options }),

    warning: (message: string, options?: ToastOptions) =>
        sonnerToast.warning(message, { ...defaultOptions, ...options }),

    info: (message: string, options?: ToastOptions) =>
        sonnerToast.info(message, { ...defaultOptions, ...options }),

    loading: (message: string, options?: ToastOptions) =>
        sonnerToast.loading(message, { ...defaultOptions, duration: Infinity, ...options }),

    promise: <T,>(
        promise: Promise<T>,
        messages: { loading: string; success: string; error: string },
        options?: ToastOptions
    ) => sonnerToast.promise(promise, messages),

    dismiss: (id?: string | number) => sonnerToast.dismiss(id),

    dismissAll: () => sonnerToast.dismiss(),
} as const;

export default useToast;
