/**
 * ROZX Healthcare Platform - API Interceptors
 * 
 * Request and response interceptors for the API client.
 */

import { ApiError } from './error-handler';

// =============================================================================
// Types
// =============================================================================

export type RequestInterceptor = (config: RequestInit) => RequestInit | Promise<RequestInit>;
export type ResponseInterceptor = (response: Response) => Response | Promise<Response>;
export type ErrorInterceptor = (error: ApiError) => ApiError | Promise<ApiError>;

// =============================================================================
// Interceptor Registry
// =============================================================================

const requestInterceptors: RequestInterceptor[] = [];
const responseInterceptors: ResponseInterceptor[] = [];
const errorInterceptors: ErrorInterceptor[] = [];

// =============================================================================
// Register Interceptors
// =============================================================================

export function addRequestInterceptor(interceptor: RequestInterceptor): () => void {
    requestInterceptors.push(interceptor);
    return () => {
        const index = requestInterceptors.indexOf(interceptor);
        if (index > -1) {
            requestInterceptors.splice(index, 1);
        }
    };
}

export function addResponseInterceptor(interceptor: ResponseInterceptor): () => void {
    responseInterceptors.push(interceptor);
    return () => {
        const index = responseInterceptors.indexOf(interceptor);
        if (index > -1) {
            responseInterceptors.splice(index, 1);
        }
    };
}

export function addErrorInterceptor(interceptor: ErrorInterceptor): () => void {
    errorInterceptors.push(interceptor);
    return () => {
        const index = errorInterceptors.indexOf(interceptor);
        if (index > -1) {
            errorInterceptors.splice(index, 1);
        }
    };
}

// =============================================================================
// Run Interceptors
// =============================================================================

export async function runRequestInterceptors(config: RequestInit): Promise<RequestInit> {
    let result = config;
    for (const interceptor of requestInterceptors) {
        result = await interceptor(result);
    }
    return result;
}

export async function runResponseInterceptors(response: Response): Promise<Response> {
    let result = response;
    for (const interceptor of responseInterceptors) {
        result = await interceptor(result);
    }
    return result;
}

export async function runErrorInterceptors(error: ApiError): Promise<ApiError> {
    let result = error;
    for (const interceptor of errorInterceptors) {
        result = await interceptor(result);
    }
    return result;
}

// =============================================================================
// Built-in Interceptors
// =============================================================================

/**
 * Logging interceptor for development
 */
export function createLoggingInterceptor(enabled: boolean = false): {
    request: RequestInterceptor;
    response: ResponseInterceptor;
    error: ErrorInterceptor;
} {
    return {
        request: (config) => {
            if (enabled) {
                console.log('[API Request]', config);
            }
            return config;
        },
        response: (response) => {
            if (enabled) {
                console.log('[API Response]', response.status, response.url);
            }
            return response;
        },
        error: (error) => {
            if (enabled) {
                console.error('[API Error]', error);
            }
            return error;
        },
    };
}

/**
 * Request timing interceptor
 */
export function createTimingInterceptor(): {
    start: RequestInterceptor;
    end: ResponseInterceptor;
} {
    const timings = new Map<string, number>();

    return {
        start: (config) => {
            const id = Math.random().toString(36);
            timings.set(id, Date.now());
            (config as any).__timingId = id;
            return config;
        },
        end: (response) => {
            const id = (response as any).__timingId;
            if (id && timings.has(id)) {
                const duration = Date.now() - timings.get(id)!;
                console.log(`[API Timing] ${response.url}: ${duration}ms`);
                timings.delete(id);
            }
            return response;
        },
    };
}

export default {
    addRequestInterceptor,
    addResponseInterceptor,
    addErrorInterceptor,
    runRequestInterceptors,
    runResponseInterceptors,
    runErrorInterceptors,
};
