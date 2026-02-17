'use client';

import { useQuery } from '@tanstack/react-query';
import { getAuditLogs, getAuditLog, getAuditStats } from '../api/audit-api';
import type { AuditLogFilters } from '@/types';

export const auditKeys = {
    all: ['audit-logs'] as const,
    lists: () => [...auditKeys.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...auditKeys.lists(), filters] as const,
    details: () => [...auditKeys.all, 'detail'] as const,
    detail: (id: string) => [...auditKeys.details(), id] as const,
    stats: () => [...auditKeys.all, 'stats'] as const,
};

export function useAuditLogs(filters: AuditLogFilters = {}) {
    return useQuery({
        queryKey: auditKeys.list(filters),
        queryFn: () => getAuditLogs(filters),
        staleTime: 1 * 60 * 1000,
    });
}

export function useAuditLog(id: string) {
    return useQuery({
        queryKey: auditKeys.detail(id),
        queryFn: () => getAuditLog(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
}

export function useAuditStats() {
    return useQuery({
        queryKey: auditKeys.stats(),
        queryFn: getAuditStats,
        staleTime: 5 * 60 * 1000,
    });
}
