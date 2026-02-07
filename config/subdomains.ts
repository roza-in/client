/**
 * ROZX Healthcare Platform - Subdomain Configuration
 * 
 * Centralized subdomain-to-path mapping for multi-subdomain architecture.
 * Supports three environments:
 * - Local: patient.rozx.local:3000 (hosts file)
 * - Develop: patient-rozx.vercel.app (separate Vercel projects)
 * - Production: patient.rozx.in (wildcard subdomain)
 * 
 * @module config/subdomains
 */

// =============================================================================
// Types
// =============================================================================

/** Valid subdomain keys for routing */
export type SubdomainKey = 'www' | 'patient' | 'doctor' | 'hospital' | 'reception' | 'admin' | 'meet' | 'pharmacy';

/** User roles for access control */
export type UserRole = 'patient' | 'doctor' | 'hospital' | 'reception' | 'admin' | 'pharmacy';

/** Layout types for different route groups */
export type LayoutType = 'public' | 'auth' | 'dashboard' | 'consultation';

/** Subdomain pattern types */
export type SubdomainPattern = 'dot' | 'hyphen';

/** Configuration for each subdomain */
export interface SubdomainConfig {
    path: string;
    layout: LayoutType;
    role?: UserRole;
}

// =============================================================================
// Configuration
// =============================================================================

/**
 * Subdomain → Configuration mapping
 * Single source of truth for all subdomain-related configuration
 * 
 * Note: Auth routes (/login, /register) are on the main domain (www)
 * to keep cookie handling simple across all subdomains.
 */
export const SUBDOMAIN_CONFIG: Record<SubdomainKey, SubdomainConfig> = {
    www: { path: '/', layout: 'public' },
    patient: { path: '/patient', layout: 'dashboard', role: 'patient' },
    doctor: { path: '/doctor', layout: 'dashboard', role: 'doctor' },
    hospital: { path: '/hospital', layout: 'dashboard', role: 'hospital' },
    reception: { path: '/reception', layout: 'dashboard', role: 'reception' },
    admin: { path: '/admin', layout: 'dashboard', role: 'admin' },
    meet: { path: '/consultation', layout: 'consultation' },
    pharmacy: { path: '/pharmacy', layout: 'dashboard', role: 'pharmacy' },
} as const;

/** All protected path prefixes (derived from config) */
export const PROTECTED_PREFIXES = Object.values(SUBDOMAIN_CONFIG)
    .filter(c => c.role)
    .map(c => c.path)
    .filter(Boolean) as string[];

/** Role → Subdomain lookup */
export const ROLE_TO_SUBDOMAIN: Record<UserRole, SubdomainKey> = {
    patient: 'patient',
    doctor: 'doctor',
    hospital: 'hospital',
    reception: 'reception',
    admin: 'admin',
    pharmacy: 'pharmacy',
};

/** Path prefix → Role lookup */
export const PATH_TO_ROLE: Record<string, UserRole> = Object.fromEntries(
    Object.entries(SUBDOMAIN_CONFIG)
        .filter(([, config]) => config.role && config.path)
        .map(([, config]) => [config.path, config.role!])
);

// =============================================================================
// Environment Helpers
// =============================================================================

/** Get base domain from environment */
export const getBaseDomain = (): string =>
    process.env.NEXT_PUBLIC_BASE_DOMAIN || 'rozx.in';

/** Get subdomain pattern type: 'dot' (patient.rozx.in) or 'hyphen' (patient-rozx.vercel.app) */
export const getSubdomainPattern = (): SubdomainPattern =>
    (process.env.NEXT_PUBLIC_SUBDOMAIN_PATTERN as SubdomainPattern) || 'dot';

/** Check if subdomain routing is enabled */
export const isSubdomainEnabled = (): boolean =>
    process.env.NEXT_PUBLIC_ENABLE_SUBDOMAINS === 'true';

/** Get cookie domain for cross-subdomain auth */
export const getCookieDomain = (): string | undefined => {
    const domain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN;
    return domain || undefined;
};

/** Check if running in development */
export const isDev = (): boolean =>
    process.env.NODE_ENV === 'development';

// =============================================================================
// Subdomain Detection
// =============================================================================

/**
 * Extract subdomain key from hostname
 * 
 * Supports both patterns:
 * - Dot pattern: patient.rozx.in, patient.rozx.local
 * - Hyphen pattern: patient-rozx.vercel.app
 * 
 * @example
 * getSubdomainFromHost('patient.rozx.in') // 'patient'
 * getSubdomainFromHost('patient-rozx.vercel.app') // 'patient'
 * getSubdomainFromHost('patient.rozx.local:3000') // 'patient'
 * getSubdomainFromHost('localhost:3000') // null
 */
export function getSubdomainFromHost(hostname: string): SubdomainKey | null {
    if (!hostname) return null;

    // Remove port
    const host = hostname.split(':')[0].toLowerCase();

    // Skip plain localhost
    if (host === 'localhost' || host === '127.0.0.1') {
        return null;
    }

    const baseDomain = getBaseDomain();
    const pattern = getSubdomainPattern();

    // DOT pattern: patient.rozx.in, patient.rozx.local
    if (pattern === 'dot') {
        // Exact domain match = www
        if (host === baseDomain) return 'www';

        // Subdomain match
        const suffix = `.${baseDomain}`;
        if (host.endsWith(suffix)) {
            const subdomain = host.slice(0, -suffix.length);
            if (isValidSubdomain(subdomain)) {
                return subdomain as SubdomainKey;
            }
        }
    }

    // HYPHEN pattern: patient-rozx.vercel.app
    if (pattern === 'hyphen') {
        // Extract project name (e.g., 'rozx' from 'patient-rozx.vercel.app')
        const projectMatch = baseDomain.match(/^(\w+)\.vercel\.app$/);
        if (projectMatch) {
            const projectName = projectMatch[1]; // e.g., 'rozx'

            // Check for pattern: role-projectName.vercel.app
            const roleMatch = host.match(new RegExp(`^(\\w+)-${projectName}\\.vercel\\.app$`));
            if (roleMatch && isValidSubdomain(roleMatch[1])) {
                return roleMatch[1] as SubdomainKey;
            }

            // Exact project match = www
            if (host === `${projectName}.vercel.app`) {
                return 'www';
            }
        }
    }

    return null;
}

/** Check if a string is a valid subdomain key */
function isValidSubdomain(value: string): value is SubdomainKey {
    return value in SUBDOMAIN_CONFIG;
}

// =============================================================================
// URL Builders
// =============================================================================

/**
 * Build subdomain URL for a given role
 * @example
 * buildSubdomainUrl('patient') // 'https://patient.rozx.in' or 'http://patient.rozx.local:3000'
 */
export function buildSubdomainUrl(subdomain: SubdomainKey, path: string = ''): string {
    const baseDomain = getBaseDomain();
    const pattern = getSubdomainPattern();
    const protocol = isDev() ? 'http' : 'https';
    const port = isDev() ? ':3000' : '';

    if (!isSubdomainEnabled()) {
        // Fallback to path-based
        const prefix = SUBDOMAIN_CONFIG[subdomain]?.path || '';
        return `${protocol}://localhost:3000${prefix}${path}`;
    }

    // DOT pattern: patient.rozx.local
    if (pattern === 'dot') {
        const host = subdomain === 'www' ? baseDomain : `${subdomain}.${baseDomain}`;
        return `${protocol}://${host}${port}${path}`;
    }

    // HYPHEN pattern: patient-rozx.vercel.app
    if (pattern === 'hyphen') {
        const projectMatch = baseDomain.match(/^(\w+)\.vercel\.app$/);
        if (projectMatch) {
            const projectName = projectMatch[1];
            const host = subdomain === 'www'
                ? `${projectName}.vercel.app`
                : `${subdomain}-${projectName}.vercel.app`;
            return `${protocol}://${host}${path}`;
        }
    }

    // Fallback
    return `${protocol}://${baseDomain}${path}`;
}

/**
 * Get dashboard URL for a user role
 */
export function getDashboardUrl(role: UserRole): string {
    const subdomain = ROLE_TO_SUBDOMAIN[role];
    return buildSubdomainUrl(subdomain);
}

/**
 * Get path prefix for a subdomain
 */
export function getPathPrefix(subdomain: SubdomainKey | null): string {
    if (!subdomain) return '';
    return SUBDOMAIN_CONFIG[subdomain]?.path || '';
}

/**
 * Get required role for a subdomain
 */
export function getRequiredRole(subdomain: SubdomainKey | null): UserRole | undefined {
    if (!subdomain) return undefined;
    return SUBDOMAIN_CONFIG[subdomain]?.role;
}

/**
 * Get role required for a path prefix
 */
export function getRoleForPath(pathname: string): UserRole | undefined {
    for (const [prefix, role] of Object.entries(PATH_TO_ROLE)) {
        if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
            return role;
        }
    }
    return undefined;
}

// =============================================================================
// Default Export
// =============================================================================

export default {
    config: SUBDOMAIN_CONFIG,
    protectedPrefixes: PROTECTED_PREFIXES,
    roleToSubdomain: ROLE_TO_SUBDOMAIN,
    pathToRole: PATH_TO_ROLE,
    getBaseDomain,
    getSubdomainPattern,
    isSubdomainEnabled,
    getCookieDomain,
    isDev,
    getSubdomainFromHost,
    buildSubdomainUrl,
    getDashboardUrl,
    getPathPrefix,
    getRequiredRole,
    getRoleForPath,
};
