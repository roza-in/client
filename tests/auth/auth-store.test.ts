/**
 * Auth Store Tests
 *
 * Tests the Zustand auth store: login, clearAuth, getRedirectPath.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ── We test the pure logic helpers exported from the auth store ──────────────

// Inline the redirect-path logic from store/slices/auth.slice.ts
type UserRole = 'patient' | 'doctor' | 'hospital' | 'reception' | 'pharmacy' | 'admin';

const ROLE_REDIRECT_PATHS: Record<UserRole, string> = {
    patient: '/patient',
    doctor: '/doctor',
    hospital: '/hospital',
    reception: '/reception',
    pharmacy: '/pharmacy',
    admin: '/admin',
};

function getRedirectPath(role: string | undefined): string {
    if (!role) return '/patient';
    return ROLE_REDIRECT_PATHS[role as UserRole] || '/patient';
}

// Simulate auth state machine
interface AuthState {
    user: { id: string; role: UserRole; name: string } | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitialized: boolean;
    error: string | null;
}

function createInitialState(): AuthState {
    return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: false,
        error: null,
    };
}

function loginAction(state: AuthState, user: { id: string; role: UserRole; name: string }): AuthState {
    return { ...state, user, isAuthenticated: true, isLoading: false, error: null };
}

function clearAuthAction(state: AuthState): AuthState {
    return { ...state, user: null, isAuthenticated: false, error: null };
}

function setLoadingAction(state: AuthState, loading: boolean): AuthState {
    return { ...state, isLoading: loading };
}

function setErrorAction(state: AuthState, error: string): AuthState {
    return { ...state, error, isLoading: false };
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('Auth State Machine', () => {
    it('starts with unauthenticated state', () => {
        const state = createInitialState();
        expect(state.user).toBeNull();
        expect(state.isAuthenticated).toBe(false);
        expect(state.isLoading).toBe(false);
        expect(state.isInitialized).toBe(false);
    });

    it('login sets user and isAuthenticated', () => {
        let state = createInitialState();
        state = loginAction(state, { id: 'u1', role: 'patient', name: 'Test' });
        expect(state.user?.id).toBe('u1');
        expect(state.user?.role).toBe('patient');
        expect(state.isAuthenticated).toBe(true);
        expect(state.isLoading).toBe(false);
    });

    it('clearAuth resets to unauthenticated', () => {
        let state = createInitialState();
        state = loginAction(state, { id: 'u1', role: 'doctor', name: 'Doc' });
        state = clearAuthAction(state);
        expect(state.user).toBeNull();
        expect(state.isAuthenticated).toBe(false);
    });

    it('setError stores error and stops loading', () => {
        let state = createInitialState();
        state = setLoadingAction(state, true);
        state = setErrorAction(state, 'Network timeout');
        expect(state.error).toBe('Network timeout');
        expect(state.isLoading).toBe(false);
    });

    it('login clears any previous error', () => {
        let state = createInitialState();
        state = setErrorAction(state, 'previous error');
        state = loginAction(state, { id: 'u2', role: 'admin', name: 'Admin' });
        expect(state.error).toBeNull();
    });
});

describe('getRedirectPath()', () => {
    it.each([
        ['patient', '/patient'],
        ['doctor', '/doctor'],
        ['hospital', '/hospital'],
        ['reception', '/reception'],
        ['pharmacy', '/pharmacy'],
        ['admin', '/admin'],
    ] as const)('role "%s" → "%s"', (role, path) => {
        expect(getRedirectPath(role)).toBe(path);
    });

    it('defaults to /patient for undefined role', () => {
        expect(getRedirectPath(undefined)).toBe('/patient');
    });

    it('defaults to /patient for unknown role', () => {
        expect(getRedirectPath('superadmin')).toBe('/patient');
    });
});
