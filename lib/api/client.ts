/**
 * Rozx Healthcare Platform - API Client
 * 
 * Centralized API client using fetch with interceptors and error handling.
 */

import { env } from '@/config/env';
import { ApiError } from './error-handler';
import { toCamelCase } from '@/lib/utils/case-transform';
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
// CSRF Token Management
// =============================================================================

let csrfToken: string | null = null;
let csrfFetchPromise: Promise<string | null> | null = null;

async function fetchCsrfToken(): Promise<string | null> {
    try {
        const response = await fetch(`${env.apiUrl}/auth/csrf-token`, {
            method: 'GET',
            credentials: 'include',
        });
        if (response.ok) {
            const data = await response.json();
            csrfToken = data.data?.csrfToken || data.csrfToken || null;
            return csrfToken;
        }
        return null;
    } catch {
        return null;
    }
}

async function getCsrfToken(): Promise<string | null> {
    if (csrfToken) return csrfToken;
    // Deduplicate concurrent fetches
    if (!csrfFetchPromise) {
        csrfFetchPromise = fetchCsrfToken().finally(() => {
            csrfFetchPromise = null;
        });
    }
    return csrfFetchPromise;
}

/** Call this to clear the cached CSRF token (e.g. on logout) */
export function clearCsrfToken(): void {
    csrfToken = null;
}

/** Reset the unauthorized-in-progress guard (call after fresh login) */
export function resetUnauthorizedFlag(): void {
    isUnauthorizedInProgress = false;
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
        if (response.ok) {
            // Server may rotate CSRF token on refresh — clear so it's re-fetched
            clearCsrfToken();
        }
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

/** Guard: once handleUnauthorized fires, block all further API calls and handlers */
let isUnauthorizedInProgress = false;

export function onUnauthorized(handler: UnauthorizedCallback): void {
    unauthorizedHandler = handler;
}

function handleUnauthorized(): void {
    // Prevent multiple concurrent 401s from each calling the handler.
    // The first one wins; subsequent ones are no-ops.
    if (isUnauthorizedInProgress) return;
    isUnauthorizedInProgress = true;
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
    const method = (fetchOptions.method || 'GET').toUpperCase();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(fetchOptions.headers as Record<string, string>),
    };

    // Attach CSRF token to all state-changing requests (non-GET)
    if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
        const token = await getCsrfToken();
        if (token) {
            headers['X-CSRF-Token'] = token;
        }
    }

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
            // If unauthorized redirect is already in progress, don't retry or
            // call handleUnauthorized again — just throw immediately.
            if (isUnauthorizedInProgress) {
                throw new ApiError('Session expired', 401, 'SESSION_EXPIRED');
            }

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
            throw new ApiError('Session expired', 401, 'SESSION_EXPIRED');
        }

        // Handle 403 with possible CSRF mismatch — clear token and retry once
        if (response.status === 403 && retry) {
            const errorBody = await response.clone().json().catch(() => null);
            if (errorBody?.error?.code === 'CSRF_INVALID' || errorBody?.error?.code === 'CSRF_MISSING') {
                clearCsrfToken();
                return request<T>(endpoint, options, false);
            }
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

        const data: ApiResponse<T> = toCamelCase(await response.json());

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

        // Attach CSRF token for uploads (state-changing)
        const uploadHeaders: Record<string, string> = {};
        const token = await getCsrfToken();
        if (token) {
            uploadHeaders['X-CSRF-Token'] = token;
        }

        const response = await fetch(buildUrl(endpoint, rest.params), {
            method: 'POST',
            body: formData,
            credentials: 'include',
            headers: uploadHeaders,
            signal: AbortSignal.timeout(timeout),
        });

        const data: ApiResponse<T> = toCamelCase(await response.json());
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
