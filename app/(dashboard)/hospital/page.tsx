'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Users, CreditCard, Stethoscope, TrendingUp, ArrowRight, CheckCircle, UserPlus, IndianRupee, Clock, Activity } from 'lucide-react';
import { StatsCard } from '@/components/patients';
import { routes } from '@/config';
import { useHospitalDashboard } from '@/features/hospitals/hooks/use-hospital-dashboard';
import { useAuthStore } from '@/store/slices/auth.slice';
import { LoadingSpinner } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

// Sample revenue data (in a real app, this would come from API)
const weeklyRevenueData = [
    { name: 'Mon', revenue: 12000 },
    { name: 'Tue', revenue: 18500 },
    { name: 'Wed', revenue: 15000 },
    { name: 'Thu', revenue: 22000 },
    { name: 'Fri', revenue: 28000 },
    { name: 'Sat', revenue: 8000 },
    { name: 'Sun', revenue: 5000 },
];

const monthlyRevenueData = [
    { name: 'Jan', revenue: 85000 },
    { name: 'Feb', revenue: 92000 },
    { name: 'Mar', revenue: 78000 },
    { name: 'Apr', revenue: 110000 },
    { name: 'May', revenue: 125000 },
    { name: 'Jun', revenue: 98000 },
    { name: 'Jul', revenue: 115000 },
];

export default function HospitalDashboardPage() {
    const { user } = useAuthStore();
    const { data: dashboardData, isLoading } = useHospitalDashboard();
    const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // api.get already returns response.data, so dashboardData IS the data object
    const stats = dashboardData?.stats || {
        todayAppointments: 0,
        totalDoctors: 0,
        activeDoctors: 0,
        monthlyRevenue: 0,
        totalPatients: 0,
        totalAppointments: 0,
        completedAppointments: 0,
        cancelledAppointments: 0,
        pendingAppointments: 0,
        activeAppointments: 0,
        totalRevenue: 0,
        pendingSettlement: 0,
    };
    const recentAppointments = dashboardData?.recentAppointments || [];

    const revenueData = timeframe === 'week' ? weeklyRevenueData : monthlyRevenueData;

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (user?.role === 'hospital' && !user?.hospital) {
        return (
            <div className="p-6">
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
                    <h2 className="text-lg font-semibold">Profile Error</h2>
                    <p>Could not load hospital profile. Please try signing out and signing in again.</p>
                </div>
            </div>
        );
    }

    // Format currency
    const formatCurrency = (amount: number) => {
        if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(1)}L`;
        } else if (amount >= 1000) {
            return `₹${(amount / 1000).toFixed(1)}K`;
        }
        return `₹${amount}`;
    };

    // Format date/time
    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-700';
            case 'pending_payment': return 'bg-yellow-100 text-yellow-700';
            case 'checked_in': return 'bg-blue-100 text-blue-700';
            case 'in_progress': return 'bg-purple-100 text-purple-700';
            case 'completed': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    // Calculate appointment distribution
    const totalAppts = stats.totalAppointments || 1;
    const completedPercent = Math.round(((stats.completedAppointments || 0) / totalAppts) * 100);
    const pendingPercent = Math.round(((stats.pendingAppointments || 0) / totalAppts) * 100);
    const cancelledPercent = Math.round(((stats.cancelledAppointments || 0) / totalAppts) * 100);
    const activePercent = Math.round(((stats.activeAppointments || 0) / totalAppts) * 100);

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Today's Appointments"
                    value={stats.todayAppointments}
                    icon={Calendar}
                    variant="primary"
                />
                <StatsCard
                    title="Active Doctors"
                    value={stats.activeDoctors || stats.totalDoctors || 0}
                    icon={Stethoscope}
                />
                <StatsCard
                    title="Monthly Revenue"
                    value={formatCurrency(stats.monthlyRevenue || 0)}
                    icon={CreditCard}
                    variant="success"
                />
                <StatsCard
                    title="Total Patients"
                    value={stats.totalPatients || 0}
                    icon={Users}
                />
            </div>

            {/* Main Content: Revenue Chart (Left) + Activity Cards (Right) */}
            <div className="grid gap-6 lg:grid-cols-12">
                {/* Left Section - Revenue Overview with Chart */}
                <div className="lg:col-span-8 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <IndianRupee className="h-5 w-5 text-green-600" />
                                    Revenue Overview
                                </CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">Track your hospital's revenue trends</p>
                            </div>
                            <div className="flex items-center gap-1 rounded-lg border p-1 bg-muted/50">
                                <button
                                    onClick={() => setTimeframe('week')}
                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${timeframe === 'week' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    Week
                                </button>
                                <button
                                    onClick={() => setTimeframe('month')}
                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${timeframe === 'month' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    Month
                                </button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Revenue Stats */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="p-3 rounded-lg bg-green-50 border border-green-100">
                                    <p className="text-xs text-muted-foreground">Total Revenue</p>
                                    <p className="text-xl font-bold text-green-700">{formatCurrency(stats.totalRevenue || 0)}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                                    <p className="text-xs text-muted-foreground">This Month</p>
                                    <p className="text-xl font-bold text-blue-700">{formatCurrency(stats.monthlyRevenue || 0)}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-100">
                                    <p className="text-xs text-muted-foreground">Pending</p>
                                    <p className="text-xl font-bold text-yellow-700">{formatCurrency(stats.pendingSettlement || 0)}</p>
                                </div>
                            </div>

                            {/* Revenue Chart */}
                            {isMounted ? (
                                <div className="h-[280px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={revenueData}>
                                            <defs>
                                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                                                dy={10}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                                                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'var(--card)',
                                                    border: '1px solid var(--border)',
                                                    borderRadius: '8px',
                                                    fontSize: '12px',
                                                }}
                                                formatter={(value) => [`₹${(value as number)?.toLocaleString() ?? 0}`, 'Revenue']}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="revenue"
                                                stroke="#22c55e"
                                                strokeWidth={2}
                                                fillOpacity={1}
                                                fill="url(#colorRevenue)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="h-[280px] w-full flex items-center justify-center bg-muted/10 animate-pulse rounded-lg">
                                    <p className="text-sm text-muted-foreground">Loading chart...</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    {/* Recent Appointments */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg">Recent Appointments</CardTitle>
                            <Link
                                href={routes.hospital.appointments}
                                className="text-sm text-primary hover:underline flex items-center gap-1"
                            >
                                View all
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {recentAppointments.length === 0 ? (
                                <div className="py-8 text-center text-muted-foreground">
                                    No appointments found
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {recentAppointments.slice(0, 5).map((apt: any) => (
                                        <div key={apt.id} className="flex items-center gap-4 py-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                                                {apt.patient?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'P'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{apt.patient?.name || 'Unknown Patient'}</p>
                                                <p className="text-sm text-muted-foreground truncate">
                                                    Dr. {apt.doctor?.users?.name || 'Unknown'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium">{formatDate(apt.scheduled_date)}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatTime(apt.scheduled_start)}
                                                </p>
                                            </div>
                                            <Badge variant="secondary" className={getStatusColor(apt.status)}>
                                                {apt.status?.replace(/_/g, ' ')}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Section - Activity Cards */}
                <div className="lg:col-span-4 space-y-4">
                    {/* Appointments Status Card */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Activity className="h-4 w-4 text-blue-600" />
                                Appointments Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-2xl font-bold">{stats.totalAppointments || 0}</p>
                                    <p className="text-xs text-muted-foreground">Total Appointments</p>
                                </div>
                                {/* Progress Bar */}
                                <div className="h-2.5 w-full rounded-full bg-gray-200 overflow-hidden flex">
                                    {completedPercent > 0 && (
                                        <div className="h-full bg-green-500" style={{ width: `${completedPercent}%` }} />
                                    )}
                                    {activePercent > 0 && (
                                        <div className="h-full bg-purple-500" style={{ width: `${activePercent}%` }} />
                                    )}
                                    {pendingPercent > 0 && (
                                        <div className="h-full bg-yellow-500" style={{ width: `${pendingPercent}%` }} />
                                    )}
                                    {cancelledPercent > 0 && (
                                        <div className="h-full bg-red-500" style={{ width: `${cancelledPercent}%` }} />
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                                        <span className="text-xs">Done: {stats.completedAppointments || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                                        <span className="text-xs">Active: {stats.activeAppointments || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                                        <span className="text-xs">Pending: {stats.pendingAppointments || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                                        <span className="text-xs">Cancelled: {stats.cancelledAppointments || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Today's Activity Card */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Clock className="h-4 w-4 text-purple-600" />
                                Today's Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50">
                                    <span className="text-sm">Today's Appointments</span>
                                    <span className="font-bold text-purple-700">{stats.todayAppointments || 0}</span>
                                </div>
                                <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50">
                                    <span className="text-sm">Active Doctors</span>
                                    <span className="font-bold text-blue-700">{stats.activeDoctors || 0}</span>
                                </div>
                                <div className="flex items-center justify-between p-2 rounded-lg bg-green-50">
                                    <span className="text-sm">Total Patients</span>
                                    <span className="font-bold text-green-700">{stats.totalPatients || 0}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions (Compact) */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-2">
                            <Link href={routes.hospital.reception} className="flex flex-col items-center gap-1 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <span className="text-xs font-medium">Reception</span>
                            </Link>
                            <Link href={routes.hospital.staff} className="flex flex-col items-center gap-1 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                <UserPlus className="h-5 w-5 text-purple-600" />
                                <span className="text-xs font-medium">Staff</span>
                            </Link>
                            <Link href={routes.hospital.doctors} className="flex flex-col items-center gap-1 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                <Stethoscope className="h-5 w-5 text-primary" />
                                <span className="text-xs font-medium">Doctors</span>
                            </Link>
                            <Link href={routes.hospital.analytics} className="flex flex-col items-center gap-1 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                <TrendingUp className="h-5 w-5 text-blue-600" />
                                <span className="text-xs font-medium">Analytics</span>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
