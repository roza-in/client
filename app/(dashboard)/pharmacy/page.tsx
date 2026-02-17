'use client';

import Link from 'next/link';
import {
    Pill,
    Package,
    ShoppingCart,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertTriangle,
    ArrowRight,
    Search,
} from 'lucide-react';
import { StatsCard } from '@/components/patients';
import { LoadingSpinner } from '@/components/shared';
import { pharmacyRoutes } from '@/config/routes';
import { useOrderStats, useOrders } from '@/features/pharmacy';

export default function PharmacyDashboardPage() {
    const { data: stats, isLoading: statsLoading } = useOrderStats();
    const { data: recentOrdersData, isLoading: ordersLoading } = useOrders({
        limit: 5,
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });

    const recentOrders = recentOrdersData?.orders ?? [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Pharmacy Dashboard</h1>
                <p className="text-muted-foreground">Manage prescriptions and inventory</p>
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
                        title="Pending Orders"
                        value={stats?.pendingOrders ?? 0}
                        icon={Clock}
                        variant="primary"
                    />
                    <StatsCard
                        title="Processing"
                        value={stats?.processingOrders ?? 0}
                        icon={Package}
                        variant="warning"
                    />
                    <StatsCard
                        title="Delivered"
                        value={stats?.deliveredOrders ?? 0}
                        icon={CheckCircle}
                        variant="success"
                    />
                    <StatsCard
                        title="Total Revenue"
                        value={`₹${(stats?.totalRevenue ?? 0).toLocaleString()}`}
                        icon={TrendingUp}
                    />
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Recent Orders */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Recent Orders</h2>
                        <Link
                            href={pharmacyRoutes.orders}
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                            View all
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    {ordersLoading ? (
                        <div className="flex justify-center py-8">
                            <LoadingSpinner />
                        </div>
                    ) : recentOrders.length === 0 ? (
                        <div className="rounded-xl border p-8 text-center text-muted-foreground">
                            No pending orders at the moment.
                        </div>
                    ) : (
                        <div className="rounded-xl border divide-y">
                            {recentOrders.map((order) => (
                                <Link
                                    key={order.id}
                                    href={pharmacyRoutes.order(order.id)}
                                    className="flex items-center gap-4 p-4 hover:bg-muted/50"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                                        <Pill className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{order.patientName}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {order.orderNumber ?? order.id.slice(0, 8)} · {order.itemCount} items
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">₹{order.totalAmount.toLocaleString()}</p>
                                        <span
                                            className={`inline-block rounded-full px-2 py-0.5 text-xs mt-1 ${
                                                order.status === 'delivered'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : order.status === 'cancelled'
                                                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            }`}
                                        >
                                            {order.status.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <Link
                                href={pharmacyRoutes.orders}
                                className="flex items-center gap-3 rounded-xl border p-4 hover:bg-muted/50"
                            >
                                <ShoppingCart className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="font-medium">View Orders</p>
                                    <p className="text-sm text-muted-foreground">Process pending prescriptions</p>
                                </div>
                            </Link>
                            <Link
                                href={pharmacyRoutes.inventory}
                                className="flex items-center gap-3 rounded-xl border p-4 hover:bg-muted/50"
                            >
                                <Package className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="font-medium">Inventory</p>
                                    <p className="text-sm text-muted-foreground">Manage stock levels</p>
                                </div>
                            </Link>
                            <Link
                                href={pharmacyRoutes.search || pharmacyRoutes.inventory}
                                className="flex items-center gap-3 rounded-xl border p-4 hover:bg-muted/50"
                            >
                                <Search className="h-5 w-5 text-green-600" />
                                <div>
                                    <p className="font-medium">Search Medicine</p>
                                    <p className="text-sm text-muted-foreground">Find medicines in stock</p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Stats Summary */}
                    <div className="rounded-xl border p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            <h3 className="font-semibold">Order Summary</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Orders</span>
                                <span className="font-medium">{stats?.totalOrders ?? 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Cancelled</span>
                                <span className="font-medium text-red-600">{stats?.cancelledOrders ?? 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Avg. Order Value</span>
                                <span className="font-medium">₹{(stats?.averageOrderValue ?? 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
