import { Metadata } from 'next';
import { Stethoscope, Pill, Box, ShoppingCart, TrendingUp } from 'lucide-react';
import { StatsCard } from '@/components/patients';

export const metadata: Metadata = {
    title: 'Pharmacy Management',
    description: 'Manage centralized pharmacy.',
};

export default function AdminPharmacyPage() {
    const stats = {
        totalProducts: 2500,
        lowStock: 45,
        pendingOrders: 28,
        monthlyRevenue: 450000,
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Pharmacy</h1>
                <p className="text-muted-foreground">Manage centralized pharmacy inventory and orders</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <StatsCard title="Total Products" value={stats.totalProducts} icon={Pill} />
                <StatsCard title="Low Stock Items" value={stats.lowStock} icon={Box} variant="warning" />
                <StatsCard title="Pending Orders" value={stats.pendingOrders} icon={ShoppingCart} variant="primary" />
                <StatsCard title="Monthly Revenue" value={`₹${(stats.monthlyRevenue / 1000).toFixed(0)}K`} icon={TrendingUp} variant="success" />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <a href="/admin/pharmacy/inventory" className="rounded-xl border p-6 hover:bg-muted/50 transition-colors">
                    <Box className="h-8 w-8 text-primary mb-4" />
                    <h2 className="font-semibold">Inventory Management</h2>
                    <p className="text-sm text-muted-foreground mt-2">
                        Manage stock levels, add products, and track inventory
                    </p>
                </a>
                <a href="/admin/pharmacy/orders" className="rounded-xl border p-6 hover:bg-muted/50 transition-colors">
                    <ShoppingCart className="h-8 w-8 text-primary mb-4" />
                    <h2 className="font-semibold">Order Management</h2>
                    <p className="text-sm text-muted-foreground mt-2">
                        View and process prescription orders
                    </p>
                </a>
            </div>
        </div>
    );
}
