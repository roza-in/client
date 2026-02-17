'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, Search } from 'lucide-react';
import { LoadingSpinner, EmptyState, Pagination } from '@/components/shared';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { pharmacyRoutes } from '@/config/routes';
import { useOrders } from '@/features/pharmacy';
import type { MedicineOrderFilters } from '@/types';

const ORDER_STATUSES = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'packed', label: 'Packed' },
    { value: 'dispatched', label: 'Dispatched' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
];

export default function PharmacyOrdersPage() {
    const [filters, setFilters] = useState<MedicineOrderFilters>({
        page: 1,
        limit: 20,
    });
    const [searchTerm, setSearchTerm] = useState('');

    const { data, isLoading } = useOrders({
        ...filters,
        search: searchTerm || undefined,
    });

    const orders = data?.orders ?? [];
    const pagination = data?.pagination;

    const handleStatusChange = (value: string) => {
        setFilters((prev) => ({
            ...prev,
            status: value === 'all' ? undefined : (value as MedicineOrderFilters['status']),
            page: 1,
        }));
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Medicine Orders</h1>
                <p className="text-muted-foreground">Manage and track medicine orders</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by order number or patient..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select
                    value={(filters.status as string) ?? 'all'}
                    onValueChange={handleStatusChange}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        {ORDER_STATUSES.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                                {s.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Orders List */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner />
                </div>
            ) : orders.length === 0 ? (
                <EmptyState
                    title="No orders found"
                    description="No medicine orders match your filters."
                    icon={Package}
                />
            ) : (
                <>
                    <div className="rounded-xl border divide-y">
                        {orders.map((order) => (
                            <Link
                                key={order.id}
                                href={pharmacyRoutes.order(order.id)}
                                className="flex items-center gap-4 p-4 hover:bg-muted/50"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Package className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">
                                        {order.orderNumber ?? `#${order.id.slice(0, 8)}`}
                                    </p>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {order.patientName}
                                        {order.hospitalName && ` · ${order.hospitalName}`}
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="font-medium">₹{order.totalAmount.toLocaleString()}</p>
                                    <span
                                        className={`inline-block rounded-full px-2 py-0.5 text-xs mt-1 ${
                                            order.status === 'delivered'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : order.status === 'cancelled'
                                                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                  : order.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                        }`}
                                    >
                                        {order.status.replace(/_/g, ' ')}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {pagination && pagination.totalPages > 1 && (
                        <Pagination
                            currentPage={filters.page ?? 1}
                            totalPages={pagination.totalPages}
                            onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
                        />
                    )}
                </>
            )}
        </div>
    );
}
