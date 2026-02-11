/**
 * Rozx Healthcare Platform - Session Management Hook
 * 
 * Handles session initialization, persistence, and lifecycle management.
 */

'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useAuthStore } from '@/store';
import { env } from '@/config';

// =============================================================================
// Types
// =============================================================================

export interface UseSessionReturn {
    isInitialized: boolean;
    isSessionValid: boolean;
    lastActivity: Date | null;
    initializeSession: () => Promise<void>;
    refreshSession: () => Promise<boolean>;
    endSession: () => void;
    updateActivity: () => void;
}

export interface SessionConfig {
    /** Session timeout in milliseconds (default: 30 minutes) */
    sessionTimeout?: number;
    /** Token refresh interval in milliseconds (default: 10 minutes) */
    refreshInterval?: number;
    /** Enable activity tracking */
    trackActivity?: boolean;
    /** Callback when session expires */
    onSessionExpired?: () => void;
}

// =============================================================================
// Constants
// =============================================================================

const DEFAULT_SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const DEFAULT_REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes
const ACTIVITY_DEBOUNCE = 60 * 1000; // 1 minute

// =============================================================================
// Hook Implementation
// =============================================================================

export function useSession(config: SessionConfig = {}): UseSessionReturn {
    const {
        sessionTimeout = DEFAULT_SESSION_TIMEOUT,
        refreshInterval = DEFAULT_REFRESH_INTERVAL,
        trackActivity = true,
        onSessionExpired,
    } = config;

    const {
        isAuthenticated,
        isInitialized,
        setUser,
        logout,
        initialize,
    } = useAuthStore();

    const [lastActivity, setLastActivity] = useState<Date | null>(null);
    const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
    const activityTimerRef = useRef<NodeJS.Timeout | null>(null);
    const lastActivityUpdateRef = useRef<number>(0);

    /**
     * Initialize session on app load
     */
    const initializeSession = useCallback(async (): Promise<void> => {
        await initialize();
        if (isAuthenticated) {
            setLastActivity(new Date());
        }
    }, [initialize, isAuthenticated]);

    /**
     * Refresh the session token
     */
    const refreshSession = useCallback(async (): Promise<boolean> => {
        try {
            const response = await fetch(`${env.apiUrl}/auth/refresh`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setLastActivity(new Date());
                    return true;
                }
            }

            // Refresh failed - session expired
            if (onSessionExpired) {
                onSessionExpired();
            }
            await logout();
            return false;
        } catch (error) {
            console.error('Session refresh failed:', error);
            return false;
        }
    }, [logout, onSessionExpired]);

    /**
     * End the current session
     */
    const endSession = useCallback((): void => {
        if (refreshTimerRef.current) {
            clearInterval(refreshTimerRef.current);
            refreshTimerRef.current = null;
        }
        if (activityTimerRef.current) {
            clearTimeout(activityTimerRef.current);
            activityTimerRef.current = null;
        }
        logout();
    }, [logout]);

    /**
     * Update last activity timestamp
     */
    const updateActivity = useCallback((): void => {
        const now = Date.now();
        // Debounce activity updates
        if (now - lastActivityUpdateRef.current < ACTIVITY_DEBOUNCE) {
            return;
        }
        lastActivityUpdateRef.current = now;
        setLastActivity(new Date());
    }, []);

    /**
     * Set up token refresh interval
     */
    useEffect(() => {
        if (!isAuthenticated) {
            if (refreshTimerRef.current) {
                clearInterval(refreshTimerRef.current);
                refreshTimerRef.current = null;
            }
            return;
        }

        refreshTimerRef.current = setInterval(() => {
            refreshSession();
        }, refreshInterval);

        return () => {
            if (refreshTimerRef.current) {
                clearInterval(refreshTimerRef.current);
            }
        };
    }, [isAuthenticated, refreshInterval, refreshSession]);

    /**
     * Track user activity
     */
    useEffect(() => {
        if (!trackActivity || !isAuthenticated) return;

        const handleActivity = () => updateActivity();

        // Track various user activities
        const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
        events.forEach((event) => {
            window.addEventListener(event, handleActivity, { passive: true });
        });

        return () => {
            events.forEach((event) => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [trackActivity, isAuthenticated, updateActivity]);

    /**
     * Check for session timeout based on activity
     */
    useEffect(() => {
        if (!isAuthenticated || !lastActivity) return;

        activityTimerRef.current = setTimeout(() => {
            const timeSinceActivity = Date.now() - lastActivity.getTime();
            if (timeSinceActivity >= sessionTimeout) {
                if (onSessionExpired) {
                    onSessionExpired();
                }
                endSession();
            }
        }, sessionTimeout);

        return () => {
            if (activityTimerRef.current) {
                clearTimeout(activityTimerRef.current);
            }
        };
    }, [isAuthenticated, lastActivity, sessionTimeout, onSessionExpired, endSession]);

    return {
        isInitialized,
        isSessionValid: isAuthenticated && isInitialized,
        lastActivity,
        initializeSession,
        refreshSession,
        endSession,
        updateActivity,
    };
}

/**
 * Hook to initialize auth on app startup
 * Should be called once in a layout or provider
 */
export function useAuthInit(): { isInitialized: boolean; isLoading: boolean } {
    const { isInitialized, initialize, setUser } = useAuthStore();
    const [isLoading, setIsLoading] = useState(!isInitialized);
    const initRef = useRef(false);

    useEffect(() => {
        if (initRef.current || isInitialized) return;
        initRef.current = true;

        const init = async () => {
            try {
                await initialize();
            } catch (error) {
                // Not authenticated or network error
            } finally {
                setIsLoading(false);
            }
        };

        init();
    }, [isInitialized, initialize, setUser]);

    return { isInitialized, isLoading };
}

export default useSession;
