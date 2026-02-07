/**
 * ROZX Healthcare Platform - Role Constants
 * 
 * User role definitions and utilities.
 */

// =============================================================================
// Role Enum
// =============================================================================

export const UserRole = {
    PATIENT: 'patient',
    DOCTOR: 'doctor',
    HOSPITAL: 'hospital',
    RECEPTION: 'reception',
    PHARMACY: 'pharmacy',
    ADMIN: 'admin',
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

// =============================================================================
// Role Labels
// =============================================================================

export const ROLE_LABELS: Record<UserRoleType, string> = {
    patient: 'Patient',
    doctor: 'Doctor',
    hospital: 'Hospital Admin',
    reception: 'Receptionist',
    pharmacy: 'Pharmacist',
    admin: 'Platform Admin',
};

// =============================================================================
// Role Colors
// =============================================================================

export const ROLE_COLORS: Record<UserRoleType, string> = {
    patient: '#3b82f6', // blue
    doctor: '#10b981', // green
    hospital: '#8b5cf6', // purple
    reception: '#f59e0b', // amber
    pharmacy: '#06b6d4', // cyan
    admin: '#ef4444', // red
};

// =============================================================================
// Role Icons
// =============================================================================

export const ROLE_ICONS: Record<UserRoleType, string> = {
    patient: 'User',
    doctor: 'Stethoscope',
    hospital: 'Building2',
    reception: 'UserCheck',
    pharmacy: 'Pill',
    admin: 'Shield',
};

// =============================================================================
// Role Hierarchy
// =============================================================================

export const ROLE_HIERARCHY: Record<UserRoleType, number> = {
    admin: 100,
    hospital: 50,
    doctor: 40,
    reception: 30,
    pharmacy: 20,
    patient: 10,
};

// =============================================================================
// Utility Functions
// =============================================================================

export function getRoleLabel(role: string): string {
    return ROLE_LABELS[role as UserRoleType] || role;
}

export function getRoleColor(role: string): string {
    return ROLE_COLORS[role as UserRoleType] || '#6b7280';
}

export function isValidRole(role: string): role is UserRoleType {
    return Object.values(UserRole).includes(role as UserRoleType);
}

export function compareRoles(roleA: string, roleB: string): number {
    const levelA = ROLE_HIERARCHY[roleA as UserRoleType] || 0;
    const levelB = ROLE_HIERARCHY[roleB as UserRoleType] || 0;
    return levelA - levelB;
}

export default UserRole;
