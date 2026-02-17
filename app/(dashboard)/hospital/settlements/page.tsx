'use client';

import { useState } from 'react';
import { DollarSign, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { StatsCard } from '@/components/patients';
import { LoadingSpinner, EmptyState, Pagination } from '@/components/shared';
import { useMySettlements } from '@/features/settlements';
import type { SettlementFilters } from '@/types';

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function HospitalSettlementsPage() {
    const [filters, setFilters] = useState<SettlementFilters>({
        page: 1,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });

    const { data, isLoading } = useMySettlements(filters);
    const settlements = data?.settlements ?? [];
    const pagination = data?.pagination;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">My Settlements</h1>
                <p className="text-muted-foreground">Track your earnings and payouts</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner />
                </div>
            ) : settlements.length === 0 ? (
                <EmptyState
                    title="No settlements yet"
                    description="Your settlements will appear here once processed."
                    icon={DollarSign}
                />
            ) : (
                <>
                    <div className="rounded-xl border divide-y">
                        {settlements.map((s) => (
                            <div key={s.id} className="flex items-center gap-4 p-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <DollarSign className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium">
                                        {s.settlementNumber ?? `#${s.id.slice(0, 8)}`}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(s.periodStart).toLocaleDateString()} – {new Date(s.periodEnd).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="font-semibold">₹{s.netPayable.toLocaleString()}</p>
                                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs mt-1 ${STATUS_COLORS[s.status] ?? ''}`}>
                                        {s.status}
                                    </span>
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
