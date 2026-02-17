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
    getCookieDomain,
    type UserRole,
} from './config/subdomains';
import { env } from './config';

// =============================================================================
// Constants
// =============================================================================

const ACCESS_COOKIE = 'rozx_access';
const REFRESH_COOKIE = 'rozx_refresh';

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
 * Note: Token is verified server-side, this is just for reading claims.
 * Returns null for malformed or expired tokens.
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
        const decoded: JWTPayload = JSON.parse(json);

        // Reject expired tokens — the refresh flow in the API client
        // will handle token renewal on actual API calls, but the proxy
        // should not grant page access with a stale JWT.
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            return null;
        }

        return decoded;
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

    // -------------------------------------------------------------------------
    // OAuth code interception — if Supabase redirects to the wrong page (e.g.
    // the homepage instead of /callback) with ?code=..., redirect to /callback
    // so the OAuth code is properly exchanged.
    // -------------------------------------------------------------------------
    if (pathname !== '/callback' && request.nextUrl.searchParams.has('code')) {
        const callbackUrl = new URL('/callback', request.url);
        // Forward all query params (code, state, rozx_state, etc.)
        request.nextUrl.searchParams.forEach((value, key) => {
            callbackUrl.searchParams.set(key, value);
        });
        console.log(`[Proxy] Intercepted OAuth code on ${pathname} → redirecting to /callback`);
        return NextResponse.redirect(callbackUrl);
    }

    // Get auth state
    const token = request.cookies.get(ACCESS_COOKIE)?.value;
    const payload = token ? decodeJWT(token) : null;
    const userRole = payload?.role;
    // Token exists but failed decode (malformed or expired)
    const isStaleToken = !!token && !payload;

    // Detect subdomain (if enabled)
    const subdomain = getSubdomainFromHost(hostname);

    // 1. Handle Protected Routes
    if (isProtectedRoute(pathname)) {
        // Not authenticated (no token, or expired/invalid token) → redirect to login
        if (!payload) {
            const response = redirectToLogin(request, pathname);
            // Clear the stale cookie so the client doesn't keep sending it
            if (isStaleToken) {
                response.cookies.delete(ACCESS_COOKIE);
            }
            return response;
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
        // Allow explicit logout or session-expired redirect — when the client-side
        // logout/unauthorized handler fired but httpOnly cookies were not cleared
        // (e.g. server was unreachable, or session was revoked but JWT hasn't expired),
        // delete them in the proxy and let the user through to /login.
        const isForceLogout = request.nextUrl.searchParams.has('logout')
            || request.nextUrl.searchParams.has('session');
        if (isForceLogout) {
            // Always redirect to the main domain login page.
            // Login lives on www (rozx.local / rozx.in), not on subdomains.
            let cleanUrl: URL;
            if (isSubdomainEnabled()) {
                cleanUrl = new URL(buildSubdomainUrl('www', pathname));
            } else {
                cleanUrl = new URL(pathname, request.url);
            }
            // Preserve reason param for the login page UI (e.g. "session=expired")
            const session = request.nextUrl.searchParams.get('session');
            if (session) cleanUrl.searchParams.set('session', session);
            const response = NextResponse.redirect(cleanUrl);
            const cookieDomain = getCookieDomain();
            const cookieOpts: any = { path: '/' };
            if (cookieDomain) cookieOpts.domain = cookieDomain;
            response.cookies.set(ACCESS_COOKIE, '', { ...cookieOpts, maxAge: 0, httpOnly: true });
            response.cookies.set(REFRESH_COOKIE, '', { ...cookieOpts, maxAge: 0, httpOnly: true });
            if (env.debug) {
                console.log(`[Proxy] Force-logout detected — clearing cookies and redirecting to ${cleanUrl.toString()}`);
            }
            return response;
        }
        return redirectToDashboard(request, userRole);
    }

    // 4. Pass through - all other routes are public
    return NextResponse.next();
}

// Configure matcher for proxy
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|icons/icon\\.svg|manifest\\.webmanifest|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)).*)'],
};
