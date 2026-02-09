'use client';

import Link from 'next/link';
import { Users, Building2, Stethoscope, CreditCard, AlertTriangle, ArrowRight } from 'lucide-react';
import { StatsCard, StatsCardSkeleton } from '@/components/patients';
import { AppointmentChart } from '@/components/admin/appointment-chart';
import { routes } from '@/config';
import { useAdminStats, usePendingVerifications } from '@/features/admin';
import { formatDistanceToNow } from 'date-fns';

export default function AdminDashboardPage() {
    const { data: stats, isLoading: statsLoading } = useAdminStats();
    const { data: pendingData, isLoading: pendingLoading } = usePendingVerifications();

    const hospitals = pendingData?.hospitals || [];
    const doctors = pendingData?.doctors || [];

    const recentIssues = [
        { id: '1', title: 'Payment failed for order #12345', priority: 'high', time: '1 hour ago' },
        { id: '2', title: 'User complaint about doctor behavior', priority: 'medium', time: '3 hours ago' },
        { id: '3', title: 'Video call connection issues reported', priority: 'low', time: '5 hours ago' },
    ];

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statsLoading ? (
                    <>
                        <StatsCardSkeleton />
                        <StatsCardSkeleton />
                        <StatsCardSkeleton />
                        <StatsCardSkeleton />
                    </>
                ) : (
                    <>
                        <StatsCard title="Total Users" value={stats?.totalUsers || 0} icon={Users} variant="primary" />
                        <StatsCard title="Hospitals" value={stats?.totalHospitals || 0} icon={Building2} />
                        <StatsCard title="Doctors" value={stats?.totalDoctors || 0} icon={Stethoscope} />
                        <StatsCard title="Total Appointments" value={stats?.totalAppointments || 0} icon={CreditCard} variant="success" />
                    </>
                )}
            </div>

            <div className="grid gap-6 lg:grid-cols-12">
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Appointment Chart */}
                    <AppointmentChart />

                    {/* Recent Issues */}
                    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b">
                            <div>
                                <h2 className="text-lg font-semibold">Recent Platform Issues</h2>
                                <p className="text-sm text-muted-foreground">Monitor and resolve system alerts</p>
                            </div>
                            <Link
                                href={routes.admin.support}
                                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                                View all support tickets
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        <div className="divide-y">
                            {recentIssues.map((issue) => (
                                <div
                                    key={issue.id}
                                    className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors group"
                                >
                                    <div className={`flex h-11 w-11 items-center justify-center rounded-full shrink-0 ${issue.priority === 'high'
                                        ? 'bg-red-100 dark:bg-red-900/30 text-red-600'
                                        : issue.priority === 'medium'
                                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                                        }`}>
                                        <AlertTriangle className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                                            {issue.title}
                                        </p>
                                        <div className="flex items-center gap-3 mt-1 text-xs">
                                            <span className={`font-semibold capitalize ${issue.priority === 'high'
                                                ? 'text-red-600'
                                                : issue.priority === 'medium'
                                                    ? 'text-yellow-600'
                                                    : 'text-slate-500'
                                                }`}>
                                                {issue.priority} Priority
                                            </span>
                                            <span className="text-muted-foreground">•</span>
                                            <span className="text-muted-foreground">{issue.time}</span>
                                        </div>
                                    </div>
                                    <button className="hidden sm:inline-flex items-center justify-center rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-all active:scale-95">
                                        View Details
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Pending Verifications */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Hospitals */}
                    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                        <div className="p-5 border-b flex items-center justify-between bg-muted/30">
                            <h2 className="font-semibold flex items-center gap-2 text-sm">
                                <Building2 className="h-4 w-4 text-primary" />
                                Pending Hospitals
                            </h2>
                            <Link
                                href={routes.admin.hospitals}
                                className="text-xs text-primary hover:underline font-medium"
                            >
                                View all
                            </Link>
                        </div>
                        <div className="divide-y">
                            {pendingLoading ? (
                                <div className="p-10 text-center text-sm text-muted-foreground">Loading...</div>
                            ) : hospitals.length === 0 ? (
                                <div className="p-10 text-center text-sm text-muted-foreground italic">No pending requests</div>
                            ) : (
                                hospitals.slice(0, 3).map((item: any) => (
                                    <div key={item.id} className="p-4 hover:bg-muted/20 transition-colors">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="font-medium text-sm truncate">{item.name}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                                                </p>
                                            </div>
                                            <Link
                                                href={`${routes.admin.hospitals}/${item.id}`}
                                                className="shrink-0 rounded-md bg-primary/10 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-all"
                                            >
                                                Review
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Doctors */}
                    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                        <div className="p-5 border-b flex items-center justify-between bg-muted/30">
                            <h2 className="font-semibold flex items-center gap-2 text-sm">
                                <Stethoscope className="h-4 w-4 text-primary" />
                                Pending Doctors
                            </h2>
                            <Link
                                href={routes.admin.doctors}
                                className="text-xs text-primary hover:underline font-medium"
                            >
                                View all
                            </Link>
                        </div>
                        <div className="divide-y">
                            {pendingLoading ? (
                                <div className="p-10 text-center text-sm text-muted-foreground">Loading...</div>
                            ) : doctors.length === 0 ? (
                                <div className="p-10 text-center text-sm text-muted-foreground italic">No pending requests</div>
                            ) : (
                                doctors.slice(0, 3).map((item: any) => (
                                    <div key={item.id} className="p-4 hover:bg-muted/20 transition-colors">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="font-medium text-sm truncate">{item.user?.name || `Dr. ${item.id.slice(0, 5)}`}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                                                </p>
                                            </div>
                                            <Link
                                                href={`${routes.admin.doctors}/${item.id}`}
                                                className="shrink-0 rounded-md bg-primary/10 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-all"
                                            >
                                                Review
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
