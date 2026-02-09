import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Compliance Report',
    description: 'Platform compliance status.',
};

export default function AdminComplianceReportPage() {
    const complianceItems = [
        { category: 'Data Protection', status: 'compliant', lastAudit: '2026-01-01' },
        { category: 'HIPAA Standards', status: 'compliant', lastAudit: '2025-12-15' },
        { category: 'Payment Security (PCI-DSS)', status: 'compliant', lastAudit: '2026-01-10' },
        { category: 'Medical Records Retention', status: 'warning', lastAudit: '2025-11-20' },
        { category: 'Doctor Verification', status: 'compliant', lastAudit: '2026-01-05' },
    ];

    const statusIcons = {
        compliant: <CheckCircle className="h-5 w-5 text-green-600" />,
        warning: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
        non_compliant: <XCircle className="h-5 w-5 text-red-600" />,
    };

    return (
        <div className="p-6 max-w-3xl">
            <Link href="/admin/reports" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="h-4 w-4" />Back to reports
            </Link>

            <h1 className="text-2xl font-bold mb-6">Compliance Report</h1>

            <div className="rounded-xl border divide-y">
                {complianceItems.map((item) => (
                    <div key={item.category} className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                            {statusIcons[item.status as keyof typeof statusIcons]}
                            <div>
                                <p className="font-medium">{item.category}</p>
                                <p className="text-sm text-muted-foreground">Last audit: {item.lastAudit}</p>
                            </div>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-xs ${item.status === 'compliant' ? 'bg-green-100 text-green-700'
                                : item.status === 'warning' ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                            }`}>
                            {item.status}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-6 rounded-xl border p-6">
                <h2 className="font-semibold mb-2">Overall Compliance Score</h2>
                <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold text-green-600">92%</div>
                    <p className="text-sm text-muted-foreground">4 of 5 categories fully compliant</p>
                </div>
            </div>
        </div>
    );
}
