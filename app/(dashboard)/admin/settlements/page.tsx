'use client';

import { useState } from 'react';
import {
    DollarSign,
    Clock,
    CheckCircle,
    AlertTriangle,
    Search,
} from 'lucide-react';
import { StatsCard } from '@/components/patients';
import { LoadingSpinner, EmptyState, Pagination } from '@/components/shared';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useAllSettlements, useSettlementStats, useApproveSettlement, useInitiateSettlementPayout } from '@/features/settlements';
import type { SettlementFilters } from '@/types';

const SETTLEMENT_STATUSES = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' },
];

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function AdminSettlementsPage() {
    const [filters, setFilters] = useState<SettlementFilters>({
        page: 1,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });
    const [searchTerm, setSearchTerm] = useState('');

    const { data: stats, isLoading: statsLoading } = useSettlementStats();
    const { data, isLoading } = useAllSettlements({
        ...filters,
        search: searchTerm || undefined,
    });
    const approveMutation = useApproveSettlement();
    const payoutMutation = useInitiateSettlementPayout();

    const settlements = data?.settlements ?? [];
    const pagination = data?.pagination;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Settlements</h1>
                <p className="text-muted-foreground">Manage platform settlements and payouts</p>
            </div>

            {/* Stats */}
            {statsLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-28 animate-pulse rounded-xl border bg-muted" />
                    ))}
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total Settlements"
                        value={stats?.totalSettlements ?? 0}
                        icon={DollarSign}
                        variant="primary"
                    />
                    <StatsCard
                        title="Pending"
                        value={stats?.pendingSettlements ?? 0}
                        icon={Clock}
                        variant="warning"
                    />
                    <StatsCard
                        title="Completed"
                        value={stats?.completedSettlements ?? 0}
                        icon={CheckCircle}
                        variant="success"
                    />
                    <StatsCard
                        title="Amount Settled"
                        value={`₹${(stats?.totalAmountSettled ?? 0).toLocaleString()}`}
                        icon={DollarSign}
                    />
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search settlements..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select
                    value={(filters.status as string) ?? 'all'}
                    onValueChange={(value: string) =>
                        setFilters((prev) => ({
                            ...prev,
                            status: value === 'all' ? undefined : (value as SettlementFilters['status']),
                            page: 1,
                        }))
                    }
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        {SETTLEMENT_STATUSES.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                                {s.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Settlements List */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner />
                </div>
            ) : settlements.length === 0 ? (
                <EmptyState
                    title="No settlements found"
                    description="No settlements match your filters."
                    icon={DollarSign}
                />
            ) : (
                <>
                    <div className="rounded-xl border divide-y">
                        {settlements.map((settlement) => (
                            <div
                                key={settlement.id}
                                className="flex items-center gap-4 p-4"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">
                                        {settlement.settlementNumber ?? `#${settlement.id.slice(0, 8)}`}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {settlement.entityName} · {settlement.entityType}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(settlement.periodStart).toLocaleDateString()} – {new Date(settlement.periodEnd).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="font-medium">₹{settlement.netPayable.toLocaleString()}</p>
                                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs mt-1 ${STATUS_COLORS[settlement.status] ?? ''}`}>
                                        {settlement.status}
                                    </span>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    {settlement.status === 'pending' && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => approveMutation.mutate(settlement.id)}
                                            disabled={approveMutation.isPending}
                                        >
                                            Approve
                                        </Button>
                                    )}
                                    {settlement.status === 'processing' && (
                                        <Button
                                            size="sm"
                                            onClick={() => payoutMutation.mutate(settlement.id)}
                                            disabled={payoutMutation.isPending}
                                        >
                                            Initiate Payout
                                        </Button>
                                    )}
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
