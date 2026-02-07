/**
 * Auth Store - Zustand Slice
 * Manages authentication state across the application
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserProfile, AuthTokens } from '@/types';
import { loginApi, type AuthResponse } from '@/features/auth/api/login';

// User Roles
export type UserRole = 'patient' | 'doctor' | 'hospital' | 'reception' | 'pharmacy' | 'admin';

export interface AuthState {
    // State
    user: UserProfile | null;
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitialized: boolean;
    error: string | null;

    // Actions
    setUser: (user: UserProfile | null) => void;
    setTokens: (tokens: AuthTokens | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    login: (response: AuthResponse) => void;
    logout: () => Promise<void>;
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
            tokens: null,
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

            // Set Tokens
            setTokens: (tokens) => {
                set({ tokens });
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
                set({
                    user: response.user,
                    tokens: response.tokens,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                });
            },

            // Logout - Clear all auth state
            logout: async () => {
                // Clear state immediately (optimistic logout)
                set({
                    user: null,
                    tokens: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null,
                });

                try {
                    // Notify server in the background
                    await loginApi.logout();
                } catch (error) {
                    // Ignore logout errors - state is already cleared locally
                    console.error('Logout error:', error);
                }
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
                        tokens: null,
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
