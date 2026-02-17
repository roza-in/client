/**
 * Token Refresh Tests
 *
 * Tests the 401 → refresh → retry flow in the API client.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ── Re-implement the refresh logic from lib/api/client.ts for isolated testing ─

interface MockResponse {
    status: number;
    ok: boolean;
    json: () => Promise<unknown>;
    clone: () => MockResponse;
}

describe('Token Refresh Flow', () => {
    let isRefreshing: boolean;
    let refreshPromise: Promise<boolean> | null;
    let unauthorizedCalled: boolean;
    let fetchCalls: Array<{ url: string; method: string }>;

    // Simulated refresh function
    async function refreshTokens(apiUrl: string): Promise<boolean> {
        fetchCalls.push({ url: `${apiUrl}/auth/refresh`, method: 'POST' });
        const response = await fetch(`${apiUrl}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
        });
        return response.ok;
    }

    function handleUnauthorized(): void {
        unauthorizedCalled = true;
    }

    /**
     * Simulates the 401 handling logic from request() in client.ts:
     * 1. On 401 + retry=true + !skipAuth → try refresh
     * 2. If refresh succeeds → retry request (return 'retry')
     * 3. If refresh fails → handleUnauthorized()
     */
    async function handleResponse(
        responseStatus: number,
        retry: boolean,
        skipAuth: boolean,
        apiUrl: string,
    ): Promise<'success' | 'retry' | 'unauthorized'> {
        if (responseStatus === 401 && retry && !skipAuth) {
            if (!isRefreshing) {
                isRefreshing = true;
                refreshPromise = refreshTokens(apiUrl);
            }

            const refreshSuccess = await refreshPromise;
            isRefreshing = false;
            refreshPromise = null;

            if (refreshSuccess) {
                return 'retry';
            }

            handleUnauthorized();
            return 'unauthorized';
        }

        if (responseStatus >= 200 && responseStatus < 300) {
            return 'success';
        }

        return 'success'; // other errors handled elsewhere
    }

    beforeEach(() => {
        isRefreshing = false;
        refreshPromise = null;
        unauthorizedCalled = false;
        fetchCalls = [];
        vi.restoreAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('retries the request after successful token refresh', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200 }));

        const result = await handleResponse(401, true, false, '/api/v1');
        expect(result).toBe('retry');
        expect(unauthorizedCalled).toBe(false);
    });

    it('calls handleUnauthorized when refresh fails', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 401 }));

        const result = await handleResponse(401, true, false, '/api/v1');
        expect(result).toBe('unauthorized');
        expect(unauthorizedCalled).toBe(true);
    });

    it('does not attempt refresh when skipAuth is true', async () => {
        const fetchMock = vi.fn();
        vi.stubGlobal('fetch', fetchMock);

        const result = await handleResponse(401, true, true, '/api/v1');
        // Should not have called refresh
        expect(fetchCalls).toHaveLength(0);
        expect(fetchMock).not.toHaveBeenCalled();
        expect(result).toBe('success'); // falls through to non-401 handling
    });

    it('does not attempt refresh on second try (retry=false)', async () => {
        const fetchMock = vi.fn();
        vi.stubGlobal('fetch', fetchMock);

        const result = await handleResponse(401, false, false, '/api/v1');
        expect(fetchCalls).toHaveLength(0);
        expect(result).toBe('success');
    });

    it('deduplicates concurrent refresh calls', async () => {
        let resolveRefresh: (value: boolean) => void;
        const refreshP = new Promise<boolean>(r => { resolveRefresh = r; });

        vi.stubGlobal('fetch', vi.fn().mockImplementation(() =>
            refreshP.then(ok => ({ ok, status: ok ? 200 : 401 }))
        ));

        // Fire two 401 handlers concurrently
        const p1 = handleResponse(401, true, false, '/api/v1');
        const p2 = handleResponse(401, true, false, '/api/v1');

        // Resolve the refresh
        resolveRefresh!(true);

        const [r1, r2] = await Promise.all([p1, p2]);
        expect(r1).toBe('retry');
        expect(r2).toBe('retry');

        // Only one fetch call for refresh (deduplicated)
        expect(fetchCalls).toHaveLength(1);
    });

    it('does not refresh for non-401 responses', async () => {
        const fetchMock = vi.fn();
        vi.stubGlobal('fetch', fetchMock);

        const result200 = await handleResponse(200, true, false, '/api/v1');
        const result403 = await handleResponse(403, true, false, '/api/v1');
        const result500 = await handleResponse(500, true, false, '/api/v1');

        expect(result200).toBe('success');
        expect(result403).toBe('success');
        expect(result500).toBe('success');
        expect(fetchCalls).toHaveLength(0);
    });
});
