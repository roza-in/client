'use client';

import React, { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Stethoscope,
    Users,
    Calendar,
    Activity,
    MapPin,
    ExternalLink,
    Trash2,
    AlertTriangle,
    X,
    Loader2,
    CheckCircle,
    Clock,
    XCircle
} from 'lucide-react';
import { routes } from '@/config';
import { useDoctor } from '@/features/doctors/hooks/use-doctors';
import { verifyDoctor, deleteDoctor, updateDoctorStatus } from '@/features/admin/api/admin';
import { DoctorDetailsTabs } from '@/components/admin/doctor-details-tabs';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function AdminDoctorDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();

    // Core data fetching
    const { data: doctor, isLoading, error, refetch } = useDoctor(id);

    // We might need to fetch appointments for this specific doctor in the future
    // For now, we'll pass an empty array to the tabs since appointments are not yet implemented in the hook
    const appointments: any[] | undefined = [];

    // Auto-transition to under_review if pending
    React.useEffect(() => {
        if (doctor && (doctor as any).verification_status === 'pending') {
            verifyDoctor(id, 'under_review')
                .then(() => refetch())
                .catch(err => console.error('Failed to auto-update doctor status:', err));
        }
    }, [doctor, id, refetch]);

    const [isActionLoading, setIsActionLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleVerify = async (status: 'verified' | 'rejected', remarks?: string) => {
        setIsActionLoading(true);
        try {
            await verifyDoctor(id, status, remarks);
            const statusMsg = status === 'verified' ? 'verified' : 'rejected';
            toast.success(`Practitioner ${statusMsg} successfully`);
            refetch();
        } catch (err: any) {
            toast.error(err.message || 'Failed to update verification status');
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDelete = async () => {
        setIsActionLoading(true);
        try {
            await deleteDoctor(id);
            toast.success("Doctor profile removed from platform");
            router.push(routes.admin.doctors);
        } catch (err: any) {
            toast.error(err.message || "Failed to delete doctor");
        } finally {
            setIsActionLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    const handleToggleStatus = async (isActive: boolean) => {
        setIsActionLoading(true);
        try {
            await updateDoctorStatus(id, !isActive);
            toast.success(`Practitioner ${!isActive ? 'activated' : 'deactivated'} successfully`);
            refetch();
        } catch (err: any) {
            toast.error(err.message || 'Failed to update platform status');
        } finally {
            setIsActionLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm font-medium text-muted-foreground animate-pulse">Fetching practitioner profile...</p>
            </div>
        );
    }

    if (error || !doctor) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-md mx-auto">
                <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
                    <Stethoscope className="h-10 w-10 text-red-400" />
                </div>
                <h2 className="text-xl font-bold mb-2">Practitioner not found</h2>
                <p className="text-muted-foreground mb-8">The doctor you are looking for might have been removed or the ID is incorrect.</p>
                <Link
                    href={routes.admin.doctors}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Registry
                </Link>
            </div>
        );
    }

    const d = doctor as any;
    const isVerified = (d.verificationStatus || d.verification_status) === 'verified';
    const isPending = (d.verificationStatus || d.verification_status) === 'pending';
    const isUnderReview = (d.verificationStatus || d.verification_status) === 'under_review';
    const isRejected = (d.verificationStatus || d.verification_status) === 'rejected';

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
                            <h3 className="text-2xl font-black text-foreground mb-2">Remove Practitioner?</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                You are about to permanently delete <span className="font-bold text-foreground">"Dr. {d.users?.name || d.name}"</span>.
                                This will remove their profile, availability schedules, and associated clinical data.
                                <span className="block mt-2 font-bold text-red-600">This action is irreversible.</span>
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
                                {d.profilePictureUrl || d.profile_picture_url || d.og_image_url ? (
                                    <img
                                        src={d.profilePictureUrl || d.profile_picture_url || d.og_image_url}
                                        alt={d.users?.name || d.name}
                                        className="h-20 w-20 md:h-24 md:w-24 rounded-2xl object-cover ring-4 ring-background shadow-xl border"
                                    />
                                ) : (
                                    <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl bg-linear-to-br from-primary to-primary/80 flex items-center justify-center text-white text-3xl font-black ring-4 ring-background shadow-xl border">
                                        {(d.users?.name || d.name || 'D')[0].toUpperCase()}
                                    </div>
                                )}
                                <div className={`absolute -bottom-1 -right-1 h-8 w-8 rounded-full border-4 border-background flex items-center justify-center text-white shadow-sm ${isVerified ? 'bg-green-500' : isUnderReview ? 'bg-blue-500' : isPending ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}>
                                    {isVerified ? <CheckCircle className="h-4 w-4" /> : isUnderReview ? <Activity className="h-4 w-4" /> : isPending ? <Clock className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                </div>
                            </div>
                            <div className="space-y-1.5 text-left">
                                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Dr. {d.users?.name || d.name}</h1>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-bold text-muted-foreground">
                                    <span className="capitalize px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest border border-primary/20">
                                        {d.specializationName || d.specialization?.name || d.specialization || 'General'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5 opacity-60" />
                                        {d.city || 'Remote'}
                                    </span>
                                    <span className="flex items-center gap-1 font-mono text-xs opacity-60">
                                        #{d.registrationNumber || d.registration_number || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                            <div className="flex items-center gap-3">
                                <span className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-black uppercase tracking-widest border-2 ${isVerified
                                    ? 'bg-green-50 text-green-700 border-green-100/50'
                                    : isUnderReview
                                        ? 'bg-blue-50 text-blue-700 border-blue-100/50'
                                        : isPending
                                            ? 'bg-yellow-50 text-yellow-700 border-yellow-100/50'
                                            : 'bg-red-50 text-red-700 border-red-100/50'
                                    }`}>
                                    <div className={`h-1.5 w-1.5 rounded-full ${isVerified ? 'bg-green-500' : isUnderReview ? 'bg-blue-500' : isPending ? 'bg-yellow-500' : 'bg-red-500'} animate-pulse`} />
                                    {(d.verificationStatus || d.verification_status)?.replace('_', ' ')}
                                </span>

                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all shadow-sm border border-red-100/50"
                                    title="Delete Doctor"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60 tracking-tighter">
                                Joined platform: {format(new Date(d.createdAt || d.created_at), 'PPP')}
                            </p>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            label="Practice Experience"
                            value={`${d.experienceYears || d.experience_years || 0} Yrs`}
                            icon={<Activity className="h-4 w-4" />}
                            color="blue"
                        />
                        <StatCard
                            label="Platform Rating"
                            value={d.rating || '0.0'}
                            icon={<div className="text-yellow-500 text-xs">★</div>}
                            color="yellow"
                        />
                        <StatCard
                            label="Success Rate"
                            value="98%"
                            icon={<CheckCircle className="h-4 w-4" />}
                            color="green"
                        />
                        <StatCard
                            label="Conslt. Fee"
                            value={`₹${d.consultationFeeInPerson || d.consultation_fee_in_person || 0}`}
                            icon={<Calendar className="h-4 w-4" />}
                            color="purple"
                        />
                    </div>

                    {/* Main Tabs Interaction */}
                    <div className="pt-6">
                        <DoctorDetailsTabs
                            doctor={d}
                            appointments={appointments}
                            onVerify={handleVerify}
                            onToggleStatus={() => handleToggleStatus(d.isActive ?? d.is_active)}
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
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">{label}</p>
                <p className="text-2xl font-black">{value}</p>
            </div>
        </div>
    );
}
