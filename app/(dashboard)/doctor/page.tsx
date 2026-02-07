'use client';

import { useMemo } from 'react';
import {
    Play,
    Video,
    Users,
    ChevronRight,
    Clock,
    Calendar,
    User,
    Activity,
    Phone,
    MapPin,
    Stethoscope,
    ClipboardList,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useDoctorSchedule, type DayOfWeek } from '@/features/schedules';
import { useAppointments } from '@/features/appointments';
import { LoadingSpinner, EmptyState } from '@/components/shared';
import Link from 'next/link';
import { format, addDays, isToday } from 'date-fns';
import type { AppointmentListItem, ConsultationType, AppointmentStatus } from '@/types';

// =============================================================================
// Status Badge Component
// =============================================================================

function StatusBadge({ status }: { status: AppointmentStatus }) {
    const config: Record<string, { bg: string; text: string; label: string }> = {
        confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Confirmed' },
        checked_in: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Checked In' },
        in_progress: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'In Progress' },
        completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
        cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' },
        no_show: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'No Show' },
        pending_payment: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Pending Payment' },
        rescheduled: { bg: 'bg-cyan-100', text: 'text-cyan-700', label: 'Rescheduled' },
    };

    const c = config[status] || { bg: 'bg-slate-100', text: 'text-slate-600', label: status };

    return (
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${c.bg} ${c.text}`}>
            {c.label}
        </span>
    );
}

// =============================================================================
// Consultation Type Icon
// =============================================================================

function ConsultationTypeIcon({ type, className = 'h-4 w-4' }: { type: ConsultationType; className?: string }) {
    switch (type) {
        case 'online':
            return <Video className={`${className} text-primary`} />;
        case 'phone':
            return <Phone className={`${className} text-blue-500`} />;
        case 'home_visit':
            return <MapPin className={`${className} text-amber-500`} />;
        default:
            return <Users className={`${className} text-green-500`} />;
    }
}

// =============================================================================
// Get Action Button for Appointment
// =============================================================================

function getActionButton(appointment: AppointmentListItem) {
    const isOnline = appointment.consultationType === 'online';
    const isPhone = appointment.consultationType === 'phone';
    const canStart = ['confirmed', 'checked_in'].includes(appointment.status);
    const isInProgress = appointment.status === 'in_progress';

    if (isOnline && (canStart || isInProgress)) {
        return {
            label: isInProgress ? 'Continue Call' : 'Join Video Call',
            href: `/consultation/${appointment.id}`,
            icon: Video,
            primary: true,
        };
    }

    if (isPhone && (canStart || isInProgress)) {
        return {
            label: isInProgress ? 'Continue Call' : 'Start Phone Call',
            href: `/consultation/${appointment.id}`,
            icon: Phone,
            primary: true,
        };
    }

    if (canStart || isInProgress) {
        return {
            label: 'Attend Patient',
            href: `/doctor/appointments/${appointment.id}`,
            icon: Stethoscope,
            primary: true,
        };
    }

    return {
        label: 'View Details',
        href: `/doctor/appointments/${appointment.id}`,
        icon: ChevronRight,
        primary: false,
    };
}

// =============================================================================
// Appointment Card Component
// =============================================================================

function AppointmentCard({ appointment }: { appointment: AppointmentListItem }) {
    const action = getActionButton(appointment);
    const ActionIcon = action.icon;

    return (
        <div className="rounded-xl border bg-card p-5 hover:shadow-md transition-all group">
            <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4 flex-1 min-w-0">
                    {/* Patient Avatar */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold shrink-0">
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
                            <h3 className="font-semibold text-slate-900 truncate">
                                {appointment.patientName || 'Patient'}
                            </h3>
                            <StatusBadge status={appointment.status as AppointmentStatus} />
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                {format(new Date(`2026-01-01T${appointment.startTime}`), 'h:mm a')}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <ConsultationTypeIcon type={appointment.consultationType as ConsultationType} className="h-3.5 w-3.5" />
                                <span className="capitalize">
                                    {appointment.consultationType === 'in_person' ? 'In-Person' :
                                        appointment.consultationType === 'online' ? 'Video' :
                                            appointment.consultationType}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    <Link
                        href={action.href}
                        className={`rounded-lg px-4 py-2.5 text-sm font-medium flex items-center gap-2 transition-colors ${action.primary
                            ? 'bg-primary text-white hover:bg-primary/90 shadow-sm'
                            : 'border hover:bg-muted group-hover:border-primary group-hover:text-primary'
                            }`}
                    >
                        <ActionIcon className="h-4 w-4" />
                        {action.label}
                    </Link>
                </div>
            </div>
        </div>
    );
}

// =============================================================================
// Quick Stats Bar Component
// =============================================================================

function QuickStatsBar({ todayCount, upcomingCount, completedCount }: { todayCount: number; upcomingCount: number; completedCount: number }) {
    return (
        <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">Today:</span>
                <span className="font-semibold text-slate-900">{todayCount}</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-muted-foreground">Upcoming:</span>
                <span className="font-semibold text-slate-900">{upcomingCount}</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-muted-foreground">Completed:</span>
                <span className="font-semibold text-slate-900">{completedCount}</span>
            </div>
        </div>
    );
}

// =============================================================================
// Main Dashboard Component
// =============================================================================

export default function DoctorDashboardPage() {
    const { user } = useAuth();
    const doctorId = user?.doctor?.id;
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');

    // Fetch today's appointments
    const { data: todayData, isLoading: isLoadingToday } = useAppointments({
        doctorId: doctorId || undefined,
        startDate: todayStr,
        endDate: todayStr,
    });

    // Fetch upcoming appointments (next 7 days)
    const { data: upcomingData, isLoading: isLoadingUpcoming } = useAppointments({
        doctorId: doctorId || undefined,
        startDate: format(addDays(today, 1), 'yyyy-MM-dd'),
        endDate: format(addDays(today, 7), 'yyyy-MM-dd'),
        status: 'confirmed',
    });

    // Fetch schedule for today
    const { data: scheduleData, isLoading: isLoadingSchedule } = useDoctorSchedule(doctorId || null);

    const dayKey = format(today, 'EEEE').toLowerCase() as DayOfWeek;
    const todaySchedules = (scheduleData as any)?.[dayKey]?.schedules || [];

    // Get today's appointments sorted by time
    const todayAppointments = useMemo(() => {
        if (!todayData?.appointments) return [];
        return [...todayData.appointments].sort((a, b) =>
            a.startTime.localeCompare(b.startTime)
        );
    }, [todayData]);

    // Get upcoming appointments
    const upcomingAppointments = useMemo(() => {
        if (!upcomingData?.appointments) return [];
        return [...upcomingData.appointments]
            .sort((a, b) => {
                const dateCompare = a.appointmentDate.localeCompare(b.appointmentDate);
                if (dateCompare !== 0) return dateCompare;
                return a.startTime.localeCompare(b.startTime);
            })
            .slice(0, 5);
    }, [upcomingData]);

    // Stats
    const stats = useMemo(() => {
        const appointments = todayData?.appointments || [];
        const completed = appointments.filter((a) => a.status === 'completed').length;
        const upcoming = upcomingData?.appointments?.length || 0;

        return { today: appointments.length, completed, upcoming };
    }, [todayData, upcomingData]);

    const isLoading = isLoadingToday || isLoadingUpcoming;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-muted-foreground">
                        {format(today, 'EEEE, MMMM d, yyyy')}
                    </p>
                </div>
                <QuickStatsBar
                    todayCount={stats.today}
                    upcomingCount={stats.upcoming}
                    completedCount={stats.completed}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Today's Appointments */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-900">Today's Appointments</h2>
                        <Link
                            href="/doctor/appointments"
                            className="text-sm font-medium text-primary hover:underline underline-offset-4"
                        >
                            View All
                        </Link>
                    </div>

                    {isLoadingToday ? (
                        <div className="flex justify-center py-12">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : todayAppointments.length > 0 ? (
                        <div className="space-y-3">
                            {todayAppointments.map((appointment) => (
                                <AppointmentCard key={appointment.id} appointment={appointment} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={Calendar}
                            title="No appointments today"
                            description="You don't have any scheduled appointments for today."
                        />
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Today's Schedule */}
                    <div className="rounded-xl border bg-card p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-slate-900">Today's Schedule</h3>
                            <Link
                                href="/doctor/schedule"
                                className="text-xs font-medium text-primary hover:underline"
                            >
                                View Full
                            </Link>
                        </div>

                        {isLoadingSchedule ? (
                            <div className="flex justify-center py-4">
                                <LoadingSpinner size="sm" />
                            </div>
                        ) : todaySchedules.length > 0 ? (
                            <div className="space-y-2">
                                {todaySchedules.map((slot: any) => (
                                    <div
                                        key={slot.id}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10"
                                    >
                                        <Clock className="h-4 w-4 text-primary" />
                                        <span className="text-sm font-medium text-slate-900">
                                            {slot.startTime} - {slot.endTime}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                No schedule for today
                            </p>
                        )}
                    </div>

                    {/* Upcoming Appointments */}
                    <div className="rounded-xl border bg-card p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-slate-900">Upcoming</h3>
                            <Link
                                href="/doctor/appointments"
                                className="text-xs font-medium text-primary hover:underline"
                            >
                                View All
                            </Link>
                        </div>

                        {isLoadingUpcoming ? (
                            <div className="flex justify-center py-4">
                                <LoadingSpinner size="sm" />
                            </div>
                        ) : upcomingAppointments.length > 0 ? (
                            <div className="space-y-3">
                                {upcomingAppointments.map((apt) => (
                                    <Link
                                        key={apt.id}
                                        href={`/doctor/appointments/${apt.id}`}
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                                    >
                                        <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600 shrink-0 group-hover:bg-primary/10 group-hover:text-primary">
                                            {(apt.patientName || 'P').charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-900 truncate">
                                                {apt.patientName || 'Patient'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {format(new Date(apt.appointmentDate), 'MMM d')} • {format(new Date(`2026-01-01T${apt.startTime}`), 'h:mm a')}
                                            </p>
                                        </div>
                                        <ConsultationTypeIcon type={apt.consultationType as ConsultationType} className="h-4 w-4" />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                No upcoming appointments
                            </p>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="rounded-xl border bg-card p-5">
                        <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <Link
                                href="/doctor/patients"
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                                <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <Users className="h-4 w-4 text-blue-600" />
                                </div>
                                <span className="text-sm font-medium text-slate-900">My Patients</span>
                                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                            </Link>
                            <Link
                                href="/doctor/schedule"
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                                <div className="h-9 w-9 rounded-lg bg-green-50 flex items-center justify-center">
                                    <Calendar className="h-4 w-4 text-green-600" />
                                </div>
                                <span className="text-sm font-medium text-slate-900">My Schedule</span>
                                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                            </Link>
                            <Link
                                href="/doctor/profile"
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                                <div className="h-9 w-9 rounded-lg bg-amber-50 flex items-center justify-center">
                                    <User className="h-4 w-4 text-amber-600" />
                                </div>
                                <span className="text-sm font-medium text-slate-900">My Profile</span>
                                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
