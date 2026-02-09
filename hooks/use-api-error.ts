'use client';

import { useState, useCallback } from 'react';
import { ApiError, getErrorMessage } from '@/lib/api';

/**
 * Error state structure for components
 */
export interface ErrorState {
    message: string;
    code?: string;
    isRetryable: boolean;
    isTimeout: boolean;
    isNetwork: boolean;
    isAuth: boolean;
    isValidation: boolean;
    details?: unknown;
}

/**
 * Hook for handling API errors in components
 * Provides unified error state management with user-friendly messages
 */
export function useApiError() {
    const [error, setErrorState] = useState<ErrorState | null>(null);
    const [isErrorVisible, setIsErrorVisible] = useState(false);

    /**
     * Process an error and set the error state
     */
    const setError = useCallback((err: unknown) => {
        if (!err) {
            setErrorState(null);
            setIsErrorVisible(false);
            return;
        }

        const message = getErrorMessage(err);

        let errorState: ErrorState = {
            message,
            isRetryable: false,
            isTimeout: false,
            isNetwork: false,
            isAuth: false,
            isValidation: false,
        };

        if (err instanceof ApiError) {
            errorState = {
                message,
                code: err.code,
                isRetryable: err.isServerError() || err.isNetworkError() || err.isTimeoutError(),
                isTimeout: err.isTimeoutError(),
                isNetwork: err.isNetworkError(),
                isAuth: err.isAuthError(),
                isValidation: err.isValidationError(),
                details: err.details,
            };
        }

        setErrorState(errorState);
        setIsErrorVisible(true);
    }, []);

    /**
     * Clear the error state
     */
    const clearError = useCallback(() => {
        setErrorState(null);
        setIsErrorVisible(false);
    }, []);

    /**
     * Dismiss error (hide but keep state for reference)
     */
    const dismissError = useCallback(() => {
        setIsErrorVisible(false);
    }, []);

    /**
     * Wrap an async function with error handling
     */
    const handleAsync = useCallback(
        async <T>(asyncFn: () => Promise<T>, options?: { showError?: boolean }): Promise<T | null> => {
            try {
                clearError();
                return await asyncFn();
            } catch (err) {
                if (options?.showError !== false) {
                    setError(err);
                }
                return null;
            }
        },
        [clearError, setError]
    );

    return {
        error,
        isErrorVisible,
        setError,
        clearError,
        dismissError,
        handleAsync,
        hasError: !!error,
    };
}

/**
 * Hook for form-level error handling with field-specific errors
 */
export function useFormErrors<T extends Record<string, string>>() {
    const [errors, setErrors] = useState<Partial<T>>({});
    const [generalError, setGeneralError] = useState<string | null>(null);

    /**
     * Set a field-specific error
     */
    const setFieldError = useCallback((field: keyof T, message: string) => {
        setErrors((prev) => ({ ...prev, [field]: message }));
    }, []);

    /**
     * Clear a specific field error
     */
    const clearFieldError = useCallback((field: keyof T) => {
        setErrors((prev) => {
            const next = { ...prev };
            delete next[field];
            return next;
        });
    }, []);

    /**
     * Clear all errors
     */
    const clearAllErrors = useCallback(() => {
        setErrors({});
        setGeneralError(null);
    }, []);

    /**
     * Process API error and extract field errors if available
     */
    const setApiError = useCallback((err: unknown) => {
        if (err instanceof ApiError && err.isValidationError() && err.details) {
            // Handle validation errors with field details
            const details = err.details as Record<string, string | string[]>;
            const fieldErrors: Partial<T> = {};

            for (const [field, message] of Object.entries(details)) {
                const errorMessage = Array.isArray(message) ? message[0] : message;
                (fieldErrors as Record<string, string>)[field] = errorMessage;
            }

            setErrors(fieldErrors);
            return;
        }

        // Set as general error
        setGeneralError(getErrorMessage(err));
    }, []);

    /**
     * Check if a specific field has an error
     */
    const hasFieldError = useCallback(
        (field: keyof T) => !!errors[field],
        [errors]
    );

    /**
     * Get error for a specific field
     */
    const getFieldError = useCallback(
        (field: keyof T) => errors[field] || null,
        [errors]
    );

    return {
        errors,
        generalError,
        setFieldError,
        clearFieldError,
        clearAllErrors,
        setApiError,
        hasFieldError,
        getFieldError,
        hasErrors: Object.keys(errors).length > 0 || !!generalError,
    };
}

export default useApiError;
