'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { Calendar, Plus, AlertCircle, Video, Building2, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { routes } from '@/config';
import { appointmentsApi } from '@/lib/api';
import { AppointmentStatus } from '@/types/enums';
import { AppointmentListItem } from '@/types/models/appointment';
import { APPOINTMENT_STATUS_LABELS } from '@/lib/constants/appointment-status';

export default function AppointmentsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const tab = searchParams.get('tab') || 'upcoming';
    const page = Number(searchParams.get('page')) || 1;

    const [appointments, setAppointments] = useState<AppointmentListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        async function fetchAppointments() {
            setLoading(true);
            setError(null);

            try {
                let statusFilter: AppointmentStatus[] | undefined;

                switch (tab) {
                    case 'upcoming':
                        statusFilter = ['pending_payment', 'confirmed', 'rescheduled'];
                        break;
                    case 'completed':
                        statusFilter = ['completed', 'checked_in', 'in_progress'];
                        break;
                    case 'cancelled':
                        statusFilter = ['cancelled', 'no_show'];
                        break;
                }

                const response = await appointmentsApi.listAppointments({
                    status: statusFilter,
                    page,
                    limit: 10,
                    sortBy: 'appointmentDate',
                    sortOrder: tab === 'upcoming' ? 'asc' : 'desc',
                });

                setAppointments(response.appointments || []);
                setTotalPages(response.totalPages || 1);
            } catch (err: any) {
                console.error('Failed to fetch appointments:', err);
                setError('Failed to load appointments');
            } finally {
                setLoading(false);
            }
        }

        fetchAppointments();
    }, [tab, page]);

    const handleTabChange = (newTab: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', newTab);
        params.set('page', '1');
        router.push(`?${params.toString()}`);
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`?${params.toString()}`);
    };

    const tabs = [
        { id: 'upcoming', label: 'Upcoming' },
        { id: 'completed', label: 'Completed' },
        { id: 'cancelled', label: 'Cancelled' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">My Appointments</h1>
                    <p className="text-muted-foreground text-sm">View and manage your appointments</p>
                </div>
                <Link
                    href={routes.patient.bookAppointment}
                    className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Book New
                </Link>
            </div>

            {/* Tabs */}
            <div className="flex items-center bg-muted rounded-lg p-1 w-fit">
                {tabs.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => handleTabChange(t.id)}
                        className={cn(
                            "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                            tab === t.id
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                    <p className="text-sm text-destructive flex-1">{error}</p>
                    <button onClick={() => window.location.reload()} className="text-sm text-destructive underline">
                        Retry
                    </button>
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                    <p className="text-sm text-muted-foreground">Loading appointments...</p>
                </div>
            ) : appointments.length > 0 ? (
                <>
                    {/* Appointments List */}
                    <div className="space-y-3">
                        {appointments.map((apt) => (
                            <AppointmentRow key={apt.id} appointment={apt} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-4">
                            <button
                                onClick={() => handlePageChange(Math.max(1, page - 1))}
                                disabled={page === 1}
                                className="h-9 px-4 rounded-lg border text-sm font-medium hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-muted-foreground px-4">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                                disabled={page === totalPages}
                                className="h-9 px-4 rounded-lg border text-sm font-medium hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            ) : !error && (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Calendar className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-1">No {tab} appointments</h3>
                    <p className="text-sm text-muted-foreground text-center">
                        {tab === 'upcoming' ? "You don't have any upcoming appointments scheduled." : `You don't have any ${tab} appointments.`}
                    </p>
                    {tab === 'upcoming' && (
                        <Link
                            href={routes.patient.bookAppointment}
                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
                        >
                            <Plus className="h-4 w-4" />
                            Book Appointment
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}

// Appointment Row Component
function AppointmentRow({ appointment }: { appointment: AppointmentListItem }) {
    const isOnline = appointment.consultationType === 'online';

    const getDateLabel = (dateStr: string) => {
        try {
            const date = parseISO(dateStr);
            if (isToday(date)) return 'Today';
            if (isTomorrow(date)) return 'Tomorrow';
            return format(date, 'EEE, MMM d');
        } catch {
            return dateStr;
        }
    };

    const statusColors: Record<string, string> = {
        pending_payment: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        no_show: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
        rescheduled: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        in_progress: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        checked_in: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
    };

    return (
        <Link
            href={`/patient/appointments/${appointment.id}`}
            className="flex items-center gap-4 bg-card rounded-xl border p-4 hover:border-primary/30 hover:shadow-sm transition-all group"
        >
            {/* Doctor Avatar */}
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-lg font-bold text-primary shrink-0">
                {appointment.doctorName?.charAt(0) || 'D'}
            </div>

            {/* Main Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold truncate group-hover:text-primary transition-colors">
                        Dr. {appointment.doctorName}
                    </p>
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium shrink-0", statusColors[appointment.status] || 'bg-muted')}>
                        {APPOINTMENT_STATUS_LABELS[appointment.status] || appointment.status}
                    </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                    {appointment.doctorSpecialization || 'Consultation'}
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {getDateLabel(appointment.appointmentDate)}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {appointment.startTime}
                    </span>
                    <span className={cn("flex items-center gap-1", isOnline ? "text-emerald-600" : "text-blue-600")}>
                        {isOnline ? <Video className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
                        {isOnline ? 'Video' : 'Clinic'}
                    </span>
                </div>
            </div>

            {/* Arrow */}
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
        </Link>
    );
}
