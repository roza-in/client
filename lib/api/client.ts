/**
 * ROZX Healthcare Platform - API Client
 * 
 * Centralized API client using fetch with interceptors and error handling.
 */

import { env } from '@/config/env';
import { ApiError } from './error-handler';
export { ApiError };

// =============================================================================
// Types
// =============================================================================

export interface RequestOptions extends Omit<RequestInit, 'body'> {
    params?: Record<string, string | number | boolean | string[] | undefined | null>;
    timeout?: number;
    skipAuth?: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: unknown;
    };
    meta?: PaginationMeta;
    timestamp: string;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// =============================================================================
// Token Refresh Logic
// =============================================================================

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
    try {
        const response = await fetch(`${env.apiUrl}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
        });
        return response.ok;
    } catch {
        return false;
    }
}

// =============================================================================
// Unauthorized Handler
// =============================================================================

type UnauthorizedCallback = () => void;
let unauthorizedHandler: UnauthorizedCallback | null = null;

export function onUnauthorized(handler: UnauthorizedCallback): void {
    unauthorizedHandler = handler;
}

function handleUnauthorized(): void {
    if (unauthorizedHandler) {
        unauthorizedHandler();
    }
}

// =============================================================================
// URL Builder
// =============================================================================

function buildUrl(
    endpoint: string,
    params?: Record<string, string | number | boolean | string[] | undefined | null>
): string {
    const path = `${env.apiUrl}${endpoint}`;

    // Check if path is absolute
    const isAbsolute = path.startsWith('http');

    // If relative, we need a base for URL constructor
    // Use window.location.origin in browser, or a dummy base for server (fetch will handle relative paths or we return pathname)
    const base = isAbsolute ? undefined : (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

    const url = new URL(path, base);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    value.forEach((v) => url.searchParams.append(key, String(v)));
                } else {
                    url.searchParams.append(key, String(value));
                }
            }
        });
    }

    // If original path was absolute, return full URL
    if (isAbsolute) return url.toString();

    // If it was relative, return relative path + query to respect proxying
    // (e.g., /api/v1/auth/login?foo=bar)
    return `${url.pathname}${url.search}`;
}

// =============================================================================
// Core Request Function
// =============================================================================

async function request<T>(
    endpoint: string,
    options: RequestOptions & { body?: unknown; method?: string } = {},
    retry = true
): Promise<ApiResponse<T>> {
    const { params, timeout = 30000, skipAuth = false, ...fetchOptions } = options;
    const url = buildUrl(endpoint, params);

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(fetchOptions.headers as Record<string, string>),
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            headers,
            body: fetchOptions.body ? JSON.stringify(fetchOptions.body) : undefined,
            signal: controller.signal,
            credentials: 'include',
        });

        clearTimeout(timeoutId);

        // Handle 401 with token refresh
        if (response.status === 401 && retry && !skipAuth) {
            if (!isRefreshing) {
                isRefreshing = true;
                refreshPromise = refreshTokens();
            }

            const refreshSuccess = await refreshPromise;
            isRefreshing = false;
            refreshPromise = null;

            if (refreshSuccess) {
                return request<T>(endpoint, options, false);
            }

            handleUnauthorized();
        }

        // Handle 204 No Content
        if (response.status === 204) {
            clearTimeout(timeoutId);
            return {
                success: true,
                message: 'Action completed successfully',
                data: undefined as any,
                timestamp: new Date().toISOString()
            };
        }

        const data: ApiResponse<T> = await response.json();

        if (!response.ok || !data.success) {
            throw new ApiError(
                data.error?.message || data.message || 'An error occurred',
                response.status,
                data.error?.code,
                data.error?.details
            );
        }

        return data;
    } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof ApiError) throw error;

        if (error instanceof DOMException && error.name === 'AbortError') {
            throw new ApiError('Request timed out', 408, 'TIMEOUT_ERROR');
        }

        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            throw new ApiError('Network error. Please check your connection.', 0, 'NETWORK_ERROR');
        }

        throw new ApiError('An unexpected error occurred', 500, 'UNKNOWN_ERROR', error);
    }
}

// =============================================================================
// API Client Methods
// =============================================================================

export const api = {
    get: async <T>(endpoint: string, options?: RequestOptions): Promise<T> => {
        const response = await request<T>(endpoint, { ...options, method: 'GET' });
        return response.data as T;
    },

    getWithMeta: async <T>(endpoint: string, options?: RequestOptions): Promise<{ data: T; meta?: PaginationMeta }> => {
        const response = await request<T>(endpoint, { ...options, method: 'GET' });
        return { data: response.data as T, meta: response.meta };
    },

    post: async <T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> => {
        const response = await request<T>(endpoint, { ...options, method: 'POST', body });
        return response.data as T;
    },

    put: async <T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> => {
        const response = await request<T>(endpoint, { ...options, method: 'PUT', body });
        return response.data as T;
    },

    patch: async <T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> => {
        const response = await request<T>(endpoint, { ...options, method: 'PATCH', body });
        return response.data as T;
    },

    delete: async <T>(endpoint: string, options?: RequestOptions): Promise<T> => {
        const response = await request<T>(endpoint, { ...options, method: 'DELETE' });
        return response.data as T;
    },

    /** Upload file with FormData */
    upload: async <T>(endpoint: string, formData: FormData, options?: RequestOptions): Promise<T> => {
        const { timeout = 60000, ...rest } = options || {};
        const response = await fetch(buildUrl(endpoint, rest.params), {
            method: 'POST',
            body: formData,
            credentials: 'include',
            signal: AbortSignal.timeout(timeout),
        });

        const data: ApiResponse<T> = await response.json();
        if (!response.ok || !data.success) {
            throw new ApiError(
                data.error?.message || 'Upload failed',
                response.status,
                data.error?.code
            );
        }
        return data.data as T;
    },
};

export const apiClient = api;
export default api;
