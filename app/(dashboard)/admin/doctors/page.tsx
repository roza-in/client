'use client';

import { useState } from 'react';
import { SearchInput, Pagination } from '@/components/shared';
import {
    Stethoscope,
    CheckCircle,
    XCircle,
    Clock,
    Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useAdminDoctors } from '@/features/admin';
import { Badge } from '@/components/ui/badge';

export default function AdminDoctorsPage() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');

    const { data: doctorData, isLoading, error } = useAdminDoctors({
        search,
        page,
        limit: 10,
        status: statusFilter
    });

    const doctors = (doctorData as any)?.data || [];
    const total = (doctorData as any)?.meta?.total || 0;
    const totalPages = (doctorData as any)?.meta?.totalPages || 1;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'verified':
                return (
                    <Badge variant="success" className="gap-1 px-2.5 py-0.5">
                        <CheckCircle className="h-3 w-3" />
                        Verified
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge variant="destructive" className="gap-1 px-2.5 py-0.5">
                        <XCircle className="h-3 w-3" />
                        Rejected
                    </Badge>
                );
            case 'pending':
                return (
                    <Badge variant="warning" className="gap-1 px-2.5 py-0.5">
                        <Clock className="h-3 w-3" />
                        Pending
                    </Badge>
                );
            case 'under_review':
                return (
                    <Badge variant="secondary" className="gap-1 px-2.5 py-0.5">
                        <Clock className="h-3 w-3" />
                        Under Review
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status?.toUpperCase() || 'UNKNOWN'}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Doctor Management</h1>
                    <p className="text-muted-foreground text-sm">Review credentials and manage practitioner accessibility</p>
                </div>
                <Link
                    href="/admin/doctors/onboard"
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95"
                >
                    Onboard New Doctor
                </Link>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[300px]">
                    <SearchInput
                        placeholder="Search by name, specialization, or license..."
                        onSearch={(val) => {
                            setSearch(val);
                            setPage(1);
                        }}
                    />
                </div>

                <div className="flex items-center gap-2 bg-muted/40 p-1 rounded-lg border">
                    <button
                        onClick={() => { setStatusFilter(''); setPage(1); }}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${statusFilter === '' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => { setStatusFilter('pending'); setPage(1); }}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${statusFilter === 'pending' ? 'bg-background shadow-sm text-yellow-600' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => { setStatusFilter('verified'); setPage(1); }}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${statusFilter === 'verified' ? 'bg-background shadow-sm text-green-600' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Verified
                    </button>
                    <button
                        onClick={() => { setStatusFilter('rejected'); setPage(1); }}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${statusFilter === 'rejected' ? 'bg-background shadow-sm text-red-600' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Rejected
                    </button>
                </div>
            </div>

            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                <th className="px-6 py-4 text-left font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Doctor</th>
                                <th className="px-6 py-4 text-left font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Specialization</th>
                                <th className="px-6 py-4 text-left font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Hospital</th>
                                <th className="px-6 py-4 text-left font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Fees</th>
                                <th className="px-6 py-4 text-left font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Status</th>
                                <th className="px-6 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-6 h-16 bg-muted/10"></td>
                                    </tr>
                                ))
                            ) : doctors.length > 0 ? (
                                doctors.map((doctor: any) => (
                                    <tr key={doctor.id} className="hover:bg-muted/10 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-primary/10 text-primary font-bold border border-primary/10">
                                                    {(doctor.users?.name || doctor.user?.name || doctor.name || '?')[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-foreground">Dr. {doctor.users?.name || doctor.user?.name || doctor.name}</div>
                                                    <div className="text-[10px] font-mono text-muted-foreground">{doctor.registrationNumber || doctor.registration_number}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium">{doctor.specializationName || doctor.specialization?.name || doctor.specialization || 'General'}</td>
                                        <td className="px-6 py-4">
                                            {doctor.hospitals?.name || doctor.hospital?.name || doctor.hospitalName ? (
                                                <span className="text-sm">{doctor.hospitals?.name || doctor.hospital?.name || doctor.hospitalName}</span>
                                            ) : (
                                                <span className="text-xs text-muted-foreground italic">Independent</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold">₹{doctor.consultationFeeInPerson || 0} <span className="text-[8px] font-normal text-muted-foreground uppercase">In-Person</span></span>
                                                <span className="text-xs font-bold text-blue-600">₹{doctor.consultationFeeOnline || 0} <span className="text-[8px] font-normal text-muted-foreground uppercase">Online</span></span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1.5">
                                                {getStatusBadge(doctor.verificationStatus || doctor.verification_status)}
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`h-1.5 w-1.5 rounded-full ${(doctor.isActive ?? doctor.is_active) ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
                                                    <span className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground">
                                                        {(doctor.isActive ?? doctor.is_active) ? 'Platform Active' : 'Platform Disabled'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/admin/doctors/${doctor.id}`}
                                                className="inline-flex items-center justify-center underline px-3 py-1.5 text-sm text-primary font-semibold transition-all active:scale-95"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <Stethoscope className="h-10 w-10 opacity-20" />
                                            <p className="font-medium italic">No doctors found matching filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Section {page} of {totalPages} <span className="text-[10px] ml-1 uppercase opacity-50 font-bold">({total} Total)</span>
                </div>
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </div>
        </div>
    );
}
