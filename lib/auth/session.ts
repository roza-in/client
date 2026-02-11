/**
 * Rozx Healthcare Platform - Session Management
 * 
 * Client-side session utilities.
 */

import { env } from '@/config/env';

// =============================================================================
// Session Storage Keys
// =============================================================================

const SESSION_KEYS = {
    LAST_ACTIVITY: 'rozx-last-activity',
    SESSION_ID: 'rozx-session-id',
} as const;

// =============================================================================
// Session Functions
// =============================================================================

/**
 * Update last activity timestamp
 */
export function updateActivity(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(SESSION_KEYS.LAST_ACTIVITY, Date.now().toString());
}

/**
 * Get last activity timestamp
 */
export function getLastActivity(): number | null {
    if (typeof window === 'undefined') return null;
    const value = sessionStorage.getItem(SESSION_KEYS.LAST_ACTIVITY);
    return value ? parseInt(value, 10) : null;
}

/**
 * Check if session has expired based on inactivity
 */
export function isSessionExpired(maxInactivityMs: number = 30 * 60 * 1000): boolean {
    const lastActivity = getLastActivity();
    if (!lastActivity) return false;
    return Date.now() - lastActivity > maxInactivityMs;
}

/**
 * Generate a session ID
 */
export function generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Get or create session ID
 */
export function getSessionId(): string {
    if (typeof window === 'undefined') return '';

    let sessionId = sessionStorage.getItem(SESSION_KEYS.SESSION_ID);
    if (!sessionId) {
        sessionId = generateSessionId();
        sessionStorage.setItem(SESSION_KEYS.SESSION_ID, sessionId);
    }
    return sessionId;
}

/**
 * Clear session data
 */
export function clearSession(): void {
    if (typeof window === 'undefined') return;
    Object.values(SESSION_KEYS).forEach((key) => {
        sessionStorage.removeItem(key);
    });
}

/**
 * Initialize session tracking
 */
export function initSessionTracking(): () => void {
    if (typeof window === 'undefined') return () => { };

    // Update activity on user interaction
    const handleActivity = () => updateActivity();

    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach((event) => {
        window.addEventListener(event, handleActivity, { passive: true });
    });

    // Initial activity update
    updateActivity();

    // Cleanup function
    return () => {
        events.forEach((event) => {
            window.removeEventListener(event, handleActivity);
        });
    };
}

export default {
    updateActivity,
    getLastActivity,
    isSessionExpired,
    getSessionId,
    clearSession,
    initSessionTracking,
};
