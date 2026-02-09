import { Metadata } from 'next';
import Link from 'next/link';
import { PrescriptionViewer } from '@/components/prescriptions';
import { EmptyState, Pagination } from '@/components/shared';
import { ClipboardList, Download, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { routes } from '@/config';

export const metadata: Metadata = {
    title: 'My Prescriptions',
    description: 'View your medical prescriptions.',
};

export default function PrescriptionsPage() {
    // Mock prescriptions - in real implementation, fetch from API
    const prescriptions = [
        {
            id: '1',
            doctorName: 'Rajesh Kumar',
            specialization: 'General Physician',
            hospitalName: 'Apollo Hospitals',
            diagnosis: 'Viral Fever with Upper Respiratory Infection',
            createdAt: '2026-01-15T10:00:00',
            medicationCount: 3,
        },
        {
            id: '2',
            doctorName: 'Priya Sharma',
            specialization: 'Dermatologist',
            hospitalName: 'Fortis Hospital',
            diagnosis: 'Allergic Dermatitis',
            createdAt: '2026-01-10T14:00:00',
            medicationCount: 2,
        },
    ];

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold">My Prescriptions</h1>
                <p className="text-muted-foreground">View and download your medical prescriptions</p>
            </div>

            {/* Prescriptions List */}
            {prescriptions.length > 0 ? (
                <div className="space-y-4">
                    {prescriptions.map((rx) => (
                        <div key={rx.id} className="rounded-xl border p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                        <ClipboardList className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Dr. {rx.doctorName}</p>
                                        <p className="text-sm text-muted-foreground">{rx.specialization}</p>
                                        <p className="text-sm text-muted-foreground mt-1">{rx.diagnosis}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">
                                        {format(new Date(rx.createdAt), 'MMM d, yyyy')}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {rx.medicationCount} medications
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <Link
                                    href={routes.patient.prescription(rx.id)}
                                    className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
                                >
                                    <Eye className="h-4 w-4" />
                                    View
                                </Link>
                                <button className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm hover:bg-muted">
                                    <Download className="h-4 w-4" />
                                    Download PDF
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={ClipboardList}
                    title="No prescriptions"
                    description="Prescriptions from your consultations will appear here."
                />
            )}

            {/* Pagination */}
            {prescriptions.length > 0 && (
                <div className="mt-8">
                    <Pagination currentPage={1} totalPages={1} />
                </div>
            )}
        </div>
    );
}
