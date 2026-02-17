'use client';

import { useState } from 'react';
import {
    Shield,
    Search,
    Eye,
} from 'lucide-react';
import { LoadingSpinner, EmptyState, Pagination } from '@/components/shared';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { useAuditLogs } from '@/features/audit';
import type { AuditLogFilters, AuditAction } from '@/types';

const AUDIT_ACTIONS = [
    { value: 'all', label: 'All Actions' },
    { value: 'create', label: 'Create' },
    { value: 'read', label: 'Read' },
    { value: 'update', label: 'Update' },
    { value: 'delete', label: 'Delete' },
    { value: 'login', label: 'Login' },
    { value: 'logout', label: 'Logout' },
    { value: 'payment', label: 'Payment' },
    { value: 'refund', label: 'Refund' },
    { value: 'status_change', label: 'Status Change' },
    { value: 'verification', label: 'Verification' },
    { value: 'payout', label: 'Payout' },
    { value: 'settlement', label: 'Settlement' },
];

const ACTION_COLORS: Record<string, string> = {
    create: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    update: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    delete: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    login: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    logout: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    payment: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    refund: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    status_change: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    verification: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

export default function AdminAuditsPage() {
    const [filters, setFilters] = useState<AuditLogFilters>({
        page: 1,
        limit: 30,
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });
    const [searchTerm, setSearchTerm] = useState('');

    const { data, isLoading } = useAuditLogs({
        ...filters,
        search: searchTerm || undefined,
    });

    const logs = data?.logs ?? [];
    const pagination = data?.pagination;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Audit Logs</h1>
                <p className="text-muted-foreground">Track platform activity and changes</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search audit logs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select
                    value={(filters.action as string) ?? 'all'}
                    onValueChange={(value: string) =>
                        setFilters((prev) => ({
                            ...prev,
                            action: value === 'all' ? undefined : (value as AuditAction),
                            page: 1,
                        }))
                    }
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Action" />
                    </SelectTrigger>
                    <SelectContent>
                        {AUDIT_ACTIONS.map((a) => (
                            <SelectItem key={a.value} value={a.value}>
                                {a.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Log List */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner />
                </div>
            ) : logs.length === 0 ? (
                <EmptyState
                    title="No audit logs found"
                    description="No audit entries match your filters."
                    icon={Shield}
                />
            ) : (
                <>
                    <div className="rounded-xl border divide-y">
                        {logs.map((log) => (
                            <div key={log.id} className="flex items-center gap-4 p-4">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                                    <Shield className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className={`rounded-full px-2 py-0.5 text-xs ${ACTION_COLORS[log.action] ?? 'bg-gray-100 text-gray-700'}`}>
                                            {log.action}
                                        </span>
                                        <span className="text-xs text-muted-foreground capitalize">
                                            {log.entityType}
                                        </span>
                                        {log.accessedPhi && (
                                            <span className="rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 text-xs flex items-center gap-1">
                                                <Eye className="h-3 w-3" /> PHI
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm truncate">
                                        {log.description ?? `${log.action} on ${log.entityType}`}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {log.userName ?? 'System'} {log.userRole ? `(${log.userRole})` : ''}
                                        {log.ipAddress && ` · ${log.ipAddress}`}
                                    </p>
                                </div>
                                <div className="text-xs text-muted-foreground shrink-0">
                                    {new Date(log.createdAt).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                    {pagination && pagination.totalPages > 1 && (
                        <Pagination
                            currentPage={filters.page ?? 1}
                            totalPages={pagination.totalPages}
                            onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
                        />
                    )}
                </>
            )}
        </div>
    );
}
