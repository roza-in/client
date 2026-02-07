import { Metadata } from 'next';
import Link from 'next/link';
import { BarChart3, TrendingUp, FileText, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Reports',
    description: 'Platform reports and analytics.',
};

export default function AdminReportsPage() {
    const reports = [
        { href: '/admin/reports/revenue', icon: TrendingUp, title: 'Revenue Report', description: 'Platform revenue analytics' },
        { href: '/admin/reports/compliance', icon: ShieldCheck, title: 'Compliance Report', description: 'Regulatory compliance status' },
    ];

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Reports</h1>
                <p className="text-muted-foreground">Platform analytics and reports</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {reports.map((report) => (
                    <Link
                        key={report.href}
                        href={report.href}
                        className="rounded-xl border p-6 hover:bg-muted/50 transition-colors"
                    >
                        <report.icon className="h-8 w-8 text-primary mb-4" />
                        <h2 className="font-semibold">{report.title}</h2>
                        <p className="text-sm text-muted-foreground mt-2">{report.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
