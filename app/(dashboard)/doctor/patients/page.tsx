'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
    Search,
    Users,
    ChevronRight,
    Calendar,
    Clock,
    Phone,
    Mail,
    User,
    Activity,
    FileText,
    TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useDoctorPatients, type DoctorPatient } from '@/features/doctors';
import { LoadingSpinner, EmptyState, Pagination } from '@/components/shared';
import { format, formatDistanceToNow } from 'date-fns';

// =============================================================================
// Stats Card Component
// =============================================================================

function StatsCard({
    icon: Icon,
    label,
    value,
    color = 'primary',
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string | number;
    color?: 'primary' | 'green' | 'amber' | 'blue';
}) {
    const colorClasses = {
        primary: 'bg-primary/10 text-primary',
        green: 'bg-green-100 text-green-600',
        amber: 'bg-amber-100 text-amber-600',
        blue: 'bg-blue-100 text-blue-600',
    };

    return (
        <div className="rounded-xl border p-4 bg-card shadow-sm">
            <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
                    <Icon className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-slate-900">{value}</p>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
                </div>
            </div>
        </div>
    );
}

// =============================================================================
// Patient Card Component
// =============================================================================

function PatientCard({ patient }: { patient: DoctorPatient }) {
    const lastVisitDate = new Date(patient.lastVisitDate);
    const timeAgo = formatDistanceToNow(lastVisitDate, { addSuffix: true });

    return (
        <Link
            href={`/doctor/patients/${patient.id}`}
            className="flex items-center gap-4 p-5 rounded-xl border bg-card hover:shadow-md hover:border-primary/30 transition-all group"
        >
            {/* Avatar */}
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-primary text-lg font-bold shrink-0">
                {patient.avatar ? (
                    <img
                        src={patient.avatar}
                        alt={patient.name}
                        className="h-full w-full rounded-full object-cover"
                    />
                ) : (
                    patient.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 truncate group-hover:text-primary transition-colors">
                    {patient.name}
                </h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1 flex-wrap">
                    {patient.age && (
                        <span className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5" />
                            {patient.age} yrs
                        </span>
                    )}
                    {patient.gender && (
                        <span className="capitalize">{patient.gender}</span>
                    )}
                    {patient.phone && (
                        <span className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            {patient.phone}
                        </span>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="text-right shrink-0">
                <div className="flex items-center gap-1 justify-end">
                    <Activity className="h-4 w-4 text-primary" />
                    <span className="font-bold text-slate-900">{patient.totalVisits}</span>
                    <span className="text-sm text-muted-foreground">visits</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                    Last visit: {timeAgo}
                </p>
            </div>

            {/* Arrow */}
            <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-primary shrink-0 transition-colors" />
        </Link>
    );
}

// =============================================================================
// Main Page Component
// =============================================================================

export default function DoctorPatientsPage() {
    const { user } = useAuth();
    const doctorId = user?.doctor?.id;

    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search
    useMemo(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch patients
    const { data, isLoading, error } = useDoctorPatients(doctorId || null, {
        search: debouncedSearch,
        page: currentPage,
        limit: 10,
    });

    // Stats
    const stats = useMemo(() => {
        if (!data) return { total: 0, regular: 0, new: 0 };

        const total = data.total;
        const regular = data.patients.filter((p) => p.totalVisits > 1).length;
        const newPatients = data.patients.filter((p) => p.totalVisits === 1).length;

        return { total, regular, new: newPatients };
    }, [data]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Patients</h1>
                    <p className="text-muted-foreground">View patient history and records</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatsCard
                    icon={Users}
                    label="Total Patients"
                    value={stats.total}
                    color="primary"
                />
                <StatsCard
                    icon={TrendingUp}
                    label="Regular Patients"
                    value={stats.regular}
                    color="green"
                />
                <StatsCard
                    icon={User}
                    label="New Patients"
                    value={stats.new}
                    color="blue"
                />
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search by patient name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border bg-background pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
            </div>

            {/* Patients List */}
            {isLoading ? (
                <div className="flex justify-center py-16">
                    <LoadingSpinner size="lg" />
                </div>
            ) : data && data.patients.length > 0 ? (
                <div className="space-y-3">
                    {data.patients.map((patient) => (
                        <PatientCard key={patient.id} patient={patient} />
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={Users}
                    title={searchQuery ? 'No patients found' : 'No patients yet'}
                    description={
                        searchQuery
                            ? `No patients matching "${searchQuery}"`
                            : 'Your patients will appear here after consultations.'
                    }
                />
            )}

            {/* Pagination */}
            {data && data.totalPages > 1 && (
                <div className="pt-4">
                    <Pagination
                        currentPage={data.page}
                        totalPages={data.totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
}
