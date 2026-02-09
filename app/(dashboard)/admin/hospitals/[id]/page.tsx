'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Building2, Loader2, Calendar, Users, Activity, MapPin, ExternalLink, Trash2, AlertTriangle, X } from 'lucide-react';
import { routes } from '@/config';
import { useHospital, useHospitalDoctors, useHospitalAppointments } from '@/features/hospitals/hooks/use-hospitals';
import { verifyHospital, deleteHospital, updateHospitalStatus } from '@/features/admin/api/admin';
import { HospitalDetailsTabs } from '@/components/admin/hospital-details-tabs';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function AdminHospitalDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();

    // Core data fetching
    const { data: hospital, isLoading: isHospitalLoading, error: hospitalError, refetch: refetchHospital } = useHospital(id);
    const { data: doctorsData, isLoading: isDoctorsLoading } = useHospitalDoctors(id);
    const { data: appointmentsData, isLoading: isAppointmentsLoading } = useHospitalAppointments(id, { limit: 50 });

    // Auto-transition to under_review if pending
    React.useEffect(() => {
        if (hospital && (hospital as any).verification_status === 'pending') {
            verifyHospital(id, 'under_review')
                .then(() => refetchHospital())
                .catch(err => console.error('Failed to auto-update status:', err));
        }
    }, [hospital, id, refetchHospital]);

    const [isActionLoading, setIsActionLoading] = React.useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

    const handleVerify = async (status: 'verified' | 'rejected' | 'under_review', remarks?: string) => {
        setIsActionLoading(true);
        try {
            await verifyHospital(id, status, remarks);
            const statusMsg = status === 'verified' ? 'verified' : status === 'rejected' ? 'rejected' : 'marked as under review';
            toast.success(`Hospital ${statusMsg} successfully`);
            refetchHospital();
        } catch (err: any) {
            toast.error(err.message || 'Failed to update verification status');
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDelete = async () => {
        setIsActionLoading(true);
        try {
            await deleteHospital(id);
            toast.success("Hospital deleted successfully");
            router.push(routes.admin.hospitals);
        } catch (err: any) {
            toast.error(err.message || "Failed to delete hospital");
        } finally {
            setIsActionLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    const handleToggleStatus = async (isActive: boolean) => {
        setIsActionLoading(true);
        try {
            await updateHospitalStatus(id, isActive);
            toast.success(`Hospital ${isActive ? 'activated' : 'deactivated'} successfully`);
            refetchHospital();
        } catch (err: any) {
            toast.error(err.message || 'Failed to update hospital status');
        } finally {
            setIsActionLoading(false);
        }
    };

    if (isHospitalLoading) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading hospital profile...</p>
            </div>
        );
    }

    if (hospitalError || !hospital) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-md mx-auto">
                <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
                    <Building2 className="h-10 w-10 text-red-400" />
                </div>
                <h2 className="text-xl font-bold mb-2">Hospital not found</h2>
                <p className="text-muted-foreground mb-8">The hospital you are looking for might have been removed or the ID is incorrect.</p>
                <Link
                    href={routes.admin.hospitals}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Hospitals
                </Link>
            </div>
        );
    }
    const h = hospital as any;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {/* Custom Delete Confirmation Modal */}
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

                        <div className="mb-6">
                            <div className="h-14 w-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                                <AlertTriangle className="h-8 w-8 text-red-600" />
                            </div>
                            <h3 className="text-2xl font-black text-foreground mb-2">Delete Hospital?</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                You are about to permanently delete <span className="font-bold text-foreground">"{h.name}"</span>.
                                This action will remove all associated data including doctors, schedules, and profile information.
                                <span className="block mt-2 font-bold text-red-600">This cannot be undone.</span>
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleDelete}
                                disabled={isActionLoading}
                                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-red-200 active:scale-95 flex items-center justify-center gap-2"
                            >
                                {isActionLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                                Delete Permanently
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
                                <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl bg-linear-to-br from-primary/10 to-primary/5 shadow-inner border border-primary/20 flex items-center justify-center overflow-hidden">
                                    {h.logo_url ? (
                                        <img src={h.logo_url} alt={h.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <Building2 className="h-10 w-10 md:h-12 md:w-12 text-primary/70" />
                                    )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full border-4 border-background bg-accent flex items-center justify-center text-[10px] font-bold text-accent-foreground shadow-sm">
                                    {h.rating || '0.0'}
                                </div>
                            </div>
                            <div className="space-y-1.5 text-left">
                                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{h.name}</h1>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-muted-foreground">
                                    <span className="capitalize px-2 py-0.5 rounded-full bg-muted/50 text-foreground text-[10px] font-bold">
                                        {h.type?.replace('_', ' ')}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5 opacity-60" />
                                        {h.city}, {h.state}
                                    </span>
                                    {h.website && (
                                        <a
                                            href={h.website.startsWith('http') ? h.website : `https://${h.website}`}
                                            target="_blank"
                                            className="flex items-center gap-1 text-primary hover:underline"
                                        >
                                            <ExternalLink className="h-3.5 w-3.5" />
                                            Website
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                            <div className="flex items-center gap-3">
                                <span className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-black uppercase tracking-widest border-2 ${h.verification_status === 'verified'
                                    ? 'bg-green-50 text-green-700 border-green-100/50'
                                    : h.verification_status === 'pending'
                                        ? 'bg-yellow-50 text-yellow-700 border-yellow-100/50'
                                        : h.verification_status === 'under_review'
                                            ? 'bg-blue-50 text-blue-700 border-blue-100/50'
                                            : 'bg-red-50 text-red-700 border-red-100/50'
                                    }`}>
                                    <div className={`h-1.5 w-1.5 rounded-full ${h.verification_status === 'verified' ? 'bg-green-500' : h.verification_status === 'pending' ? 'bg-yellow-500' : h.verification_status === 'under_review' ? 'bg-blue-500' : 'bg-red-500'
                                        } animate-pulse`} />
                                    {h.verification_status?.replace('_', ' ')}
                                </span>

                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all shadow-sm border border-red-100/50"
                                    title="Delete Hospital"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                                Registration date: {format(new Date(h.created_at), 'PP')}
                            </p>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            label="Associated Doctors"
                            value={h.totalDoctors || 0}
                            icon={<Users className="h-4 w-4" />}
                            color="blue"
                        />
                        <StatCard
                            label="Total Appointments"
                            value={h.totalAppointments || 0}
                            icon={<Calendar className="h-4 w-4" />}
                            color="green"
                        />
                        <StatCard
                            label="Platform Commission"
                            value={`${h.platform_commission_percent || 0}%`}
                            icon={<Activity className="h-4 w-4" />}
                            color="purple"
                        />
                        <StatCard
                            label="Average Rating"
                            value={h.rating || '0.0'}
                            icon={<div className="text-yellow-500 text-xs">★</div>}
                            color="yellow"
                        />
                    </div>

                    {/* Main Tabs Interaction */}
                    <div className="pt-6">
                        <HospitalDetailsTabs
                            hospital={h}
                            doctors={doctorsData?.doctors || []}
                            appointments={appointmentsData?.appointments || []}
                            onVerify={handleVerify}
                            onToggleStatus={handleToggleStatus}
                            isActionLoading={isActionLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, color }: { label: string; value: any; icon: React.ReactNode; color: 'blue' | 'green' | 'purple' | 'yellow' }) {
    const colorStyles = {
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        green: 'bg-green-50 text-green-600 border-green-100',
        purple: 'bg-purple-50 text-purple-600 border-purple-100',
        yellow: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    };

    return (
        <div className="group overflow-hidden rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl border ${colorStyles[color]}`}>
                    {icon}
                </div>
                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/20 group-hover:bg-primary/40 transition-colors" />
            </div>
            <div className="space-y-0.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary/70 transition-colors">{label}</p>
                <p className="text-2xl font-black">{value}</p>
            </div>
        </div>
    );
}
