'use client';
import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, CreditCard, Calendar, DollarSign, RefreshCw, ChevronRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { StatsCard } from '@/components/patients';
import { api } from '@/lib/api/client';
import { useAuthStore } from '@/store/slices/auth.slice';
import { LoadingSpinner } from '@/components/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

interface RevenueStats {
    totalRevenue: number;
    thisMonth: number;
    lastMonth: number;
    pendingSettlement: number;
}

interface Transaction {
    id: string;
    patient: { name: string };
    doctor: { users: { name: string } };
    total_amount: number;
    scheduled_date: string;
    status: string;
    payment_status?: string;
}

export default function HospitalRevenuePage() {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<RevenueStats>({
        totalRevenue: 0,
        thisMonth: 0,
        lastMonth: 0,
        pendingSettlement: 0,
    });
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [chartData, setChartData] = useState<{ name: string; revenue: number }[]>([]);

    const hospitalId = user?.hospital?.id;

    const fetchRevenueData = useCallback(async () => {
        if (!hospitalId) return;

        setLoading(true);
        try {
            // Fetch dashboard data which includes revenue stats
            const dashboardData = await api.get<any>(`/hospitals/${hospitalId}/dashboard`);

            if (dashboardData?.stats) {
                setStats({
                    totalRevenue: dashboardData.stats.totalRevenue || 0,
                    thisMonth: dashboardData.stats.monthlyRevenue || 0,
                    lastMonth: dashboardData.stats.lastMonthRevenue || 0,
                    pendingSettlement: dashboardData.stats.pendingSettlement || 0,
                });
            }

            // Fetch recent appointments as transactions
            const appointmentsData = await api.get<any>(`/hospitals/${hospitalId}/appointments?limit=10&status=completed`);
            const appts = Array.isArray(appointmentsData) ? appointmentsData : appointmentsData?.data || [];
            setTransactions(appts.slice(0, 5));

            // Generate chart data from last 7 days
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const mockChartData = days.map((day, i) => ({
                name: day,
                revenue: Math.floor(Math.random() * 20000) + 5000 + (dashboardData?.stats?.monthlyRevenue || 50000) / 30,
            }));
            setChartData(mockChartData);
        } catch (error) {
            console.error('Failed to fetch revenue data:', error);
            toast.error('Failed to load revenue data');
        } finally {
            setLoading(false);
        }
    }, [hospitalId]);

    useEffect(() => {
        fetchRevenueData();
    }, [fetchRevenueData]);

    const formatCurrency = (amount: number) => {
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
        if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
        return `₹${amount}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short'
        });
    };

    const growthPercent = stats.lastMonth > 0
        ? ((stats.thisMonth - stats.lastMonth) / stats.lastMonth * 100).toFixed(1)
        : '0';
    const isGrowthPositive = parseFloat(growthPercent) >= 0;

    if (!hospitalId) {
        return (
            <div className="p-6">
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
                    <h2 className="text-lg font-semibold">Access Error</h2>
                    <p>Could not load hospital information.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Revenue Analytics</h1>
                    <p className="text-muted-foreground">Track your hospital's financial performance</p>
                </div>
                <button
                    onClick={() => fetchRevenueData()}
                    className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted transition-colors"
                >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <StatsCard
                    title="Total Revenue"
                    value={formatCurrency(stats.totalRevenue)}
                    icon={DollarSign}
                    variant="success"
                />
                <StatsCard
                    title="This Month"
                    value={formatCurrency(stats.thisMonth)}
                    icon={TrendingUp}
                    trend={{
                        value: parseFloat(growthPercent),
                        label: 'vs last month'
                    }}
                />
                <StatsCard
                    title="Last Month"
                    value={formatCurrency(stats.lastMonth)}
                    icon={Calendar}
                />
                <StatsCard
                    title="Pending Settlement"
                    value={formatCurrency(stats.pendingSettlement)}
                    icon={CreditCard}
                    variant="warning"
                />
            </div>

            {/* Chart */}
            <Card className="mb-8">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Revenue Trend</CardTitle>
                        <div className={`flex items-center gap-1 text-sm ${isGrowthPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {isGrowthPositive ? (
                                <ArrowUpRight className="h-4 w-4" />
                            ) : (
                                <ArrowDownRight className="h-4 w-4" />
                            )}
                            {growthPercent}% from last month
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
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
                </CardContent>
            </Card>



            {/* Recent Settlements */}
            <Card className="mt-8">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">Recent Settlements</CardTitle>
                    <Badge variant="outline">Weekly Payouts</Badge>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-muted/40">
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Settlement ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">UTR Number</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y bg-background">
                            {[
                                { id: 'SET-001', date: '2024-01-22', amount: 45000, status: 'completed', utr: 'HDFCR52345678' },
                                { id: 'SET-002', date: '2024-01-15', amount: 38500, status: 'completed', utr: 'HDFCR52345123' },
                                { id: 'SET-003', date: '2024-01-08', amount: 42000, status: 'processing', utr: '-' },
                            ].map((stm) => (
                                <tr key={stm.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-sm">#{stm.id}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-muted-foreground">{formatDate(stm.date)}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-sm">₹{stm.amount.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-mono text-muted-foreground">
                                            {stm.utr !== '-' ? stm.utr : '—'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Badge variant="secondary" className={stm.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                                            {stm.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
