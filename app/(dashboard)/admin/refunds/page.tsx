'use client';

import { Pagination } from '@/components/shared';
import { RotateCcw, CheckCircle, XCircle } from 'lucide-react';

export default function AdminRefundsPage() {
    const refunds = [
        { id: '1', patient: 'John Doe', amount: 549, reason: 'Doctor unavailable', status: 'pending', date: '2026-01-16' },
        { id: '2', patient: 'Sarah Smith', amount: 749, reason: 'Technical issues', status: 'approved', date: '2026-01-15' },
        { id: '3', patient: 'Mike Johnson', amount: 449, reason: 'Changed mind', status: 'rejected', date: '2026-01-14' },
    ];

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-700',
        approved: 'bg-green-100 text-green-700',
        rejected: 'bg-red-100 text-red-700',
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Refunds</h1>
                <p className="text-muted-foreground">Manage refund requests</p>
            </div>

            <div className="rounded-xl border divide-y">
                {refunds.map((refund) => (
                    <div key={refund.id} className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                <RotateCcw className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-medium">{refund.patient}</p>
                                <p className="text-sm text-muted-foreground">{refund.reason}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-medium">₹{refund.amount}</p>
                            <p className="text-xs text-muted-foreground">{refund.date}</p>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-xs ${statusColors[refund.status]}`}>
                            {refund.status}
                        </span>
                        {refund.status === 'pending' && (
                            <div className="flex gap-2">
                                <button className="p-2 rounded-lg bg-green-600 text-white hover:bg-green-700">
                                    <CheckCircle className="h-4 w-4" />
                                </button>
                                <button className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700">
                                    <XCircle className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-6">
                <Pagination currentPage={1} totalPages={1} />
            </div>
        </div>
    );
}
