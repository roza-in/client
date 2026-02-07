'use client';

import { usePlatformAnalytics, useRevenueTrends } from '@/features/admin/hooks/use-admin';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Download, Loader2, AlertCircle } from 'lucide-react';
import { StatsCard } from '@/components/patients';

export default function AdminRevenueReportPage() {
    const {
        data: analytics,
        isLoading: isAnalyticsLoading,
        error: analyticsError
    } = usePlatformAnalytics();

    const {
        data: revenueTrends,
        isLoading: isTrendsLoading
    } = useRevenueTrends('month');

    const isLoading = isAnalyticsLoading || isTrendsLoading;
    const error = analyticsError;

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !analytics) {
        return (
            <div className="p-12 text-center text-destructive">
                <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium">Error loading analytics</h3>
                <p className="text-muted-foreground mb-6">Failed to fetch platform revenue data.</p>
                <Link href="/admin/reports" className="inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary/80">
                    Back to Reports
                </Link>
            </div>
        );
    }

    const totalRevenue = analytics.revenue?.total || 0;
    const platformFees = totalRevenue * 0.1;
    const gstRate = 0.18;
    const totalGst = totalRevenue * gstRate;

    return (
        <div className="p-6">
            <Link href="/admin/reports" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                <ArrowLeft className="h-4 w-4" />Back to reports
            </Link>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Revenue Report</h1>
                    <p className="text-muted-foreground">Detailed overview of platform financial performance</p>
                </div>
                <button className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
                    <Download className="h-4 w-4" />Export CSV
                </button>
            </div>

            <div className="grid gap-4 md:grid-cols-4 mb-8">
                <StatsCard
                    title="Total Revenue"
                    value={`₹${(totalRevenue / 100).toLocaleString()}`}
                    icon={TrendingUp}
                />
                <StatsCard
                    title="Appointments"
                    value={analytics.appointments?.total.toString() || "0"}
                    icon={TrendingUp}
                    variant="primary"
                />
                <StatsCard
                    title="Est. Commission"
                    value={`₹${(platformFees / 100).toLocaleString()}`}
                    icon={TrendingUp}
                    variant="success"
                />
                <StatsCard
                    title="Total GST"
                    value={`₹${(totalGst / 100).toLocaleString()}`}
                    icon={TrendingUp}
                    variant="default"
                />
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-semibold text-lg">Revenue Trend</h2>
                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-primary"></span>
                        <span className="text-xs text-muted-foreground">Monthly Revenue</span>
                    </div>
                </div>
                <div className="h-64 flex flex-col items-center justify-center bg-muted/20 rounded-lg border border-dashed">
                    {revenueTrends && revenueTrends.length > 0 ? (
                        <div className="w-full h-full flex items-end gap-1 px-4 py-2">
                            {revenueTrends.map((s, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-primary/40 hover:bg-primary transition-colors rounded-t-sm cursor-help relative group"
                                    style={{ height: `${Math.max(10, (Number(s.amount || 0) / Math.max(...revenueTrends.map(x => Number(x.amount || 0)), 1)) * 100)}%` }}
                                >
                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground px-2 py-1 rounded text-[10px] invisible group-hover:visible whitespace-nowrap z-10 shadow-md border">
                                        {s.date}: ₹{(Number(s.amount || 0) / 100).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            <TrendingUp className="h-10 w-10 text-muted-foreground/30 mb-2" />
                            <p className="text-muted-foreground text-sm font-medium">No trend data available for this period</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
