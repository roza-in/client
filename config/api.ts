import { env } from '@/config/env';

/**
 * Custom error class for API errors
 */
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

  /**
   * Check if error is an authentication error
   */
  isAuthError(): boolean {
    return this.status === 401;
  }

  /**
   * Check if error is a forbidden error
   */
  isForbiddenError(): boolean {
    return this.status === 403;
  }

  /**
   * Check if error is a not found error
   */
  isNotFoundError(): boolean {
    return this.status === 404;
  }

  /**
   * Check if error is a validation error
   */
  isValidationError(): boolean {
    return this.status === 400 || this.status === 422;
  }

  /**
   * Check if error is a rate limit error
   */
  isRateLimitError(): boolean {
    return this.status === 429;
  }

  /**
   * Check if error is a server error
   */
  isServerError(): boolean {
    return this.status >= 500;
  }
}

/**
 * API Response type
 */
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

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated response type
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Request options
 */
export interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | string[] | undefined | null>;
  timeout?: number;
}

/**
 * Token storage interface
 */
interface TokenStorage {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  setTokens: (access: string, refresh: string) => void;
  clearTokens: () => void;
}

/**
 * Default token storage using localStorage
 */
const defaultTokenStorage: TokenStorage = {
  getAccessToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  },
  getRefreshToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
  },
  setTokens: (access, refresh) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
  },
  clearTokens: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};

// Current token storage implementation
let tokenStorage: TokenStorage = defaultTokenStorage;

/**
 * Set custom token storage implementation
 */
export function setTokenStorage(storage: TokenStorage): void {
  tokenStorage = storage;
}

/**
 * Get current access token
 */
export function getAccessToken(): string | null {
  return tokenStorage.getAccessToken();
}

/**
 * Get current refresh token
 */
export function getRefreshToken(): string | null {
  return tokenStorage.getRefreshToken();
}

/**
 * Set auth tokens
 */
export function setAuthTokens(accessToken: string, refreshToken: string): void {
  tokenStorage.setTokens(accessToken, refreshToken);
}

/**
 * Clear auth tokens
 */
export function clearAuthTokens(): void {
  tokenStorage.clearTokens();
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.removeItem('auth_pending');
    } catch (e) {
      // ignore
    }
  }
}

/**
 * Build URL with query parameters
 */
function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | string[] | undefined | null>
): string {
  const url = new URL(`${env.apiUrl}${endpoint}`);

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

  return url.toString();
}

/**
 * Refresh the access token
 */
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${env.apiUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      tokenStorage.clearTokens();
      return null;
    }

    const data: ApiResponse<{ accessToken: string; refreshToken: string }> = await response.json();

    if (data.success && data.data) {
      tokenStorage.setTokens(data.data.accessToken, data.data.refreshToken);
      return data.data.accessToken;
    }

    return null;
  } catch {
    tokenStorage.clearTokens();
    return null;
  }
}

// Track if we're currently refreshing
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

/**
 * Base fetch wrapper with error handling and token refresh
 */
async function request<T>(
  endpoint: string,
  options: RequestOptions & { body?: unknown; method?: string } = {},
  retry = true
): Promise<T> {
  const { params, timeout = 30000, ...fetchOptions } = options;

  const url = buildUrl(endpoint, params);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  // Add auth token if available
  const token = tokenStorage.getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Create abort controller for timeout
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
    if (response.status === 401 && retry && tokenStorage.getRefreshToken()) {
      // Prevent multiple simultaneous refresh attempts
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshAccessToken();
      }

      const newToken = await refreshPromise;
      isRefreshing = false;
      refreshPromise = null;

      if (newToken) {
        // Retry the request with new token
        return request<T>(endpoint, options, false);
      }
    }

    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error?.message || data.message || 'An error occurred',
        response.status,
        data.error?.code,
        data.error?.details
      );
    }

    if (!data.success) {
      throw new ApiError(
        data.error?.message || data.message || 'Request failed',
        response.status,
        data.error?.code,
        data.error?.details
      );
    }

    return data.data as T;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('Request timed out', 408, 'TIMEOUT_ERROR');
    }

    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new ApiError('Network error. Please check your connection.', 0, 'NETWORK_ERROR');
    }

    throw new ApiError('An unexpected error occurred', 500, 'UNKNOWN_ERROR', error);
  }
}

/**
 * Request with pagination metadata
 */
async function requestWithMeta<T>(
  endpoint: string,
  options: RequestOptions & { body?: unknown; method?: string } = {}
): Promise<{ data: T; meta?: PaginationMeta }> {
  const { params, timeout = 30000, ...fetchOptions } = options;

  const url = buildUrl(endpoint, params);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  const token = tokenStorage.getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
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

    const data: ApiResponse<T> = await response.json();

    if (!response.ok || !data.success) {
      throw new ApiError(
        data.error?.message || data.message || 'An error occurred',
        response.status,
        data.error?.code,
        data.error?.details
      );
    }

    return { data: data.data as T, meta: data.meta };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) throw error;

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('Request timed out', 408, 'TIMEOUT_ERROR');
    }

    throw new ApiError('An unexpected error occurred', 500, 'UNKNOWN_ERROR', error);
  }
}

/**
 * API client methods
 */
export const api = {
  /**
   * GET request
   */
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  /**
   * GET request with pagination metadata
   */
  getWithMeta: <T>(endpoint: string, options?: RequestOptions) =>
    requestWithMeta<T>(endpoint, { ...options, method: 'GET' }),

  /**
   * POST request
   */
  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'POST', body }),

  /**
   * PUT request
   */
  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'PUT', body }),

  /**
   * PATCH request
   */
  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'PATCH', body }),

  /**
   * DELETE request
   */
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),

  /**
   * Upload file with multipart form data
   */
  upload: async <T>(endpoint: string, formData: FormData, options?: RequestOptions): Promise<T> => {
    const { timeout = 60000, ...fetchOptions } = options || {};

    const url = buildUrl(endpoint, options?.params);

    const headers: Record<string, string> = {};

    const token = tokenStorage.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
          method: 'POST',
          headers,
          body: formData,
          signal: controller.signal,
          credentials: 'include',
          ...fetchOptions,
        });

      clearTimeout(timeoutId);

      const data: ApiResponse<T> = await response.json();

      if (!response.ok || !data.success) {
        throw new ApiError(
          data.error?.message || 'Upload failed',
          response.status,
          data.error?.code
        );
      }

      return data.data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) throw error;

      throw new ApiError('Upload failed', 500, 'UPLOAD_ERROR', error);
    }
  },
  /**
   * Upload with progress callback using XHR
   */
  uploadWithProgress: <T>(
    endpoint: string,
    formData: FormData,
    onProgress?: (percent: number) => void,
    options?: RequestOptions
  ): Promise<T> => {
    const { timeout = 60000, params } = options || {};

    const url = buildUrl(endpoint, params);

    const token = tokenStorage.getAccessToken();

    return new Promise<T>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.withCredentials = true;

      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      let timedOut = false;
      const timer = setTimeout(() => {
        timedOut = true;
        try {
          xhr.abort();
        } catch {}
        reject(new ApiError('Upload timed out', 408, 'TIMEOUT_ERROR'));
      }, timeout);

      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable && typeof onProgress === 'function') {
          const percent = Math.round((ev.loaded / ev.total) * 100);
          try { onProgress(percent); } catch (e) { /* ignore */ }
        }
      };

      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) return;
        clearTimeout(timer);
        if (timedOut) return;

        try {
          const status = xhr.status === 0 ? 500 : xhr.status;
          let data: ApiResponse<T> | null = null;
          try { data = JSON.parse(xhr.responseText) as ApiResponse<T>; } catch (e) { /* ignore */ }

          if (status >= 200 && status < 300 && data && data.success) {
            resolve(data.data as T);
            return;
          }

          const message = data?.error?.message || data?.message || 'Upload failed';
          reject(new ApiError(message, status, data?.error?.code));
        } catch (err) {
          reject(new ApiError('Upload failed', 500, 'UPLOAD_ERROR', err));
        }
      };

      xhr.onerror = () => {
        clearTimeout(timer);
        reject(new ApiError('Network error. Please check your connection.', 0, 'NETWORK_ERROR'));
      };

      xhr.ontimeout = () => {
        clearTimeout(timer);
        reject(new ApiError('Upload timed out', 408, 'TIMEOUT_ERROR'));
      };

      xhr.send(formData);
    });
  },
};

/**
 * Helper to build query params from filters object
 */
export function buildQueryParams<T extends Record<string, unknown>>(
  filters: T
): Record<string, string | number | boolean | string[] | undefined> {
  const params: Record<string, string | number | boolean | string[] | undefined> = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        params[key] = value as string[];
      } else if (typeof value === 'object') {
        // Skip nested objects
      } else {
        params[key] = value as string | number | boolean;
      }
    }
  });

  return params;
}
