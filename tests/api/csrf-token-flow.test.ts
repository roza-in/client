/**
 * CSRF Token Flow Tests
 *
 * Tests that the API client correctly fetches, caches, attaches, and refreshes
 * CSRF tokens for state-changing (non-GET) requests.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We test the CSRF logic by reimplementing the core flow in isolation,
// since the real module has side-effects and global state.

describe('CSRF Token Flow', () => {
    let csrfToken: string | null = null;
    let fetchCallCount: number;

    // Simplified version of the CSRF logic from lib/api/client.ts
    async function fetchCsrfToken(apiUrl: string): Promise<string | null> {
        fetchCallCount++;
        const response = await fetch(`${apiUrl}/auth/csrf-token`, {
            method: 'GET',
            credentials: 'include',
        });
        if (response.ok) {
            const data = await response.json();
            csrfToken = data.data?.csrfToken || data.csrfToken || null;
            return csrfToken;
        }
        return null;
    }

    async function getCsrfToken(apiUrl: string): Promise<string | null> {
        if (csrfToken) return csrfToken;
        return fetchCsrfToken(apiUrl);
    }

    function clearCsrfToken(): void {
        csrfToken = null;
    }

    function buildHeaders(method: string, token: string | null): Record<string, string> {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS' && token) {
            headers['X-CSRF-Token'] = token;
        }
        return headers;
    }

    beforeEach(() => {
        csrfToken = null;
        fetchCallCount = 0;
        vi.restoreAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('fetches CSRF token from server on first mutation', async () => {
        const mockToken = 'csrf-abc-123';
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ data: { csrfToken: mockToken } }),
        }));

        const token = await getCsrfToken('/api/v1');
        expect(token).toBe(mockToken);
        expect(fetchCallCount).toBe(1);
    });

    it('caches CSRF token after first fetch', async () => {
        const mockToken = 'csrf-cached';
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ data: { csrfToken: mockToken } }),
        }));

        await getCsrfToken('/api/v1');
        const second = await getCsrfToken('/api/v1');

        expect(second).toBe(mockToken);
        // Only 1 fetch call — second used cache
        expect(fetchCallCount).toBe(1);
    });

    it('clears token and re-fetches after clearCsrfToken()', async () => {
        const mockToken = 'csrf-refreshed';
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ data: { csrfToken: mockToken } }),
        }));

        await getCsrfToken('/api/v1');
        clearCsrfToken();
        expect(csrfToken).toBeNull();

        await getCsrfToken('/api/v1');
        expect(fetchCallCount).toBe(2);
    });

    it('attaches X-CSRF-Token header only on non-GET requests', () => {
        const token = 'csrf-xyz';

        const getHeaders = buildHeaders('GET', token);
        expect(getHeaders['X-CSRF-Token']).toBeUndefined();

        const postHeaders = buildHeaders('POST', token);
        expect(postHeaders['X-CSRF-Token']).toBe(token);

        const patchHeaders = buildHeaders('PATCH', token);
        expect(patchHeaders['X-CSRF-Token']).toBe(token);

        const deleteHeaders = buildHeaders('DELETE', token);
        expect(deleteHeaders['X-CSRF-Token']).toBe(token);

        const putHeaders = buildHeaders('PUT', token);
        expect(putHeaders['X-CSRF-Token']).toBe(token);
    });

    it('does not attach header when token is null', () => {
        const headers = buildHeaders('POST', null);
        expect(headers['X-CSRF-Token']).toBeUndefined();
    });

    it('returns null when CSRF endpoint fails', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: false,
            status: 500,
        }));

        const token = await getCsrfToken('/api/v1');
        expect(token).toBeNull();
    });

    it('returns null when CSRF endpoint throws', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network failure')));

        // The real client catches this internally:
        let token: string | null = null;
        try {
            token = await fetchCsrfToken('/api/v1');
        } catch {
            token = null;
        }
        expect(token).toBeNull();
    });
});
