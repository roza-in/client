'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    MessageSquare,
    Clock,
    CheckCircle,
    AlertTriangle,
    Search,
} from 'lucide-react';
import { StatsCard } from '@/components/patients';
import { LoadingSpinner, EmptyState, Pagination } from '@/components/shared';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { adminRoutes } from '@/config/routes';
import { useAllTickets, useSupportStats } from '@/features/support';
import type { TicketFilters } from '@/types';

const TICKET_STATUSES = [
    { value: 'all', label: 'All Statuses' },
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'waiting_on_customer', label: 'Waiting on Customer' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
];

const PRIORITIES = [
    { value: 'all', label: 'All Priorities' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
];

const PRIORITY_COLORS: Record<string, string> = {
    urgent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

const STATUS_COLORS: Record<string, string> = {
    open: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    in_progress: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    waiting_on_customer: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    resolved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    closed: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

export default function AdminSupportPage() {
    const [filters, setFilters] = useState<TicketFilters>({
        page: 1,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });
    const [searchTerm, setSearchTerm] = useState('');

    const { data: stats, isLoading: statsLoading } = useSupportStats();
    const { data, isLoading } = useAllTickets({
        ...filters,
        search: searchTerm || undefined,
    });

    const tickets = data?.tickets ?? [];
    const pagination = data?.pagination;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Support Tickets</h1>
                <p className="text-muted-foreground">Manage customer support requests</p>
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
                        title="Open Tickets"
                        value={stats?.openTickets ?? 0}
                        icon={MessageSquare}
                        variant="primary"
                    />
                    <StatsCard
                        title="In Progress"
                        value={stats?.inProgressTickets ?? 0}
                        icon={Clock}
                        variant="warning"
                    />
                    <StatsCard
                        title="Resolved"
                        value={stats?.resolvedTickets ?? 0}
                        icon={CheckCircle}
                        variant="success"
                    />
                    <StatsCard
                        title="SLA Breach Rate"
                        value={`${((stats?.slaBreachRate ?? 0) * 100).toFixed(1)}%`}
                        icon={AlertTriangle}
                    />
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search tickets..."
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
                            status: value === 'all' ? undefined : (value as TicketFilters['status']),
                            page: 1,
                        }))
                    }
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        {TICKET_STATUSES.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                                {s.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select
                    value={(filters.priority as string) ?? 'all'}
                    onValueChange={(value: string) =>
                        setFilters((prev) => ({
                            ...prev,
                            priority: value === 'all' ? undefined : (value as TicketFilters['priority']),
                            page: 1,
                        }))
                    }
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                        {PRIORITIES.map((p) => (
                            <SelectItem key={p.value} value={p.value}>
                                {p.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Ticket List */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner />
                </div>
            ) : tickets.length === 0 ? (
                <EmptyState
                    title="No tickets found"
                    description="No support tickets match your filters."
                    icon={MessageSquare}
                />
            ) : (
                <>
                    <div className="rounded-xl border divide-y">
                        {tickets.map((ticket) => (
                            <Link
                                key={ticket.id}
                                href={adminRoutes.ticket(ticket.id)}
                                className="flex items-center gap-4 p-4 hover:bg-muted/50"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-medium truncate">{ticket.subject}</p>
                                        {ticket.slaBreached && (
                                            <span className="shrink-0 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 text-xs">
                                                SLA Breached
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {ticket.ticketNumber ?? ticket.id.slice(0, 8)} · {ticket.userName} · {ticket.category.replace(/_/g, ' ')}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className={`rounded-full px-2 py-0.5 text-xs ${PRIORITY_COLORS[ticket.priority] ?? ''}`}>
                                        {ticket.priority}
                                    </span>
                                    <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_COLORS[ticket.status] ?? ''}`}>
                                        {ticket.status.replace(/_/g, ' ')}
                                    </span>
                                </div>
                            </Link>
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
