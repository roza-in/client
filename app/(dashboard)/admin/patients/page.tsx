'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SearchInput, Pagination } from '@/components/shared';
import { Users, Mail, Phone, Calendar, ArrowUpRight, Database } from 'lucide-react';
import { routes } from '@/config';
import { useAdminPatients } from '@/features/admin';
import { format } from 'date-fns';

export default function AdminPatientsPage() {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [resetKey, setResetKey] = useState(0);

    const { data: patientData, isLoading } = useAdminPatients({
        page,
        limit: 10,
        search: searchQuery,
    });

    const patients = (patientData as any)?.data || [];
    const meta = (patientData as any)?.meta;
    const totalPages = meta?.totalPages || 1;

    const clearFilters = () => {
        setSearchQuery('');
        setStatusFilter('');
        setPage(1);
        setResetKey(prev => prev + 1);
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Patient Management</h1>
                    <p className="text-muted-foreground mt-1 text-sm font-medium italic opacity-70">
                        Manage user accounts, monitor health profiles, and platform access.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href={routes.admin.dashboard}
                        className="inline-flex items-center justify-center rounded-lg bg-primary py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-all active:scale-95"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="rounded-xl border border-border/50 shadow-sm bg-card overflow-hidden">
                {/* Search and Filters Bar */}
                <div className="p-4 lg:p-6 border-b border-border/50 bg-muted/20">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1 max-w-md">
                            <SearchInput
                                key={resetKey}
                                value={searchQuery}
                                placeholder="Search patients by name, email or ID..."
                                onSearch={(query) => {
                                    setSearchQuery(query);
                                    setPage(1);
                                }}
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <select
                                className="h-10 rounded-lg border border-border bg-background px-3 py-1 text-sm font-medium focus-ring min-w-[140px]"
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setPage(1);
                                }}
                                value={statusFilter}
                            >
                                <option value="">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="suspended">Suspended</option>
                            </select>

                            {(searchQuery || statusFilter) && (
                                <button
                                    onClick={clearFilters}
                                    className="h-10 rounded-lg border border-border bg-muted/50 px-4 py-1 text-sm font-medium hover:bg-muted transition-colors"
                                >
                                    Clear Filters
                                </button>
                            )}

                            <div className="h-10 px-4 flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-lg">
                                <Database className="h-3.5 w-3.5 text-primary" />
                                <span className="text-xs font-bold text-primary">{meta?.total || 0} Total</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/30 border-b border-border/50">
                                <th className="whitespace-nowrap px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Profile Identity</th>
                                <th className="whitespace-nowrap px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Contact Access</th>
                                <th className="whitespace-nowrap px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 text-center">Health Summary</th>
                                <th className="whitespace-nowrap px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 text-center">Status</th>
                                <th className="whitespace-nowrap px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50 font-medium">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-4 h-20">
                                            <div className="h-12 bg-muted/10 rounded-xl" />
                                        </td>
                                    </tr>
                                ))
                            ) : patients.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-24 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="h-16 w-16 rounded-3xl bg-muted/20 flex items-center justify-center">
                                                <Users className="h-8 w-8 text-muted-foreground opacity-30" />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No patients found</h3>
                                            <p className="text-sm text-muted-foreground italic font-medium max-w-xs mx-auto opacity-70">
                                                Adjust your search or filters to find specific patient records.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                patients.map((p: any) => (
                                    <tr key={p.id} className="hover:bg-muted/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative shrink-0">
                                                    {p.avatar_url ? (
                                                        <img src={p.avatar_url} alt={p.name} className="h-11 w-11 rounded-xl object-cover ring-2 ring-background border shadow-sm" />
                                                    ) : (
                                                        <div className="h-11 w-11 rounded-xl bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary font-black border border-primary/20 shadow-sm transition-all group-hover:scale-105 group-hover:bg-primary group-hover:text-white group-hover:border-transparent">
                                                            {p.name[0].toUpperCase()}
                                                        </div>
                                                    )}
                                                    {p.is_active && <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-background animate-pulse" />}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">{p.name}</p>
                                                    <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-tight opacity-60">
                                                        #{p.id.slice(0, 8)}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-xs font-bold text-foreground/80 lowercase">
                                                    <Mail className="h-3.5 w-3.5 text-primary opacity-60" />
                                                    {p.email || 'No email provided'}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-bold text-foreground/80">
                                                    <Phone className="h-3.5 w-3.5 text-primary opacity-60" />
                                                    {p.phone || '—'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="inline-flex flex-col items-center gap-1.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="px-1.5 py-0.5 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 text-[10px] font-black rounded border border-red-100 dark:border-red-900/50 uppercase">
                                                        {p.blood_group || 'O+'}
                                                    </span>
                                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Blood</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-foreground/70">
                                                    <Calendar className="h-3 w-3 opacity-50 text-primary" />
                                                    {p.date_of_birth ? format(new Date(p.date_of_birth), 'dd MMM yyyy') : 'No DOB'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest ring-1 ring-inset ${p.is_active
                                                    ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400'
                                                    : 'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-400'
                                                    }`}>
                                                    <div className={`mr-1.5 h-1 w-1 rounded-full ${p.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                                    {p.is_active ? 'Active' : 'Suspended'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`${routes.admin.patients}/${p.id}`}
                                                className="inline-flex items-center justify-center p-2.5 bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-xl transition-all border border-transparent hover:border-primary/20 group/btn shadow-inner active:scale-95"
                                            >
                                                <ArrowUpRight className="h-5 w-5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Section */}
            {!isLoading && patients.length > 0 && (
                <div className="flex items-center justify-center py-4">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </div>
            )}
        </div>
    );
}