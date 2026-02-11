/**
 * Rozx Healthcare Platform - API Error Handler
 * 
 * Custom error class and error handling utilities.
 */

// =============================================================================
// API Error Class
// =============================================================================

export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public code?: string,
        public details?: unknown
    ) {
        super(message);
        this.name = 'ApiError';
    }

    isAuthError(): boolean {
        return this.status === 401;
    }

    isForbiddenError(): boolean {
        return this.status === 403;
    }

    isNotFoundError(): boolean {
        return this.status === 404;
    }

    isValidationError(): boolean {
        return this.status === 400 || this.status === 422;
    }

    isRateLimitError(): boolean {
        return this.status === 429;
    }

    isServerError(): boolean {
        return this.status >= 500;
    }

    isNetworkError(): boolean {
        return this.status === 0 || this.code === 'NETWORK_ERROR';
    }

    isTimeoutError(): boolean {
        return this.status === 408 || this.code === 'TIMEOUT_ERROR';
    }
}

// =============================================================================
// Error Handling Utilities
// =============================================================================

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
    if (error instanceof ApiError) {
        // Map common error codes to friendly messages
        switch (error.code) {
            case 'INVALID_CREDENTIALS':
                return 'Invalid email or password';
            case 'USER_NOT_FOUND':
                return 'Account not found';
            case 'EMAIL_ALREADY_EXISTS':
                return 'An account with this email already exists';
            case 'PHONE_ALREADY_EXISTS':
                return 'An account with this phone number already exists';
            case 'INVALID_OTP':
                return 'Invalid or expired OTP';
            case 'OTP_EXPIRED':
                return 'OTP has expired. Please request a new one';
            case 'SLOT_NOT_AVAILABLE':
                return 'This slot is no longer available';
            case 'APPOINTMENT_LOCKED':
                return 'This appointment is being booked by someone else';
            case 'PAYMENT_FAILED':
                return 'Payment failed. Please try again';
            case 'NETWORK_ERROR':
                return 'Network error. Please check your connection';
            case 'TIMEOUT_ERROR':
                return 'Request timed out. Please try again';
            default:
                return error.message;
        }
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'An unexpected error occurred';
}

/**
 * Check if error is a specific API error code
 */
export function isErrorCode(error: unknown, code: string): boolean {
    return error instanceof ApiError && error.code === code;
}

/**
 * Handle API error with logging
 */
export function handleApiError(error: unknown, context?: string): never {
    if (error instanceof ApiError) {
        console.error(`[API Error${context ? ` - ${context}` : ''}]`, {
            message: error.message,
            status: error.status,
            code: error.code,
            details: error.details,
        });
        throw error;
    }

    console.error(`[Error${context ? ` - ${context}` : ''}]`, error);
    throw new ApiError(
        error instanceof Error ? error.message : 'An unexpected error occurred',
        500,
        'UNKNOWN_ERROR',
        error
    );
}

/**
 * Retry an async operation with exponential backoff
 */
export async function withRetry<T>(
    fn: () => Promise<T>,
    options: {
        maxRetries?: number;
        delay?: number;
        shouldRetry?: (error: unknown) => boolean;
    } = {}
): Promise<T> {
    const {
        maxRetries = 3,
        delay = 1000,
        shouldRetry = (error) => {
            if (error instanceof ApiError) {
                return error.isServerError() || error.isNetworkError() || error.isTimeoutError();
            }
            return false;
        },
    } = options;

    let lastError: unknown;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            if (attempt < maxRetries && shouldRetry(error)) {
                const waitTime = delay * Math.pow(2, attempt);
                await new Promise((resolve) => setTimeout(resolve, waitTime));
                continue;
            }

            throw error;
        }
    }

    throw lastError;
}

export default ApiError;
