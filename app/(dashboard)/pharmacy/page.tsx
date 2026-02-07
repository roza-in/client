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
    FileText
} from 'lucide-react';
import { StatsCard } from '@/components/patients';
import { routes } from '@/config';

export default function PharmacyDashboardPage() {
    // Placeholder stats - will be replaced with actual API data
    const stats = {
        pendingOrders: 12,
        completedToday: 45,
        lowStock: 8,
        totalRevenue: 24500,
    };

    const recentOrders = [
        { id: '1', patientName: 'Ravi Kumar', medicine: 'Paracetamol 500mg', qty: 2, status: 'pending', time: '10:30 AM' },
        { id: '2', patientName: 'Priya Sharma', medicine: 'Amoxicillin 250mg', qty: 1, status: 'ready', time: '10:15 AM' },
        { id: '3', patientName: 'Amit Patel', medicine: 'Metformin 500mg', qty: 3, status: 'dispensed', time: '09:45 AM' },
        { id: '4', patientName: 'Sneha Roy', medicine: 'Omeprazole 20mg', qty: 1, status: 'pending', time: '09:30 AM' },
    ];

    const lowStockItems = [
        { name: 'Paracetamol 500mg', currentStock: 50, minStock: 100 },
        { name: 'Amoxicillin 500mg', currentStock: 20, minStock: 50 },
        { name: 'Azithromycin 250mg', currentStock: 15, minStock: 30 },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Pharmacy Dashboard</h1>
                <p className="text-muted-foreground">Manage prescriptions and inventory</p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Pending Orders"
                    value={stats.pendingOrders}
                    icon={Clock}
                    variant="primary"
                />
                <StatsCard
                    title="Completed Today"
                    value={stats.completedToday}
                    icon={CheckCircle}
                    variant="success"
                />
                <StatsCard
                    title="Low Stock Items"
                    value={stats.lowStock}
                    icon={AlertTriangle}
                    variant="warning"
                />
                <StatsCard
                    title="Today's Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    icon={TrendingUp}
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Recent Orders */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Recent Prescription Orders</h2>
                        <Link
                            href={routes.pharmacy?.orders || '/pharmacy/orders'}
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                            View all
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    {recentOrders.length === 0 ? (
                        <div className="rounded-xl border p-8 text-center text-muted-foreground">
                            No pending orders at the moment.
                        </div>
                    ) : (
                        <div className="rounded-xl border divide-y">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center gap-4 p-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                                        <Pill className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{order.patientName}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {order.medicine} × {order.qty}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm">{order.time}</p>
                                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs mt-1 ${order.status === 'dispensed'
                                                ? 'bg-green-100 text-green-700'
                                                : order.status === 'ready'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <button className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted">
                                        {order.status === 'pending' ? 'Process' : 'View'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions & Alerts */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <Link
                                href={routes.pharmacy?.orders || '/pharmacy/orders'}
                                className="flex items-center gap-3 rounded-xl border p-4 hover:bg-muted/50"
                            >
                                <ShoppingCart className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="font-medium">View Orders</p>
                                    <p className="text-sm text-muted-foreground">Process pending prescriptions</p>
                                </div>
                            </Link>
                            <Link
                                href={routes.pharmacy?.inventory || '/pharmacy/inventory'}
                                className="flex items-center gap-3 rounded-xl border p-4 hover:bg-muted/50"
                            >
                                <Package className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="font-medium">Inventory</p>
                                    <p className="text-sm text-muted-foreground">Manage stock levels</p>
                                </div>
                            </Link>
                            <Link
                                href={routes.pharmacy?.search || '/pharmacy/search'}
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

                    {/* Low Stock Alert */}
                    <div className="rounded-xl border p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            <h3 className="font-semibold">Low Stock Alert</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                            {lowStockItems.map((item) => (
                                <div key={item.name} className="flex justify-between">
                                    <span className="text-muted-foreground">{item.name}</span>
                                    <span className="font-medium text-yellow-600">
                                        {item.currentStock} left
                                    </span>
                                </div>
                            ))}
                        </div>
                        <Link
                            href={routes.pharmacy?.inventory || '/pharmacy/inventory'}
                            className="block text-center text-sm text-primary hover:underline mt-3"
                        >
                            View all low stock items
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
