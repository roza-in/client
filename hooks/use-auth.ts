/**
 * Rozx Healthcare Platform - Authentication Hook
 * 
 * Provides authentication state and actions for the application.
 * Works with Zustand auth store and the API client.
 */

'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { routes, getDashboardRoute } from '@/config';
import { isSubdomainEnabled, getDashboardUrl, type UserRole } from '@/config/subdomains';
import type { UserProfile } from '@/types';

// =============================================================================
// Types
// =============================================================================

export interface UseAuthReturn {
    // State
    user: UserProfile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitialized: boolean;
    error: string | null;

    // Actions
    login: (email: string, password: string) => Promise<boolean>;
    loginWithOTP: (phone: string, otp: string) => Promise<boolean>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    clearError: () => void;

    // Helpers
    hasRole: (role: UserRole | UserRole[]) => boolean;
    redirectToDashboard: () => void;
}

// =============================================================================
// Hook Implementation
// =============================================================================

export function useAuth(): UseAuthReturn {
    const router = useRouter();

    const {
        user,
        isAuthenticated,
        isLoading,
        isInitialized,
        error,
        setUser,
        setLoading,
        setError,
        logout: storeLogout,
        clearError: clearStoreError,
    } = useAuthStore();

    /**
     * Login with email and password
     */
    const login = useCallback(async (email: string, password: string): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                setError(data.error?.message || 'Login failed');
                return false;
            }

            setUser(data.data.user);
            return true;
        } catch (err) {
            setError('An error occurred during login');
            return false;
        } finally {
            setLoading(false);
        }
    }, [setUser, setLoading, setError]);

    /**
     * Login with OTP
     */
    const loginWithOTP = useCallback(async (phone: string, otp: string): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ phone, otp }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                setError(data.error?.message || 'OTP verification failed');
                return false;
            }

            setUser(data.data.user);
            return true;
        } catch (err) {
            setError('An error occurred during OTP verification');
            return false;
        } finally {
            setLoading(false);
        }
    }, [setUser, setLoading, setError]);

    /**
     * Logout
     */
    const logout = useCallback(async (): Promise<void> => {
        try {
            await storeLogout();
        } catch (err) {
            // Ignore errors during logout
        } finally {
            router.push(routes.public.login);
        }
    }, [storeLogout, router]);

    /**
     * Refresh user data
     */
    const refreshUser = useCallback(async (): Promise<void> => {
        try {
            const response = await fetch('/api/auth/me', {
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    setUser(data.data);
                }
            }
        } catch (err) {
            // User might not be authenticated
        }
    }, [setUser]);

    /**
     * Check if user has a specific role
     */
    const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
        if (!user) return false;

        const roles = Array.isArray(role) ? role : [role];
        return roles.includes(user.role as UserRole);
    }, [user]);

    /**
     * Redirect to appropriate dashboard based on role
     */
    const redirectToDashboard = useCallback((): void => {
        if (user?.role) {
            if (isSubdomainEnabled()) {
                // Full redirect for cross-subdomain navigation
                window.location.href = getDashboardUrl(user.role as UserRole);
            } else {
                const dashboardRoute = getDashboardRoute(user.role);
                router.push(dashboardRoute);
            }
        }
    }, [user, router]);

    /**
     * Clear error
     */
    const clearError = useCallback((): void => {
        clearStoreError();
    }, [clearStoreError]);

    return {
        // State
        user,
        isAuthenticated,
        isLoading,
        isInitialized,
        error,

        // Actions
        login,
        loginWithOTP,
        logout,
        refreshUser,
        clearError,

        // Helpers
        hasRole,
        redirectToDashboard,
    };
}

// =============================================================================
// Convenience Hooks
// =============================================================================

/**
 * Hook to get current user (throws if not authenticated)
 */
export function useUser() {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated || !user) {
        throw new Error('useUser must be used within an authenticated context');
    }

    return user;
}

/**
 * Hook to check authentication status
 */
export function useIsAuthenticated(): boolean {
    return useAuthStore((state) => state.isAuthenticated);
}

/**
 * Hook to check if user has required role
 */
export function useRequireRole(requiredRole: UserRole | UserRole[]): boolean {
    const { hasRole, isAuthenticated } = useAuth();
    return isAuthenticated && hasRole(requiredRole);
}

export default useAuth;
