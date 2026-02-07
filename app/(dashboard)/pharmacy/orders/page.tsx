'use client';

import { ShoppingCart, Clock, CheckCircle, Package } from 'lucide-react';
import { StatsCard } from '@/components/patients';

export default function PharmacyOrdersPage() {
    // Placeholder data - will be replaced with actual API
    const orders = [
        {
            id: '1',
            patientName: 'Ravi Kumar',
            patientPhone: '+91 98765 43210',
            doctorName: 'Dr. Sharma',
            prescriptionId: 'RX-001234',
            items: [
                { name: 'Paracetamol 500mg', qty: 2, price: 25 },
                { name: 'Vitamin D3', qty: 1, price: 150 },
            ],
            status: 'pending',
            createdAt: '2024-01-15T10:30:00',
        },
        {
            id: '2',
            patientName: 'Priya Sharma',
            patientPhone: '+91 98765 43211',
            doctorName: 'Dr. Patel',
            prescriptionId: 'RX-001235',
            items: [
                { name: 'Amoxicillin 250mg', qty: 1, price: 85 },
            ],
            status: 'ready',
            createdAt: '2024-01-15T10:15:00',
        },
    ];

    const stats = {
        pending: 12,
        ready: 5,
        dispensed: 45,
        total: 62,
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Prescription Orders</h1>
                <p className="text-muted-foreground">Process and dispense prescriptions</p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <StatsCard title="Pending" value={stats.pending} icon={Clock} variant="warning" />
                <StatsCard title="Ready for Pickup" value={stats.ready} icon={Package} variant="primary" />
                <StatsCard title="Dispensed Today" value={stats.dispensed} icon={CheckCircle} variant="success" />
                <StatsCard title="Total Orders" value={stats.total} icon={ShoppingCart} />
            </div>

            {/* Orders Table */}
            <div className="rounded-xl border">
                <div className="p-4 border-b">
                    <h2 className="font-semibold">Active Orders</h2>
                </div>
                <div className="divide-y">
                    {orders.map((order) => (
                        <div key={order.id} className="p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="font-medium">{order.patientName}</p>
                                    <p className="text-sm text-muted-foreground">{order.patientPhone}</p>
                                    <p className="text-sm text-muted-foreground">Rx: {order.prescriptionId}</p>
                                </div>
                                <span className={`inline-block rounded-full px-2 py-0.5 text-xs ${order.status === 'dispensed'
                                        ? 'bg-green-100 text-green-700'
                                        : order.status === 'ready'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="bg-muted/50 rounded-lg p-3 mb-3">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                        <span>{item.name} × {item.qty}</span>
                                        <span>₹{item.price * item.qty}</span>
                                    </div>
                                ))}
                                <div className="border-t mt-2 pt-2 flex justify-between font-medium">
                                    <span>Total</span>
                                    <span>₹{order.items.reduce((sum, item) => sum + item.price * item.qty, 0)}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {order.status === 'pending' && (
                                    <button className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm hover:bg-primary/90">
                                        Mark Ready
                                    </button>
                                )}
                                {order.status === 'ready' && (
                                    <button className="rounded-md bg-green-600 text-white px-4 py-2 text-sm hover:bg-green-700">
                                        Dispense
                                    </button>
                                )}
                                <button className="rounded-md border px-4 py-2 text-sm hover:bg-muted">
                                    View Prescription
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
