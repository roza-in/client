'use client';

import { useState } from 'react';
import {
    User,
    Mail,
    Phone,
    Building2,
    Shield,
    Camera,
    Award,
    Stethoscope,
    GraduationCap,
    Clock,
    Languages,
    CheckCircle2,
    AlertCircle,
    Edit2,
    Star,
    Calendar,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { LoadingSpinner } from '@/components/shared';

// =============================================================================
// Info Card Component
// =============================================================================

function InfoCard({
    icon: Icon,
    title,
    children,
    action,
}: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    children: React.ReactNode;
    action?: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    {title}
                </h2>
                {action}
            </div>
            {children}
        </div>
    );
}

// =============================================================================
// Stat Card Component
// =============================================================================

function StatCard({
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
        <div className="rounded-xl border p-4 bg-card/50">
            <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
                    <Icon className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-xl font-bold text-slate-900">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                </div>
            </div>
        </div>
    );
}

// =============================================================================
// Main Page Component
// =============================================================================

export default function DoctorProfilePage() {
    const { user, isLoading } = useAuth();
    const doctor = user?.doctor;
    const userInfo = user;

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="rounded-2xl border bg-amber-50 p-6 text-center">
                    <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
                    <h1 className="text-xl font-bold text-slate-900">Doctor Profile Not Found</h1>
                    <p className="text-muted-foreground mt-2">
                        Your account does not have a doctor profile associated with it.
                    </p>
                </div>
            </div>
        );
    }

    // Extract doctor data
    const name = userInfo?.name || 'Doctor';
    const email = userInfo?.email || 'Not provided';
    const phone = userInfo?.phone || 'Not provided';
    const specialization = (doctor.specialization as any)?.name || doctor.specialization || 'General Physician';
    const qualifications = doctor.qualifications || [];
    const experience = doctor.experienceYears || 0;
    const registrationNumber = doctor.registrationNumber || 'Not available';
    const hospital = doctor.hospital?.name || 'Not associated';
    const hospitalCity = doctor.hospital?.city || '';
    const consultationFeeOnline = doctor.consultationFeeOnline || 0;
    const consultationFeeInPerson = doctor.consultationFeeInPerson || 0;
    const languages = doctor.languages || ['English', 'Hindi'];
    const bio = doctor.bio || 'No bio provided.';
    const isVerified = doctor.verification_status === 'verified';
    const rating = doctor.rating || 0;
    const totalRatings = doctor.totalRatings || 0;
    const totalConsultations = doctor.totalConsultations || 0;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
                <p className="text-muted-foreground">View and manage your doctor profile</p>
            </div>

            {/* Profile Header Card */}
            <div className="rounded-2xl border bg-linear-to-r from-primary/5 to-primary/10 p-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                        <div className="h-28 w-28 rounded-full bg-linear-to-br from-primary/30 to-primary/10 flex items-center justify-center text-4xl font-bold text-primary shadow-lg border-4 border-white">
                            {userInfo?.profilePictureUrl ? (
                                <img
                                    src={userInfo.profilePictureUrl}
                                    alt={name}
                                    className="h-full w-full rounded-full object-cover"
                                />
                            ) : (
                                name.charAt(0).toUpperCase()
                            )}
                        </div>
                        <button className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-md hover:bg-primary/90 transition-colors">
                            <Camera className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h2 className="text-2xl font-bold text-slate-900">Dr. {name}</h2>
                                    {isVerified && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            Verified
                                        </span>
                                    )}
                                </div>
                                <p className="text-primary font-medium mt-1">{specialization}</p>
                                <p className="text-sm text-muted-foreground mt-1">{hospital}{hospitalCity && `, ${hospitalCity}`}</p>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                            <StatCard icon={Star} label="Rating" value={rating.toFixed(1)} color="amber" />
                            <StatCard icon={Calendar} label="Consultations" value={totalConsultations} color="primary" />
                            <StatCard icon={Clock} label="Experience" value={`${experience} yrs`} color="blue" />
                            <StatCard icon={User} label="Reviews" value={totalRatings} color="green" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <InfoCard
                icon={User}
                title="Contact Information"
                action={
                    <button className="text-sm text-primary hover:underline flex items-center gap-1">
                        <Edit2 className="h-3.5 w-3.5" />
                        Edit
                    </button>
                }
            >
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
                        <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{email}</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</label>
                        <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{phone}</span>
                        </div>
                    </div>
                </div>
            </InfoCard>

            {/* Professional Information */}
            <InfoCard icon={Stethoscope} title="Professional Information">
                <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Specialization</label>
                            <p className="text-sm font-medium">{specialization}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Experience</label>
                            <p className="text-sm font-medium">{experience} Years</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Registration Number</label>
                            <p className="text-sm font-mono font-medium">{registrationNumber}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Qualifications</label>
                            <div className="flex flex-wrap gap-2">
                                {qualifications.length > 0 ? (
                                    qualifications.map((qual, idx) => (
                                        <span key={idx} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                                            {qual}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-sm text-muted-foreground">Not specified</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">About</label>
                        <p className="text-sm text-slate-600 mt-1">{bio}</p>
                    </div>

                    <div className="pt-4 border-t">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Languages</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {languages.map((lang, idx) => (
                                <span key={idx} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                                    {lang}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </InfoCard>

            {/* Hospital & Fees */}
            <InfoCard icon={Building2} title="Associated Hospital">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-semibold text-slate-900">{hospital}</p>
                        {hospitalCity && <p className="text-sm text-muted-foreground">{hospitalCity}</p>}
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-muted-foreground">Consultation Fee</div>
                        <div className="flex gap-4 mt-1">
                            <div>
                                <span className="text-lg font-bold text-slate-900">₹{consultationFeeInPerson}</span>
                                <span className="text-xs text-muted-foreground ml-1">In-person</span>
                            </div>
                            {consultationFeeOnline > 0 && (
                                <div>
                                    <span className="text-lg font-bold text-primary">₹{consultationFeeOnline}</span>
                                    <span className="text-xs text-muted-foreground ml-1">Online</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </InfoCard>

            {/* Security */}
            <InfoCard icon={Shield} title="Security">
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border">
                        <div>
                            <p className="font-medium text-slate-900">Password</p>
                            <p className="text-sm text-muted-foreground">Change your account password</p>
                        </div>
                        <button className="rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
                            Change Password
                        </button>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border">
                        <div>
                            <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                            <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                        </div>
                        <button className="rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
                            Enable
                        </button>
                    </div>
                </div>
            </InfoCard>
        </div>
    );
}
