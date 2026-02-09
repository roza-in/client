import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
    PROTECTED_PREFIXES,
    SUBDOMAIN_CONFIG,
    ROLE_TO_SUBDOMAIN,
    getSubdomainFromHost,
    getRoleForPath,
    buildSubdomainUrl,
    isSubdomainEnabled,
    getPathPrefix,
    type SubdomainKey,
    type UserRole,
} from './config/subdomains';
import { env } from './config';

// =============================================================================
// Constants
// =============================================================================

const ACCESS_COOKIE = 'rozx_access';

/** Auth routes - redirect authenticated users away */
const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'] as const;

// =============================================================================
// JWT Decoder (Edge Runtime Compatible)
// =============================================================================

interface JWTPayload {
    role?: UserRole;
    userId?: string;
    exp?: number;
    iat?: number;
}

/**
 * Decode JWT payload without verification (for Edge Runtime)
 * Note: Token is verified server-side, this is just for reading claims
 */
function decodeJWT(token: string): JWTPayload | null {
    try {
        const [, payload] = token.split('.');
        if (!payload) return null;

        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const json = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
                .join('')
        );
        return JSON.parse(json);
    } catch {
        return null;
    }
}

// =============================================================================
// Route Helpers
// =============================================================================

/** Check if pathname is a protected dashboard route */
function isProtectedRoute(pathname: string): boolean {
    return PROTECTED_PREFIXES.some(prefix =>
        pathname === prefix || pathname.startsWith(`${prefix}/`)
    );
}

/** Check if pathname is an auth route */
function isAuthRoute(pathname: string): boolean {
    return AUTH_ROUTES.some(route =>
        pathname === route || pathname.startsWith(`${route}/`)
    );
}

/** Get dashboard path for a user role */
function getDashboardPath(role?: UserRole): string {
    if (!role) return '/patient';
    const subdomain = ROLE_TO_SUBDOMAIN[role];
    return SUBDOMAIN_CONFIG[subdomain]?.path || '/patient';
}

// =============================================================================
// Redirect Helpers
// =============================================================================

/** Create redirect to login with return URL */
function redirectToLogin(request: NextRequest, returnPath: string): NextResponse {
    if (isSubdomainEnabled()) {
        // Redirect to login on main domain (e.g. rozx.local/login)
        const urlStr = buildSubdomainUrl('www', '/login');
        const loginUrl = new URL(urlStr);

        // Return to the absolute URL of the protected page
        // request.url is the full URL (e.g. http://admin.rozx.local:3000)
        loginUrl.searchParams.set('redirect', request.url);

        return NextResponse.redirect(loginUrl);
    }

    // Path-based routing: keep relative redirect
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', returnPath);
    return NextResponse.redirect(loginUrl);
}

/** Create redirect to user's dashboard */
function redirectToDashboard(request: NextRequest, role?: UserRole): NextResponse {
    if (isSubdomainEnabled()) {
        const subdomain = ROLE_TO_SUBDOMAIN[role || 'patient'];
        const url = buildSubdomainUrl(subdomain);

        // Prevent infinite redirects if already on target
        if (request.url.startsWith(url)) {
            return NextResponse.next();
        }

        return NextResponse.redirect(new URL(url));
    }
    return NextResponse.redirect(new URL(getDashboardPath(role), request.url));
}

// =============================================================================
// Proxy Middleware
// =============================================================================

/**
 * Main proxy middleware for authentication and role-based routing
 * 
 * Flow:
 * 1. Extract auth token from cookies
 * 2. For protected routes: enforce authentication and role matching
 * 3. For auth routes: redirect authenticated users to dashboard
 * 4. All other routes: pass through
 */
export async function proxy(request: NextRequest): Promise<NextResponse> {
    const pathname = request.nextUrl.pathname;
    const hostname = request.headers.get('host') || '';

    // -------------------------------------------------------------------------
    // Redirect localhost to rozx.local for proper cookie domain handling
    // -------------------------------------------------------------------------
    if (env.appEnv === 'local' && hostname.startsWith('localhost')) {
        const baseDomain = env.baseDomain || 'rozx.local:3000';
        const redirectUrl = new URL(request.url);
        redirectUrl.host = baseDomain;
        console.log(`[Proxy] Redirecting localhost → ${baseDomain}`);
        return NextResponse.redirect(redirectUrl);
    }

    // Get auth state
    const token = request.cookies.get(ACCESS_COOKIE)?.value;
    const payload = token ? decodeJWT(token) : null;
    const userRole = payload?.role;

    // Debug logging (controlled by NEXT_PUBLIC_DEBUG env var)
    if (env.debug) {
        console.log(`[Proxy] Request: ${pathname}`);
        console.log(`[Proxy] Host: ${hostname}`);
        console.log(`[Proxy] Token present: ${!!token}`);
        console.log(`[Proxy] Role: ${userRole}`);
    }

    // Detect subdomain (if enabled)
    const subdomain = getSubdomainFromHost(hostname);

    // 1. Handle Protected Routes
    if (isProtectedRoute(pathname)) {
        // Not authenticated → redirect to login
        if (!payload) {
            return redirectToLogin(request, pathname);
        }

        // Check role matches the route
        const requiredRole = getRoleForPath(pathname);
        if (requiredRole && userRole !== requiredRole) {
            return redirectToDashboard(request, userRole);
        }
    }

    // 2. Handle Subdomain + Role Mismatch (production subdomain routing)
    if (subdomain && isSubdomainEnabled()) {
        const subdomainRole = SUBDOMAIN_CONFIG[subdomain]?.role;

        if (subdomainRole && payload && userRole !== subdomainRole) {
            // User is on wrong subdomain for their role
            return redirectToDashboard(request, userRole);
        }
    }

    // 3. Handle Auth Routes - Redirect authenticated users
    if (isAuthRoute(pathname) && payload) {
        return redirectToDashboard(request, userRole);
    }

    // 4. Pass through - all other routes are public
    return NextResponse.next();
}

// Configure matcher for proxy
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|icons/icon\\.svg|manifest\\.webmanifest|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)).*)'],
};
