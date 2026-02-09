'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SearchInput, Pagination } from '@/components/shared';
import { Building2, Loader2 } from 'lucide-react';
import { routes } from '@/config';
import { useAdminHospitals } from '@/features/admin';

export default function AdminHospitalsPage() {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [resetKey, setResetKey] = useState(0);

    const { data: hospitalData, isLoading } = useAdminHospitals({
        page,
        limit: 10,
        search: searchQuery,
        status: statusFilter,
        sortBy,
        sortOrder
    });

    const hospitals = (hospitalData as any)?.data || [];
    const totalPages = (hospitalData as any)?.meta?.totalPages || 1;

    const clearFilters = () => {
        setSearchQuery('');
        setStatusFilter('');
        setSortBy('name');
        setSortOrder('asc');
        setPage(1);
        setResetKey(prev => prev + 1);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [field, order] = e.target.value.split('_');
        setSortBy(field);
        setSortOrder(order as 'asc' | 'desc');
        setPage(1);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Hospital Management</h1>
                    <p className="text-muted-foreground mt-1">Manage and monitor health facilities across the platform</p>
                </div>
                <Link
                    href={routes.admin.dashboard}
                    className="inline-flex items-center justify-center rounded-lg bg-primary py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-all active:scale-95 sm:w-auto"
                >
                    <Building2 className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>
            </div>

            <div className="rounded-xl border border-border/50 shadow-sm bg-card overflow-hidden">
                <div className="p-4 lg:p-6 border-b border-border/50 bg-muted/20">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1 max-w-md">
                            <SearchInput
                                key={resetKey}
                                value={searchQuery}
                                placeholder="Search by name, city, or email..."
                                onSearch={(query) => {
                                    setSearchQuery(query);
                                    setPage(1);
                                }}
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <select
                                className="h-10 rounded-lg border border-border bg-background px-3 py-1 text-sm font-medium focus-ring min-w-[140px]"
                                onChange={handleSortChange}
                                value={`${sortBy}_${sortOrder}`}
                            >
                                <option value="name_asc">Name (A-Z)</option>
                                <option value="name_desc">Name (Z-A)</option>
                                <option value="created_at_desc">Newest First</option>
                                <option value="created_at_asc">Oldest First</option>
                                <option value="doctorCount_desc">Doctors (High to Low)</option>
                                <option value="doctorCount_asc">Doctors (Low to High)</option>
                                <option value="appointmentCount_desc">Appointments (H-L)</option>
                                <option value="appointmentCount_asc">Appointments (L-H)</option>
                            </select>

                            <select
                                className="h-10 rounded-lg border border-border bg-background px-3 py-1 text-sm font-medium focus-ring min-w-[140px]"
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setPage(1);
                                }}
                                value={statusFilter}
                            >
                                <option value="">All Statuses</option>
                                <option value="verified">Verified</option>
                                <option value="pending">Pending</option>
                                <option value="rejected">Rejected</option>
                            </select>

                            {(searchQuery || statusFilter || sortBy !== 'name' || sortOrder !== 'asc') && (
                                <button
                                    onClick={clearFilters}
                                    className="h-10 rounded-lg border border-border bg-muted/50 px-4 py-1 text-sm font-medium hover:bg-muted transition-colors"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/30 border-b border-border/50">
                                <th className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Hospital</th>
                                <th className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Contact & Location</th>
                                <th className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-center text-slate-700 dark:text-slate-300">Doctors</th>
                                <th className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-center text-slate-700 dark:text-slate-300">Appointments</th>
                                <th className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-center text-slate-700 dark:text-slate-300">Status</th>
                                <th className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-right text-slate-700 dark:text-slate-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-4 h-16 bg-muted/5"></td>
                                    </tr>
                                ))
                            ) : hospitals.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground italic">
                                        <div className="flex flex-col items-center gap-2">
                                            <Building2 className="h-8 w-8 opacity-20" />
                                            <p>No hospitals found matching your criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                hospitals.map((hospital: any) => (
                                    <tr key={hospital.id} className="hover:bg-muted/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                    <Building2 className="h-6 w-6" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{hospital.name}</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5 capitalize">{hospital.type?.replace('_', ' ')}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-slate-700 dark:text-slate-200">{hospital.phone || 'No phone'}</span>
                                                    <span className="text-muted-foreground text-xs">{hospital.city}, {hospital.state}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="inline-flex flex-col items-center">
                                                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{hospital.doctorCount || 0}</span>
                                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Registered</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="inline-flex flex-col items-center">
                                                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{hospital.appointmentCount || 0}</span>
                                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Total</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col items-center gap-1.5">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${hospital.verification_status === 'verified'
                                                    ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400'
                                                    : hospital.verification_status === 'pending'
                                                        ? 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400'
                                                        : 'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-400'
                                                    }`}>
                                                    {hospital.verification_status || 'pending'}
                                                </span>
                                                <span className={`text-[10px] font-bold uppercase ${hospital.is_active ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                    {hospital.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`${routes.admin.hospitals}/${hospital.id}`}
                                                className="inline-flex items-center justify-center underline px-3 py-1.5 text-sm text-primary font-semibold transition-all active:scale-95"
                                            >
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center justify-center py-4">
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </div>
        </div>
    );
}
