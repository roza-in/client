/**
 * Role-Based Routing Tests
 *
 * Tests the proxy middleware logic for route protection, role matching,
 * and auth route redirect behaviour.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── We test the pure helper functions extracted from proxy.ts ────────────────
// Because `proxy.ts` depends on Next.js server imports (NextRequest, NextResponse),
// we re-implement the same logic as standalone functions for unit testing.

// ── Inline helpers (mirrors proxy.ts logic) ──────────────────────────────────

const PROTECTED_PREFIXES = ['/patient', '/doctor', '/hospital', '/reception', '/admin', '/pharmacy'];

const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'] as const;

const PATH_TO_ROLE: Record<string, string> = {
    '/patient': 'patient',
    '/doctor': 'doctor',
    '/hospital': 'hospital',
    '/reception': 'reception',
    '/admin': 'admin',
    '/pharmacy': 'pharmacy',
};

const ROLE_TO_DASHBOARD: Record<string, string> = {
    patient: '/patient',
    doctor: '/doctor',
    hospital: '/hospital',
    reception: '/reception',
    admin: '/admin',
    pharmacy: '/pharmacy',
};

function isProtectedRoute(pathname: string): boolean {
    return PROTECTED_PREFIXES.some(prefix =>
        pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
}

function isAuthRoute(pathname: string): boolean {
    return AUTH_ROUTES.some(route =>
        pathname === route || pathname.startsWith(`${route}/`),
    );
}

function getRoleForPath(pathname: string): string | undefined {
    for (const [prefix, role] of Object.entries(PATH_TO_ROLE)) {
        if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
            return role;
        }
    }
    return undefined;
}

function getDashboardPath(role?: string): string {
    if (!role) return '/patient';
    return ROLE_TO_DASHBOARD[role] || '/patient';
}

interface JWTPayload {
    role?: string;
    userId?: string;
    exp?: number;
}

function decodeJWT(token: string): JWTPayload | null {
    try {
        const [, payload] = token.split('.');
        if (!payload) return null;
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const json = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
                .join(''),
        );
        const decoded: JWTPayload = JSON.parse(json);

        // Reject expired tokens
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            return null;
        }
        return decoded;
    } catch {
        return null;
    }
}

/** Simulate the proxy decision tree — returns an action string */
type ProxyAction =
    | { action: 'redirect-login'; returnPath: string }
    | { action: 'redirect-dashboard'; dashboardPath: string }
    | { action: 'pass-through' };

function proxyDecision(pathname: string, token: string | null): ProxyAction {
    const payload = token ? decodeJWT(token) : null;

    // Protected route
    if (isProtectedRoute(pathname)) {
        if (!payload) {
            return { action: 'redirect-login', returnPath: pathname };
        }
        const requiredRole = getRoleForPath(pathname);
        if (requiredRole && payload.role !== requiredRole) {
            return { action: 'redirect-dashboard', dashboardPath: getDashboardPath(payload.role) };
        }
    }

    // Auth route when already authenticated
    if (isAuthRoute(pathname) && payload) {
        return { action: 'redirect-dashboard', dashboardPath: getDashboardPath(payload.role) };
    }

    return { action: 'pass-through' };
}

// ── JWT Builder Helper ───────────────────────────────────────────────────────

function createToken(payload: JWTPayload): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const body = btoa(JSON.stringify(payload));
    return `${header}.${body}.fake-signature`;
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('Route Protection — isProtectedRoute()', () => {
    it.each([
        ['/patient', true],
        ['/patient/dashboard', true],
        ['/doctor', true],
        ['/doctor/appointments', true],
        ['/hospital', true],
        ['/hospital/settings', true],
        ['/reception', true],
        ['/admin', true],
        ['/admin/users', true],
        ['/pharmacy', true],
        ['/pharmacy/orders', true],
    ])('isProtectedRoute(%s) → %s', (path, expected) => {
        expect(isProtectedRoute(path)).toBe(expected);
    });

    it.each([
        ['/', false],
        ['/login', false],
        ['/register', false],
        ['/doctors', false],
        ['/hospitals', false],
        ['/about', false],
        ['/contact', false],
        ['/pricing', false],
        ['/faqs', false],
    ])('isProtectedRoute(%s) → %s (public)', (path, expected) => {
        expect(isProtectedRoute(path)).toBe(expected);
    });
});

describe('Auth Route Detection — isAuthRoute()', () => {
    it.each([
        ['/login', true],
        ['/register', true],
        ['/forgot-password', true],
        ['/reset-password', true],
        ['/register/hospital', true],
    ])('isAuthRoute(%s) → %s', (path, expected) => {
        expect(isAuthRoute(path)).toBe(expected);
    });

    it.each([
        ['/', false],
        ['/patient', false],
        ['/doctors', false],
    ])('isAuthRoute(%s) → %s (non-auth)', (path, expected) => {
        expect(isAuthRoute(path)).toBe(expected);
    });
});

describe('Role-For-Path Mapping — getRoleForPath()', () => {
    it.each([
        ['/patient', 'patient'],
        ['/patient/appointments', 'patient'],
        ['/doctor', 'doctor'],
        ['/hospital', 'hospital'],
        ['/reception', 'reception'],
        ['/admin', 'admin'],
        ['/pharmacy', 'pharmacy'],
    ])('getRoleForPath(%s) → %s', (path, expected) => {
        expect(getRoleForPath(path)).toBe(expected);
    });

    it('returns undefined for public routes', () => {
        expect(getRoleForPath('/')).toBeUndefined();
        expect(getRoleForPath('/doctors')).toBeUndefined();
    });
});

describe('JWT Decoder — decodeJWT()', () => {
    it('decodes a valid token', () => {
        const token = createToken({ role: 'patient', userId: 'u1', exp: Math.floor(Date.now() / 1000) + 3600 });
        const payload = decodeJWT(token);
        expect(payload).toMatchObject({ role: 'patient', userId: 'u1' });
    });

    it('returns null for expired token', () => {
        const token = createToken({ role: 'patient', exp: Math.floor(Date.now() / 1000) - 100 });
        expect(decodeJWT(token)).toBeNull();
    });

    it('returns null for malformed token', () => {
        expect(decodeJWT('not-a-jwt')).toBeNull();
        expect(decodeJWT('')).toBeNull();
    });

    it('accepts token without exp (no expiry check)', () => {
        const token = createToken({ role: 'doctor', userId: 'u2' });
        const payload = decodeJWT(token);
        expect(payload?.role).toBe('doctor');
    });
});

describe('Proxy Decision Tree', () => {
    const validPatientToken = createToken({ role: 'patient', exp: Math.floor(Date.now() / 1000) + 3600 });
    const validDoctorToken = createToken({ role: 'doctor', exp: Math.floor(Date.now() / 1000) + 3600 });
    const validAdminToken = createToken({ role: 'admin', exp: Math.floor(Date.now() / 1000) + 3600 });
    const expiredToken = createToken({ role: 'patient', exp: Math.floor(Date.now() / 1000) - 100 });

    describe('Unauthenticated user', () => {
        it('allows public routes', () => {
            expect(proxyDecision('/', null)).toEqual({ action: 'pass-through' });
            expect(proxyDecision('/doctors', null)).toEqual({ action: 'pass-through' });
            expect(proxyDecision('/about', null)).toEqual({ action: 'pass-through' });
        });

        it('allows auth routes', () => {
            expect(proxyDecision('/login', null)).toEqual({ action: 'pass-through' });
            expect(proxyDecision('/register', null)).toEqual({ action: 'pass-through' });
        });

        it('redirects to login for protected routes', () => {
            const result = proxyDecision('/patient', null);
            expect(result).toEqual({ action: 'redirect-login', returnPath: '/patient' });
        });

        it('redirects to login with expired token', () => {
            const result = proxyDecision('/patient', expiredToken);
            expect(result).toEqual({ action: 'redirect-login', returnPath: '/patient' });
        });
    });

    describe('Authenticated patient', () => {
        it('allows access to own dashboard', () => {
            expect(proxyDecision('/patient', validPatientToken)).toEqual({ action: 'pass-through' });
            expect(proxyDecision('/patient/appointments', validPatientToken)).toEqual({ action: 'pass-through' });
        });

        it('redirects away from other role dashboards', () => {
            const result = proxyDecision('/doctor', validPatientToken);
            expect(result).toEqual({ action: 'redirect-dashboard', dashboardPath: '/patient' });
        });

        it('redirects away from admin dashboard', () => {
            const result = proxyDecision('/admin', validPatientToken);
            expect(result).toEqual({ action: 'redirect-dashboard', dashboardPath: '/patient' });
        });

        it('redirects from auth routes to dashboard', () => {
            const result = proxyDecision('/login', validPatientToken);
            expect(result).toEqual({ action: 'redirect-dashboard', dashboardPath: '/patient' });
        });

        it('allows public routes', () => {
            expect(proxyDecision('/doctors', validPatientToken)).toEqual({ action: 'pass-through' });
        });
    });

    describe('Authenticated doctor', () => {
        it('allows access to own dashboard', () => {
            expect(proxyDecision('/doctor', validDoctorToken)).toEqual({ action: 'pass-through' });
        });

        it('redirects from patient dashboard', () => {
            const result = proxyDecision('/patient', validDoctorToken);
            expect(result).toEqual({ action: 'redirect-dashboard', dashboardPath: '/doctor' });
        });
    });

    describe('Authenticated admin', () => {
        it('allows access to admin dashboard', () => {
            expect(proxyDecision('/admin', validAdminToken)).toEqual({ action: 'pass-through' });
            expect(proxyDecision('/admin/users', validAdminToken)).toEqual({ action: 'pass-through' });
        });

        it('redirects from non-admin dashboards', () => {
            expect(proxyDecision('/patient', validAdminToken)).toEqual({
                action: 'redirect-dashboard',
                dashboardPath: '/admin',
            });
        });
    });

    describe('Cross-role access matrix', () => {
        const roles = ['patient', 'doctor', 'hospital', 'reception', 'admin', 'pharmacy'] as const;

        for (const tokenRole of roles) {
            for (const pathRole of roles) {
                const shouldPass = tokenRole === pathRole;
                const token = createToken({ role: tokenRole, exp: Math.floor(Date.now() / 1000) + 3600 });
                it(`${tokenRole} accessing /${pathRole} → ${shouldPass ? 'pass' : 'redirect'}`, () => {
                    const result = proxyDecision(`/${pathRole}`, token);
                    if (shouldPass) {
                        expect(result.action).toBe('pass-through');
                    } else {
                        expect(result).toEqual({
                            action: 'redirect-dashboard',
                            dashboardPath: `/${tokenRole}`,
                        });
                    }
                });
            }
        }
    });
});
