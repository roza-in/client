/**
 * Rozx Healthcare Platform - Token Utilities
 * 
 * JWT token handling utilities (tokens are in httpOnly cookies, not directly accessible).
 */

// =============================================================================
// Token Types
// =============================================================================

export interface TokenPayload {
    sub: string;
    role: string;
    email?: string;
    iat: number;
    exp: number;
}

// =============================================================================
// Token Utilities
// =============================================================================

/**
 * Decode JWT token payload (without verification)
 * Note: Actual tokens are in httpOnly cookies, this is for any inline tokens
 */
export function decodeToken(token: string): TokenPayload | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const payload = parts[1];
        const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decoded);
    } catch {
        return null;
    }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
    const payload = decodeToken(token);
    if (!payload) return true;

    // Add 10 second buffer
    return payload.exp * 1000 < Date.now() + 10000;
}

/**
 * Get token expiration time in milliseconds
 */
export function getTokenExpiry(token: string): number | null {
    const payload = decodeToken(token);
    if (!payload) return null;
    return payload.exp * 1000;
}

/**
 * Get time until token expires in milliseconds
 */
export function getTimeUntilExpiry(token: string): number | null {
    const expiry = getTokenExpiry(token);
    if (!expiry) return null;
    return Math.max(0, expiry - Date.now());
}

/**
 * Extract user role from token
 */
export function getRoleFromToken(token: string): string | null {
    const payload = decodeToken(token);
    return payload?.role || null;
}

/**
 * Extract user ID from token
 */
export function getUserIdFromToken(token: string): string | null {
    const payload = decodeToken(token);
    return payload?.sub || null;
}

export default {
    decodeToken,
    isTokenExpired,
    getTokenExpiry,
    getTimeUntilExpiry,
    getRoleFromToken,
    getUserIdFromToken,
};
