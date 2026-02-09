'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, Users, UserCheck, Clock, ArrowRight, Plus, Search } from 'lucide-react';
import { StatsCard } from '@/components/patients';
import { routes } from '@/config';
import { LoadingSpinner } from '@/components/shared';
import { useReceptionQueue, useCheckInPatient } from '@/features/reception';

export default function ReceptionDashboardPage() {
    const router = useRouter();
    const { data, isLoading, error } = useReceptionQueue();
    const checkInMutation = useCheckInPatient();

    const stats = data?.stats || {
        total: 0,
        confirmed: 0,
        checkedIn: 0,
        inProgress: 0,
        completed: 0,
        noShow: 0,
    };

    const appointments = data?.appointments || [];

    const handleCheckIn = async (appointmentId: string) => {
        checkInMutation.mutate(appointmentId);
    };

    const handleView = (appointmentId: string) => {
        router.push(`${routes.reception?.queue || '/reception/queue'}?appointmentId=${appointmentId}`);
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <p className="text-destructive mb-2">Failed to load queue</p>
                    <p className="text-sm text-muted-foreground">{error.message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Today's Appointments"
                    value={stats.total}
                    icon={Calendar}
                    variant="primary"
                />
                <StatsCard
                    title="Checked In"
                    value={stats.checkedIn}
                    icon={UserCheck}
                    variant="success"
                />
                <StatsCard
                    title="Waiting"
                    value={stats.confirmed}
                    icon={Clock}
                />
                <StatsCard
                    title="Completed"
                    value={stats.completed}
                    icon={Users}
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Queue */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Patient Queue</h2>
                        <Link
                            href={routes.reception?.queue || '/reception/queue'}
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                            View all
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    {appointments.length === 0 ? (
                        <div className="rounded-xl border p-8 text-center text-muted-foreground">
                            No patients in queue at the moment.
                        </div>
                    ) : (
                        <div className="rounded-xl border divide-y">
                            {appointments.slice(0, 8).map((apt) => (
                                <div key={apt.id} className="flex items-center gap-4 p-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                                        {apt.patient.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'P'}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{apt.patient.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Dr. {apt.doctor.name}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm">
                                            {new Date(apt.scheduledStart).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs mt-1 ${apt.status === 'checked_in'
                                            ? 'bg-green-100 text-green-700'
                                            : apt.status === 'confirmed'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : apt.status === 'in_progress'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {apt.status?.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => apt.status === 'confirmed' ? handleCheckIn(apt.id) : handleView(apt.id)}
                                        disabled={checkInMutation.isPending}
                                        className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {apt.status === 'confirmed' ? 'Check In' : 'View'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link
                            href={routes.reception?.walkinBooking || '/reception/book'}
                            className="flex items-center gap-3 rounded-xl border p-4 hover:bg-muted/50"
                        >
                            <Plus className="h-5 w-5 text-primary" />
                            <div>
                                <p className="font-medium">Walk-in Booking</p>
                                <p className="text-sm text-muted-foreground">Book appointment for walk-in patient</p>
                            </div>
                        </Link>
                        <Link
                            href={routes.reception?.patients || '/reception/patients'}
                            className="flex items-center gap-3 rounded-xl border p-4 hover:bg-muted/50"
                        >
                            <Search className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="font-medium">Find Patient</p>
                                <p className="text-sm text-muted-foreground">Search by phone or name</p>
                            </div>
                        </Link>
                        <Link
                            href={routes.reception?.schedule || '/reception/schedule'}
                            className="flex items-center gap-3 rounded-xl border p-4 hover:bg-muted/50"
                        >
                            <Calendar className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="font-medium">Doctor Schedules</p>
                                <p className="text-sm text-muted-foreground">View today's availability</p>
                            </div>
                        </Link>
                    </div>

                    {/* Summary */}
                    <div className="mt-6 rounded-xl border p-4">
                        <h3 className="font-semibold mb-3">Today's Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Completed</span>
                                <span className="font-medium text-green-600">
                                    {stats.completed}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">In Progress</span>
                                <span className="font-medium text-blue-600">
                                    {stats.inProgress}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Waiting</span>
                                <span className="font-medium text-yellow-600">
                                    {stats.confirmed}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">No Show</span>
                                <span className="font-medium text-red-600">
                                    {stats.noShow}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
