/**
 * Auth Store - Zustand Slice
 * Manages authentication state across the application
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserProfile } from '@/types';
import { loginApi, type AuthResponse } from '@/features/auth/api/login';
import { logout as logoutApi } from '@/features/auth/api/logout';
import { clearCsrfToken, resetUnauthorizedFlag } from '@/lib/api/client';
import { clearSession } from '@/lib/auth/session';

// User Roles
export type UserRole = 'patient' | 'doctor' | 'hospital' | 'reception' | 'pharmacy' | 'admin';

export interface AuthState {
    // State
    user: UserProfile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitialized: boolean;
    error: string | null;

    // Actions
    setUser: (user: UserProfile | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    login: (response: AuthResponse) => void;
    logout: () => Promise<void>;
    clearAuth: () => void;
    initialize: () => Promise<void>;
    clearError: () => void;
}

// Role-Based Redirect Paths
export const ROLE_REDIRECT_PATHS: Record<UserRole, string> = {
    patient: '/patient',
    doctor: '/doctor',
    hospital: '/hospital',
    reception: '/reception',
    pharmacy: '/pharmacy',
    admin: '/admin',
};

/**
 * Get redirect path based on user role
 */
export function getRedirectPath(role: UserRole | string): string {
    return ROLE_REDIRECT_PATHS[role as UserRole] || '/patient';
}

// Store Implementation
export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            // Initial State
            user: null,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: false,
            error: null,

            // Set User
            setUser: (user) => {
                set({
                    user,
                    isAuthenticated: !!user,
                });
            },

            // Set Loading
            setLoading: (isLoading) => {
                set({ isLoading });
            },

            // Set Error
            setError: (error) => {
                set({ error });
            },

            // Clear Error
            clearError: () => {
                set({ error: null });
            },

            // Login - Store auth response
            login: (response: AuthResponse) => {
                // Reset the unauthorized guard from any previous session-expiry
                resetUnauthorizedFlag();
                set({
                    user: response.user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                });
            },

            // Clear auth state (used by 401 handler, no API call)
            clearAuth: () => {
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    isInitialized: false,
                    error: null,
                });

                // Clear auxiliary auth data
                clearCsrfToken();
                clearSession();

                // Explicitly clear persisted auth data
                try { localStorage.removeItem('rozx-auth'); } catch {}
            },

            // Logout - Notify server first (while tokens are valid), then clear local state
            logout: async () => {
                try {
                    // 1. Notify server to revoke session & clear httpOnly cookies
                    //    MUST happen first — the POST requires valid auth cookies
                    //    and a valid CSRF token, both of which are still present.
                    await logoutApi();
                } catch (error) {
                    // Server logout failed — httpOnly cookies may persist.
                    // The proxy's ?logout handler will delete them as a safety net.
                    console.warn('[Auth] Server logout failed:', error);
                }

                // 2. Clear all local state regardless of server response
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    isInitialized: false,
                    error: null,
                });

                // 3. Clear auxiliary auth data
                clearCsrfToken();
                clearSession();

                // 4. Clear persisted auth data from localStorage
                try { localStorage.removeItem('rozx-auth'); } catch {}
            },

            // Initialize - Check if user is logged in on app load
            initialize: async () => {
                const state = get();

                // Skip if already initialized
                if (state.isInitialized) return;

                try {
                    set({ isLoading: true });

                    // Try to get current user from server
                    const response = await loginApi.getCurrentUser();

                    if (response.user) {
                        resetUnauthorizedFlag();
                        set({
                            user: response.user,
                            isAuthenticated: true,
                            isLoading: false,
                            isInitialized: true,
                            error: null,
                        });
                    } else {
                        set({
                            user: null,
                            isAuthenticated: false,
                            isLoading: false,
                            isInitialized: true,
                        });
                    }
                } catch {
                    // User is not authenticated
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                        isInitialized: true,
                        error: null,
                    });
                }
            },
        }),
        {
            name: 'rozx-auth',
            storage: createJSONStorage(() => localStorage),
            // Only persist user info, not tokens (handled by httpOnly cookies)
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

// Selectors (for performance optimization)
export const selectUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectIsLoading = (state: AuthState) => state.isLoading;
export const selectError = (state: AuthState) => state.error;
export const selectUserRole = (state: AuthState) => state.user?.role;

// Hooks (convenience wrappers)
export function useUser() {
    return useAuthStore(selectUser);
}

export function useIsAuthenticated() {
    return useAuthStore(selectIsAuthenticated);
}

export function useUserRole() {
    return useAuthStore(selectUserRole);
}

export function useAuthLoading() {
    return useAuthStore(selectIsLoading);
}

export function useAuthError() {
    return useAuthStore(selectError);
}
