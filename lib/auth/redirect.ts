/**
 * ROZX Healthcare Platform - Auth Redirect Utilities
 * 
 * Redirect logic for authentication flows.
 */

import { routes, getDashboardRoute, isPublicRoute } from '@/config';

// =============================================================================
// Redirect URLs
// =============================================================================

/**
 * Get the return URL from search params or default to dashboard
 */
export function getReturnUrl(
    searchParams: URLSearchParams | null,
    defaultRole: string = 'patient'
): string {
    const returnUrl = searchParams?.get('returnUrl');

    if (returnUrl) {
        // Validate that returnUrl is a relative path (prevent open redirect)
        if (returnUrl.startsWith('/') && !returnUrl.startsWith('//')) {
            return decodeURIComponent(returnUrl);
        }
    }

    return getDashboardRoute(defaultRole);
}

/**
 * Build login URL with return path
 */
export function buildLoginUrl(returnPath?: string): string {
    if (!returnPath) {
        return routes.public.login;
    }

    const encodedReturn = encodeURIComponent(returnPath);
    return `${routes.public.login}?returnUrl=${encodedReturn}`;
}

/**
 * Build register URL with optional role
 */
export function buildRegisterUrl(role?: string): string {
    if (role) {
        return `${routes.public.register}/${role}`;
    }
    return routes.public.register;
}

// =============================================================================
// Redirect Logic
// =============================================================================

/**
 * Determine where to redirect after login
 */
export function getPostLoginRedirect(
    userRole: string,
    returnUrl?: string | null
): string {
    // If there's a valid return URL, use it
    if (returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//')) {
        // Don't redirect to auth pages
        if (!returnUrl.startsWith('/login') && !returnUrl.startsWith('/register')) {
            return returnUrl;
        }
    }

    return getDashboardRoute(userRole);
}

/**
 * Determine where to redirect after logout
 */
export function getPostLogoutRedirect(): string {
    return routes.public.login;
}

/**
 * Check if current path requires authentication
 */
export function requiresAuth(pathname: string): boolean {
    return !isPublicRoute(pathname);
}

/**
 * Check if current path is an auth page (login, register, etc.)
 */
export function isAuthPage(pathname: string): boolean {
    const authPages = [
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/verify',
    ];

    return authPages.some((page) => pathname.startsWith(page));
}

/**
 * Get unauthorized redirect path based on current path
 */
export function getUnauthorizedRedirect(
    currentPath: string,
    userRole?: string | null
): string | null {
    // If user has a role but is on wrong dashboard, redirect to correct one
    if (userRole) {
        const prefix = currentPath.split('/')[1];
        const expectedPrefix = getDashboardRoute(userRole).split('/')[1];

        if (prefix !== expectedPrefix && ['patient', 'doctor', 'hospital', 'admin'].includes(prefix)) {
            return getDashboardRoute(userRole);
        }
    }

    return null;
}

export default {
    getReturnUrl,
    buildLoginUrl,
    buildRegisterUrl,
    getPostLoginRedirect,
    getPostLogoutRedirect,
    requiresAuth,
    isAuthPage,
    getUnauthorizedRedirect,
};
