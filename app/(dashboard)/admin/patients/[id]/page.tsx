'use client';

import React, { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    BadgeCheck,
    AlertTriangle,
    X,
    Loader2,
    Trash2,
    Database,
    Clock,
    UserCircle,
    Activity,
    Shield,
    Users
} from 'lucide-react';
import { routes } from '@/config';
import { useAdminUser, useUpdateUserStatus, useDeleteUser } from '@/features/admin/hooks/use-admin';
import { PatientDetailsTabs } from '@/components/admin/patient-details-tabs';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function AdminPatientDetailsPage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();

    // Data fetching
    const { data: patient, isLoading, error, refetch } = useAdminUser(id);
    const { mutateAsync: updateStatus } = useUpdateUserStatus();
    const { mutateAsync: deletePatient } = useDeleteUser();

    const [isActionLoading, setIsActionLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleToggleStatus = async (isActive: boolean) => {
        setIsActionLoading(true);
        try {
            await updateStatus({ id, is_active: !isActive });
            toast.success(`Account ${!isActive ? 'activated' : 'suspended'} successfully`);
            refetch();
        } catch (err: any) {
            toast.error(err.message || 'Failed to update user status');
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDelete = async () => {
        setIsActionLoading(true);
        try {
            await deletePatient(id);
            toast.success('Patient profile permanently removed from registry');
            router.push('/admin/patients');
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete account');
        } finally {
            setIsActionLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
                <div className="h-16 w-16 rounded-3xl bg-primary/5 flex items-center justify-center relative shadow-sm border border-primary/10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest animate-pulse">Accessing Patient Records...</p>
            </div>
        );
    }

    if (error || !patient) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-md mx-auto">
                <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
                    <AlertTriangle className="h-10 w-10 text-red-400" />
                </div>
                <h2 className="text-xl font-bold mb-2">Patient profile not found</h2>
                <p className="text-muted-foreground font-medium italic mb-8 opacity-60">The patient registry returned no data for this ID. It may have been permanently purged.</p>
                <Link
                    href={'/admin/patients'}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-primary/90 transition-all shadow-md shadow-primary/20 uppercase tracking-widest"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Registry
                </Link>
            </div>
        );
    }

    const p = patient;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowDeleteConfirm(false)} />
                    <div className="relative bg-card border shadow-2xl rounded-3xl p-8 max-w-md w-full animate-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
                        >
                            <X className="h-5 w-5 text-muted-foreground" />
                        </button>

                        <div className="mb-6 text-center">
                            <div className="h-14 w-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="h-8 w-8 text-red-600" />
                            </div>
                            <h3 className="text-2xl font-black text-foreground mb-2">Purge Account?</h3>
                            <p className="text-muted-foreground font-medium italic leading-relaxed opacity-70">
                                You are about to permanently remove <span className="font-bold text-foreground">"{p.name}"</span> and all associated health records. This action cannot be indexed or recovered.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleDelete}
                                disabled={isActionLoading}
                                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-red-200 active:scale-95 flex items-center justify-center gap-2"
                            >
                                {isActionLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                                Confirm Permanent Deletion
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isActionLoading}
                                className="w-full py-4 bg-muted/50 hover:bg-muted text-foreground font-bold rounded-2xl transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Overview Card */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="flex-1 space-y-8 w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-start gap-5">
                            <div className="relative shrink-0">
                                {p.avatar_url ? (
                                    <img src={p.avatar_url} alt={p.name} className="h-20 w-20 md:h-24 md:w-24 rounded-3xl object-cover ring-4 ring-background shadow-xl border" />
                                ) : (
                                    <div className="h-20 w-20 md:h-24 md:w-24 rounded-3xl bg-linear-to-br from-primary to-primary/80 flex items-center justify-center text-white text-3xl font-black ring-4 ring-background shadow-xl border">
                                        {p.name[0].toUpperCase()}
                                    </div>
                                )}
                                <div className={`absolute -bottom-1 -right-1 h-8 w-8 rounded-full border-4 border-background flex items-center justify-center text-white shadow-sm ${p.is_active ? 'bg-green-500' : 'bg-red-500'}`}>
                                    {p.is_active ? <BadgeCheck className="h-4 w-4" /> : <X className="h-4 w-4" />}
                                </div>
                            </div>
                            <div className="space-y-1.5 text-left pt-1">
                                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{p.name}</h1>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-bold text-muted-foreground">
                                    <span className="capitalize px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                        Primary Account
                                    </span>
                                    <span className="flex items-center gap-1 opacity-70 font-medium italic">
                                        <MapPin className="h-3.5 w-3.5 opacity-60" />
                                        {p.address?.city || 'Location unmapped'}
                                    </span>
                                    <span className="font-mono text-[10px] opacity-40 uppercase tracking-tighter">
                                        UUID: {p.id}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                            <div className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border-2 ${p.is_active ? 'bg-green-50 text-green-700 border-green-100/50' : 'bg-red-50 text-red-700 border-red-100/50'}`}>
                                <div className={`h-1.5 w-1.5 rounded-full ${p.is_active ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                                {p.is_active ? 'User Active' : 'Account Blocked'}
                            </div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase opacity-40 tracking-tighter">
                                Registry entry: {format(new Date(p.created_at), 'PPP')}
                            </p>
                        </div>
                    </div>

                    {/* Quick Profile Stats */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            label="Health Records"
                            value="12 Docs"
                            icon={<Database className="h-4 w-4" />}
                            color="blue"
                        />
                        <StatCard
                            label="Medical History"
                            value={`${(p.medical_conditions?.length || 0) + (p.allergies?.length || 0)} Factors`}
                            icon={<Activity className="h-4 w-4" />}
                            color="red"
                        />
                        <StatCard
                            label="Family Network"
                            value={`${p.family_members?.length || 0} Members`}
                            icon={<Users className="h-4 w-4" />}
                            color="green"
                        />
                        <StatCard
                            label="Last Consult"
                            value="14 Jan '24"
                            icon={<Clock className="h-4 w-4" />}
                            color="purple"
                        />
                    </div>

                    <div className="pt-6">
                        <PatientDetailsTabs
                            patient={p}
                            onToggleStatus={handleToggleStatus}
                            onDelete={() => setShowDeleteConfirm(true)}
                            isActionLoading={isActionLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, color }: { label: string; value: any; icon: React.ReactNode; color: 'blue' | 'green' | 'purple' | 'red' }) {
    const colorStyles = {
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        green: 'bg-green-50 text-green-600 border-green-100',
        purple: 'bg-purple-50 text-purple-600 border-purple-100',
        red: 'bg-red-50 text-red-600 border-red-100',
    };

    return (
        <div className="group overflow-hidden rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 border-muted/50">
            <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl border ${colorStyles[color]}`}>
                    {icon}
                </div>
            </div>
            <div className="space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors opacity-70">{label}</p>
                <p className="text-xl font-black text-foreground">{value}</p>
            </div>
        </div>
    );
}
