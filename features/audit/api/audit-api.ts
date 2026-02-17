/**
 * Audit Logs API Functions
 */
import { api } from '@/lib/api';
import type {
    AuditLogListItem,
    AuditLogWithUser,
    AuditStats,
    AuditLogFilters,
} from '@/types';

const AUDIT_BASE = '/admin/audit-logs';

export async function getAuditLogs(filters: AuditLogFilters = {}) {
    const { data, meta } = await api.getWithMeta<AuditLogListItem[]>(
        AUDIT_BASE,
        { params: filters }
    );
    return { logs: data, pagination: meta };
}

export async function getAuditLog(id: string) {
    return api.get<AuditLogWithUser>(`${AUDIT_BASE}/${id}`);
}

export async function getAuditStats() {
    return api.get<AuditStats>(`${AUDIT_BASE}/stats`);
}
