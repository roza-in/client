'use client';

import Link from 'next/link';
import { ArrowLeft, Package, Clock, CheckCircle } from 'lucide-react';
import { Pagination } from '@/components/shared';

export default function AdminPharmacyOrdersPage() {
    const orders = [
        { id: 'ORD001', patient: 'John Doe', items: 3, amount: 450, status: 'pending', date: '2026-01-16' },
        { id: 'ORD002', patient: 'Sarah Smith', items: 2, amount: 280, status: 'processing', date: '2026-01-16' },
        { id: 'ORD003', patient: 'Mike Johnson', items: 5, amount: 720, status: 'shipped', date: '2026-01-15' },
        { id: 'ORD004', patient: 'Emily Brown', items: 1, amount: 150, status: 'delivered', date: '2026-01-14' },
    ];

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-700',
        processing: 'bg-blue-100 text-blue-700',
        shipped: 'bg-purple-100 text-purple-700',
        delivered: 'bg-green-100 text-green-700',
    };

    return (
        <div className="p-6">
            <Link
                href="/admin/pharmacy"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to pharmacy
            </Link>

            <h1 className="text-2xl font-bold mb-6">Orders</h1>

            <div className="flex gap-2 mb-6">
                {['All', 'Pending', 'Processing', 'Shipped', 'Delivered'].map((tab) => (
                    <button
                        key={tab}
                        className={`rounded-full px-4 py-1.5 text-sm ${tab === 'All' ? 'bg-primary text-primary-foreground' : 'border hover:bg-muted'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="rounded-xl border divide-y">
                {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                <Package className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-medium">{order.id}</p>
                                <p className="text-sm text-muted-foreground">{order.patient} • {order.items} items</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-medium">₹{order.amount}</p>
                            <p className="text-xs text-muted-foreground">{order.date}</p>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-xs ${statusColors[order.status]}`}>
                            {order.status}
                        </span>
                        <button className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted">
                            View
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-6">
                <Pagination currentPage={1} totalPages={1} />
            </div>
        </div>
    );
}
