'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
    Calendar,
    Video,
    Users,
    Clock,
    ChevronRight,
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Play,
    RefreshCw,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useAppointments, appointmentKeys } from '@/features/appointments/hooks/use-appointments';
import { LoadingSpinner, EmptyState, Pagination } from '@/components/shared';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays } from 'date-fns';
import type { AppointmentListItem } from '@/types';
import { useQueryClient } from '@tanstack/react-query';

// =============================================================================
// Types
// =============================================================================

type TabKey = 'all' | 'upcoming' | 'completed' | 'cancelled';
type DateRange = 'today' | 'tomorrow' | 'week' | 'month' | 'all';

interface Tab {
    key: TabKey;
    label: string;
    statuses?: string[];
}

// =============================================================================
// Constants
// =============================================================================

const TABS: Tab[] = [
    { key: 'all', label: 'All' },
    { key: 'upcoming', label: 'Upcoming', statuses: ['confirmed', 'checked_in', 'pending_payment'] },
    { key: 'completed', label: 'Completed', statuses: ['completed'] },
    { key: 'cancelled', label: 'Cancelled', statuses: ['cancelled', 'no_show'] },
];

const DATE_RANGES: { key: DateRange; label: string }[] = [
    { key: 'today', label: 'Today' },
    { key: 'tomorrow', label: 'Tomorrow' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'all', label: 'All Time' },
];

// =============================================================================
// Status Badge Component
// =============================================================================

function StatusBadge({ status }: { status: string }) {
    const statusConfig: Record<string, { bg: string; text: string; icon: React.ComponentType<{ className?: string }> }> = {
        confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle2 },
        checked_in: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Users },
        in_progress: { bg: 'bg-amber-100', text: 'text-amber-700', icon: Play },
        completed: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle2 },
        cancelled: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
        no_show: { bg: 'bg-slate-100', text: 'text-slate-700', icon: AlertCircle },
        pending_payment: { bg: 'bg-orange-100', text: 'text-orange-700', icon: Clock },
        rescheduled: { bg: 'bg-cyan-100', text: 'text-cyan-700', icon: RefreshCw },
    };

    const config = statusConfig[status] || { bg: 'bg-slate-100', text: 'text-slate-700', icon: AlertCircle };
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${config.bg} ${config.text}`}>
            <Icon className="h-3 w-3" />
            <span className="capitalize">{status.replace('_', ' ')}</span>
        </span>
    );
}

// =============================================================================
// Appointment Card Component
// =============================================================================

function AppointmentCard({ appointment }: { appointment: AppointmentListItem }) {
    const isVideo = appointment.consultationType === 'online' || appointment.consultationType === 'video';
    const canStart = isVideo && (appointment.status === 'confirmed' || appointment.status === 'checked_in');
    const appointmentDate = new Date(appointment.appointmentDate);
    const isToday = format(appointmentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

    return (
        <div className="rounded-xl border bg-card p-5 hover:shadow-md transition-all group">
            <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4 flex-1 min-w-0">
                    {/* Patient Avatar */}
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-bold text-lg shrink-0">
                        {appointment.patientAvatar ? (
                            <img
                                src={appointment.patientAvatar}
                                alt={appointment.patientName || 'Patient'}
                                className="h-full w-full rounded-full object-cover"
                            />
                        ) : (
                            (appointment.patientName || 'P').split(' ').map((n) => n[0]).join('').toUpperCase()
                        )}
                    </div>

                    {/* Patient Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-slate-900 truncate">
                                {appointment.patientName || 'Patient'}
                            </h3>
                            <StatusBadge status={appointment.status} />
                        </div>

                        {appointment.symptoms && appointment.symptoms.length > 0 && (
                            <p className="text-sm text-muted-foreground mt-1 truncate">
                                {appointment.symptoms.slice(0, 2).join(', ')}
                            </p>
                        )}

                        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                {isToday ? (
                                    <span className="text-primary font-medium">Today</span>
                                ) : (
                                    format(appointmentDate, 'MMM d, yyyy')
                                )}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                {format(new Date(`2026-01-01T${appointment.startTime}`), 'h:mm a')}
                            </span>
                            <span className="flex items-center gap-1.5">
                                {isVideo ? (
                                    <>
                                        <Video className="h-4 w-4 text-primary" />
                                        <span>Video Call</span>
                                    </>
                                ) : (
                                    <>
                                        <Users className="h-4 w-4 text-green-500" />
                                        <span>In-Person</span>
                                    </>
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    {canStart && (
                        <Link
                            href={`/consultation/${appointment.id}`}
                            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm"
                        >
                            <Play className="h-4 w-4 fill-current" />
                            Start
                        </Link>
                    )}
                    <Link
                        href={`/doctor/appointments/${appointment.id}`}
                        className="rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors flex items-center gap-1 group-hover:border-primary group-hover:text-primary"
                    >
                        Details
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

// =============================================================================
// Main Page Component
// =============================================================================

export default function DoctorAppointmentsPage() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const doctorId = user?.doctor?.id;

    // State
    const [activeTab, setActiveTab] = useState<TabKey>('all');
    const [dateRange, setDateRange] = useState<DateRange>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate date range
    const dateFilters = useMemo(() => {
        const today = new Date();
        switch (dateRange) {
            case 'today':
                return {
                    startDate: format(today, 'yyyy-MM-dd'),
                    endDate: format(today, 'yyyy-MM-dd'),
                };
            case 'tomorrow':
                const tomorrow = addDays(today, 1);
                return {
                    startDate: format(tomorrow, 'yyyy-MM-dd'),
                    endDate: format(tomorrow, 'yyyy-MM-dd'),
                };
            case 'week':
                return {
                    startDate: format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
                    endDate: format(endOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
                };
            case 'month':
                return {
                    startDate: format(startOfMonth(today), 'yyyy-MM-dd'),
                    endDate: format(endOfMonth(today), 'yyyy-MM-dd'),
                };
            default:
                return {};
        }
    }, [dateRange]);

    // Get status filter based on active tab
    const statusFilter = useMemo(() => {
        const tab = TABS.find((t) => t.key === activeTab);
        return tab?.statuses?.join(',') || undefined;
    }, [activeTab]);

    // Fetch appointments
    const { data, isLoading, isFetching } = useAppointments({
        doctorId: doctorId || undefined,
        ...dateFilters,
        status: statusFilter,
        page: currentPage,
        limit: 10,
    });

    // Filter by search query (client-side)
    const filteredAppointments = useMemo(() => {
        if (!data?.appointments) return [];
        if (!searchQuery.trim()) return data.appointments;

        const query = searchQuery.toLowerCase();
        return data.appointments.filter(
            (apt) =>
                apt.patientName?.toLowerCase().includes(query) ||
                apt.bookingId?.toLowerCase().includes(query)
        );
    }, [data?.appointments, searchQuery]);

    // Tab counts
    const tabCounts = useMemo(() => {
        const appointments = data?.appointments || [];
        return {
            all: appointments.length,
            upcoming: appointments.filter((a) =>
                ['confirmed', 'checked_in', 'pending_payment'].includes(a.status)
            ).length,
            completed: appointments.filter((a) => a.status === 'completed').length,
            cancelled: appointments.filter((a) => ['cancelled', 'no_show'].includes(a.status)).length,
        };
    }, [data?.appointments]);

    // Refresh handler
    const handleRefresh = () => {
        queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
                    <p className="text-muted-foreground">Manage your patient appointments</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Date Range Selector */}
                    <select
                        value={dateRange}
                        onChange={(e) => {
                            setDateRange(e.target.value as DateRange);
                            setCurrentPage(1);
                        }}
                        className="rounded-lg border bg-background px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        {DATE_RANGES.map((range) => (
                            <option key={range.key} value={range.key}>
                                {range.label}
                            </option>
                        ))}
                    </select>

                    {/* Refresh Button */}
                    <button
                        onClick={handleRefresh}
                        disabled={isFetching}
                        className="rounded-lg border p-2.5 hover:bg-muted transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Search & Tabs */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by patient name or booking ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border bg-background pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                {/* Tabs */}
                <div className="flex gap-1 rounded-lg border p-1 bg-muted/30 w-fit">
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => {
                                setActiveTab(tab.key);
                                setCurrentPage(1);
                            }}
                            className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${activeTab === tab.key
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-muted-foreground hover:text-slate-900'
                                }`}
                        >
                            {tab.label}
                            <span
                                className={`ml-1.5 text-xs ${activeTab === tab.key ? 'text-primary' : 'text-muted-foreground/60'
                                    }`}
                            >
                                ({tabCounts[tab.key]})
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Appointments List */}
            {isLoading ? (
                <div className="flex justify-center py-16">
                    <LoadingSpinner size="lg" />
                </div>
            ) : filteredAppointments.length > 0 ? (
                <div className="space-y-4">
                    {filteredAppointments.map((appointment) => (
                        <AppointmentCard key={appointment.id} appointment={appointment} />
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={Calendar}
                    title="No appointments found"
                    description={
                        searchQuery
                            ? `No appointments matching "${searchQuery}"`
                            : `No ${activeTab !== 'all' ? activeTab : ''} appointments for ${dateRange === 'all' ? 'all time' : dateRange
                            }`
                    }
                />
            )}

            {/* Pagination */}
            {data?.pagination && data.pagination.totalPages > 1 && (
                <div className="pt-4">
                    <Pagination
                        currentPage={data.pagination.page || currentPage}
                        totalPages={data.pagination.totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
}
