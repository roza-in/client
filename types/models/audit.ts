/**
 * Rozx Healthcare Platform — Audit Log Model Types
 */

import type { AuditAction, UserRole } from '../enums';

// =============================================================================
// Audit Log Entity
// =============================================================================

export interface AuditLog {
    id: string;
    userId: string | null;
    userRole: UserRole | null;
    action: AuditAction;
    description: string | null;
    entityType: string;
    entityId: string | null;
    ipAddress: string | null;
    userAgent: string | null;
    correlationId: string | null;
    changes: Record<string, unknown> | null;
    metadata: Record<string, unknown> | null;
    accessedPhi: boolean;
    phiFields: string[] | null;
    createdAt: string;
}

// =============================================================================
// Audit Log List Item
// =============================================================================

export interface AuditLogListItem {
    id: string;
    userId: string | null;
    userName: string | null;
    userRole: UserRole | null;
    action: AuditAction;
    description: string | null;
    entityType: string;
    entityId: string | null;
    ipAddress: string | null;
    accessedPhi: boolean;
    createdAt: string;
}

// =============================================================================
// Audit Log with User
// =============================================================================

export interface AuditLogWithUser extends AuditLog {
    user: {
        id: string;
        name: string;
        email: string | null;
        role: UserRole;
    } | null;
}

// =============================================================================
// Audit Stats
// =============================================================================

export interface AuditStats {
    totalLogs: number;
    logsByAction: Record<AuditAction, number>;
    phiAccessCount: number;
    uniqueUsers: number;
}

// =============================================================================
// Filter Types
// =============================================================================

export interface AuditLogFilters {
    [key: string]: string | number | boolean | string[] | null | undefined;
    userId?: string;
    userRole?: UserRole;
    action?: AuditAction | AuditAction[];
    entityType?: string;
    entityId?: string;
    accessedPhi?: boolean;
    startDate?: string;
    endDate?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'action';
    sortOrder?: 'asc' | 'desc';
}
