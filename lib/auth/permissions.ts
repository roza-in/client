/**
 * Rozx Healthcare Platform - Permissions & Role-Based Access
 * 
 * Utilities for role-based access control.
 */

import type { UserRole } from '@/types';

// =============================================================================
// Role Hierarchy
// =============================================================================

const ROLE_HIERARCHY: Record<string, number> = {
    admin: 100,
    hospital: 50,
    doctor: 40,
    reception: 30,
    pharmacy: 20,
    patient: 10,
};

// =============================================================================
// Permission Definitions
// =============================================================================

export type Permission =
    | 'appointments:read'
    | 'appointments:create'
    | 'appointments:update'
    | 'appointments:cancel'
    | 'appointments:manage'
    | 'prescriptions:read'
    | 'prescriptions:create'
    | 'prescriptions:update'
    | 'patients:read'
    | 'patients:manage'
    | 'doctors:read'
    | 'doctors:manage'
    | 'hospitals:read'
    | 'hospitals:manage'
    | 'payments:read'
    | 'payments:manage'
    | 'payments:refund'
    | 'analytics:read'
    | 'settings:read'
    | 'settings:manage'
    | 'admin:access';

const ROLE_PERMISSIONS: Record<string, Permission[]> = {
    patient: [
        'appointments:read',
        'appointments:create',
        'appointments:cancel',
        'prescriptions:read',
        'payments:read',
    ],
    reception: [
        'appointments:read',
        'appointments:update',
        'appointments:manage',
        'patients:read',
        'doctors:read',
    ],
    doctor: [
        'appointments:read',
        'appointments:update',
        'prescriptions:read',
        'prescriptions:create',
        'prescriptions:update',
        'patients:read',
        'analytics:read',
        'settings:read',
    ],
    hospital: [
        'appointments:read',
        'appointments:manage',
        'prescriptions:read',
        'patients:read',
        'patients:manage',
        'doctors:read',
        'doctors:manage',
        'payments:read',
        'analytics:read',
        'settings:read',
        'settings:manage',
    ],
    pharmacy: [
        'prescriptions:read',
        'patients:read',
    ],
    admin: [
        'appointments:read',
        'appointments:manage',
        'prescriptions:read',
        'patients:read',
        'patients:manage',
        'doctors:read',
        'doctors:manage',
        'hospitals:read',
        'hospitals:manage',
        'payments:read',
        'payments:manage',
        'payments:refund',
        'analytics:read',
        'settings:read',
        'settings:manage',
        'admin:access',
    ],
};

// =============================================================================
// Permission Checking
// =============================================================================

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: string, permission: Permission): boolean {
    const permissions = ROLE_PERMISSIONS[role];
    return permissions?.includes(permission) || false;
}

/**
 * Check if a role has all specified permissions
 */
export function hasAllPermissions(role: string, permissions: Permission[]): boolean {
    return permissions.every((permission) => hasPermission(role, permission));
}

/**
 * Check if a role has any of the specified permissions
 */
export function hasAnyPermission(role: string, permissions: Permission[]): boolean {
    return permissions.some((permission) => hasPermission(role, permission));
}

/**
 * Get all permissions for a role
 */
export function getPermissions(role: string): Permission[] {
    return ROLE_PERMISSIONS[role] || [];
}

// =============================================================================
// Role Checking
// =============================================================================

/**
 * Check if user has a specific role
 */
export function hasRole(userRole: string, requiredRole: UserRole | UserRole[]): boolean {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    return roles.includes(userRole as UserRole);
}

/**
 * Check if user's role is at or above a required level
 */
export function hasRoleLevel(userRole: string, requiredRole: string): boolean {
    const userLevel = ROLE_HIERARCHY[userRole] || 0;
    const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
    return userLevel >= requiredLevel;
}

/**
 * Check if user is admin
 */
export function isAdmin(role: string): boolean {
    return role === 'admin';
}

/**
 * Check if user is a healthcare provider (doctor, hospital, or reception)
 */
export function isProvider(role: string): boolean {
    return ['doctor', 'hospital', 'reception'].includes(role);
}

/**
 * Check if user is patient
 */
export function isPatient(role: string): boolean {
    return role === 'patient';
}

// =============================================================================
// Route Access
// =============================================================================

const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
    '/patient': ['patient'],
    '/doctor': ['doctor'],
    '/hospital': ['hospital', 'reception'],
    '/admin': ['admin'],
    '/pharmacy': ['pharmacy', 'admin'],
};

/**
 * Check if a role can access a route
 */
export function canAccessRoute(role: string, pathname: string): boolean {
    // Public routes
    if (!pathname.match(/^\/(patient|doctor|hospital|admin|pharmacy)/)) {
        return true;
    }

    // Find matching route pattern
    for (const [pattern, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
        if (pathname.startsWith(pattern)) {
            return allowedRoles.includes(role as UserRole);
        }
    }

    return true;
}

export default {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    getPermissions,
    hasRole,
    hasRoleLevel,
    isAdmin,
    isProvider,
    isPatient,
    canAccessRoute,
};
