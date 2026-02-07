'use client';

import React, { useState } from 'react';
import {
    Info,
    ShieldCheck,
    Calendar,
    Settings,
    User,
    Mail,
    Phone,
    Globe,
    GraduationCap,
    Briefcase,
    Activity,
    Building2,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Power,
    FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface DoctorDetailsTabsProps {
    doctor: any;
    appointments?: any[];
    onVerify: (status: 'verified' | 'rejected', remarks?: string) => void;
    onToggleStatus: (isActive: boolean) => void;
    isActionLoading: boolean;
}

export function DoctorDetailsTabs({
    doctor,
    appointments = [],
    onVerify,
    onToggleStatus,
    isActionLoading
}: DoctorDetailsTabsProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'credentials' | 'appointments' | 'settings'>('overview');
    const [remarks, setRemarks] = useState('');
    const [showRejectPrompt, setShowRejectPrompt] = useState(false);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Info },
        { id: 'credentials', label: 'Credentials', icon: ShieldCheck },
        { id: 'appointments', label: 'Appointments', icon: Calendar },
        { id: 'settings', label: 'Action & Verification', icon: Settings },
    ] as const;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-6">
                                <div className="rounded-xl border bg-card p-6 shadow-sm">
                                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-foreground">
                                        <User className="h-4 w-4 text-primary" />
                                        Doctor Profile
                                    </h3>
                                    <div className="space-y-4">
                                        <InfoItem label="Full Name" value={`Dr. ${doctor.users?.name || doctor.name}`} />
                                        <InfoItem label="Primary Specialization" value={doctor.specializationName || doctor.specialization?.name || doctor.specialization} />
                                        <InfoItem label="City" value={doctor.city || 'Not specified'} />
                                        <InfoItem label="Biography" value={doctor.bio} direction="vertical" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="rounded-xl border bg-card p-6 shadow-sm">
                                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-foreground">
                                        <Phone className="h-4 w-4 text-primary" />
                                        Contact Information
                                    </h3>
                                    <div className="space-y-4">
                                        <InfoItem label="Email Registry" value={doctor.users?.email || doctor.email} icon={<Mail className="h-4 w-4" />} />
                                        <InfoItem label="Personal Mobile" value={doctor.users?.phone || doctor.phone} icon={<Phone className="h-4 w-4" />} />
                                        <div className="pt-2">
                                            <p className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-2">Languages</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {doctor.languages?.map((lang: string) => (
                                                    <Badge key={lang} variant="secondary" className="text-[10px] font-bold uppercase py-0.5">{lang}</Badge>
                                                )) || <span className="text-sm font-medium">English</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'credentials':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="rounded-xl border bg-card p-6 shadow-sm">
                                <h3 className="font-semibold text-lg mb-6 flex items-center gap-2 text-foreground">
                                    <ShieldCheck className="h-5 w-5 text-blue-500" />
                                    Medical Licensing
                                </h3>
                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl bg-muted/30 border shadow-xs space-y-4">
                                        <InfoItem label="Registration Number" value={doctor.registrationNumber || doctor.registration_number} />
                                        <InfoItem label="Medical Council" value={doctor.registrationCouncil || doctor.registration_council} />
                                        <InfoItem label="Registration Year" value={doctor.registrationYear || doctor.registration_year} />
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border bg-card p-6 shadow-sm">
                                <h3 className="font-semibold text-lg mb-6 flex items-center gap-2 text-foreground">
                                    <GraduationCap className="h-5 w-5 text-primary" />
                                    Education & Experience
                                </h3>
                                <div className="space-y-4">
                                    <InfoItem label="Medical Degree" value={doctor.qualification || doctor.qualifications || 'N/A'} icon={<GraduationCap className="h-4 w-4" />} />
                                    <InfoItem label="Years of Experience" value={`${doctor.experienceYears || doctor.experience_years || 0} Years`} icon={<Briefcase className="h-4 w-4" />} />
                                    <InfoItem label="Affiliated Hospital" value={doctor.hospitalName || doctor.hospital?.name || (doctor.hospitals?.name) || 'Private Practitioner'} icon={<Building2 className="h-4 w-4" />} />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'appointments':
                return (
                    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-muted/20">
                            <div>
                                <h3 className="font-semibold">Recent Consultations</h3>
                                <p className="text-sm text-muted-foreground">List of patients treated by this doctor</p>
                            </div>
                            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                                {appointments.length} Recent
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left font-medium">
                                <thead className="text-xs uppercase bg-muted/30 text-muted-foreground font-semibold">
                                    <tr>
                                        <th className="px-6 py-3">Patient</th>
                                        <th className="px-6 py-3">Date & Time</th>
                                        <th className="px-6 py-3">Type</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3 text-right">Fee</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {appointments.length > 0 ? appointments.map((apt: any) => (
                                        <tr key={apt.id} className="hover:bg-muted/10 transition-colors">
                                            <td className="px-6 py-4">{apt.patientName || apt.patient?.name || 'N/A'}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span>{format(new Date(apt.dateTime || apt.appointment_date), 'PP')}</span>
                                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                        <Clock className="h-3 w-3" /> {apt.time || apt.start_time}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 capitalize">{apt.type || 'In-Person'}</td>
                                            <td className="px-6 py-4">
                                                <Badge variant={apt.status === 'completed' ? 'success' : apt.status === 'cancelled' ? 'destructive' : 'warning'} className="text-[9px] uppercase font-bold">
                                                    {apt.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold">₹{apt.amount || apt.total_amount}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic">
                                                No recent appointments recorded.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'settings':
                const isVerified = (doctor.verificationStatus || doctor.verification_status) === 'verified';
                const isRejected = (doctor.verificationStatus || doctor.verification_status) === 'rejected';
                const isUnderReview = (doctor.verificationStatus || doctor.verification_status) === 'under_review';
                const isPending = (doctor.verificationStatus || doctor.verification_status) === 'pending';
                const isActive = doctor.isActive ?? doctor.is_active;

                return (
                    <div className="space-y-6 max-w-2xl">
                        <div className="rounded-xl border bg-card p-6 shadow-sm border-l-4 border-l-primary">
                            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-primary" />
                                Platform Verification
                            </h3>
                            <div className="flex items-center gap-4 mb-6">
                                <span className={`rounded-full px-4 py-1 text-xs font-black uppercase tracking-widest border-2 ${isVerified ? 'bg-green-50 text-green-700 border-green-100' :
                                    isRejected ? 'bg-red-50 text-red-700 border-red-100' :
                                        isUnderReview ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                            'bg-yellow-50 text-yellow-700 border-yellow-100'
                                    }`}>
                                    {(doctor.verificationStatus || doctor.verification_status)?.replace('_', ' ')}
                                </span>
                            </div>

                            {!isVerified && !showRejectPrompt && (
                                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                    <button
                                        onClick={() => onVerify('verified')}
                                        disabled={isActionLoading}
                                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-95 shadow-md"
                                    >
                                        {isActionLoading ? <Clock className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                                        Approve Practitioner
                                    </button>
                                    <button
                                        onClick={() => setShowRejectPrompt(true)}
                                        disabled={isActionLoading}
                                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white border-2 border-red-100 px-6 py-3 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50 transition-all active:scale-95"
                                    >
                                        <XCircle className="h-4 w-4" />
                                        Reject Profile
                                    </button>
                                </div>
                            )}

                            {showRejectPrompt && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-red-600">Reason for Rejection</label>
                                        <textarea
                                            value={remarks}
                                            onChange={(e) => setRemarks(e.target.value)}
                                            placeholder="Clearly explain the missing documents or profile issues..."
                                            className="w-full min-h-[120px] rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all resize-none"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => onVerify('rejected', remarks)}
                                            disabled={isActionLoading || !remarks.trim()}
                                            className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-100"
                                        >
                                            {isActionLoading ? <Clock className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                                            Confirm Rejection
                                        </button>
                                        <button
                                            onClick={() => { setShowRejectPrompt(false); setRemarks(''); }}
                                            disabled={isActionLoading}
                                            className="px-6 py-3 border font-bold rounded-xl hover:bg-muted/50 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            {isVerified && (
                                <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-100 flex gap-3 text-xs font-semibold italic">
                                    <CheckCircle className="h-5 w-5 shrink-0" />
                                    This practitioner is verified and visible on the ROZX public platform.
                                </div>
                            )}

                            {isRejected && (
                                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 space-y-2">
                                    <div className="flex gap-3 text-xs font-bold uppercase tracking-wider">
                                        <AlertCircle className="h-5 w-5 shrink-0" />
                                        Profile Rejected
                                    </div>
                                    <p className="text-xs italic pl-8">"{doctor.rejectionReason || doctor.rejection_reason || 'No reason provided'}"</p>
                                    <button
                                        onClick={() => onVerify('verified')}
                                        className="text-[10px] font-black uppercase text-red-600 hover:underline pl-8"
                                    >
                                        Override to Verified
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-foreground">
                                <Power className="h-5 w-5 text-primary" />
                                Account Status & Access
                            </h3>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border">
                                <div className="space-y-1">
                                    <p className="font-bold text-sm">Account: {isActive ? 'Active' : 'Inactive'}</p>
                                    <p className="text-xs text-muted-foreground font-medium italic">
                                        {isActive
                                            ? 'The practitioner profile is active and appearing in search results.'
                                            : 'The account is deactivated. Profile is hidden and bookings are disabled.'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => onToggleStatus(isActive)}
                                    disabled={isActionLoading}
                                    className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${isActive ? 'bg-green-600' : 'bg-muted shadow-inner'}`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${isActive ? 'translate-x-5' : 'translate-x-0'}`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex border-b overflow-x-auto no-scrollbar scroll-smooth">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2.5 px-6 py-4 text-sm font-bold transition-all relative min-w-max ${activeTab === tab.id
                            ? 'text-primary'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-primary' : 'text-muted-foreground opacity-60'}`} />
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full shadow-[0_-2px_6px_rgba(var(--primary),0.4)]" />
                        )}
                    </button>
                ))}
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                {renderTabContent()}
            </div>
        </div>
    );
}

function InfoItem({
    label,
    value,
    direction = 'horizontal',
    className = '',
    link = null,
    icon = null
}: {
    label: string;
    value?: any;
    direction?: 'horizontal' | 'vertical';
    className?: string;
    link?: string | null;
    icon?: React.ReactNode;
}) {
    if (direction === 'vertical') {
        return (
            <div className={className}>
                <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-1">{label}</p>
                <div className="text-sm font-semibold leading-relaxed italic text-foreground opacity-80 border-l-2 border-primary/20 pl-3">
                    {value || <span className="text-muted-foreground opacity-50">Information not provided.</span>}
                </div>
            </div>
        );
    }

    return (
        <div className={`flex justify-between items-start gap-4 p-1 ${className}`}>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-wider shrink-0 pt-0.5">{label}</p>
            <div className="text-sm font-bold flex items-center gap-2 text-right overflow-hidden break-words text-foreground">
                {icon && <span className="text-primary/70 shrink-0">{icon}</span>}
                {link ? (
                    <a href={link.startsWith('http') ? link : `https://${link}`} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate">
                        {value}
                    </a>
                ) : (
                    <span className="truncate">{value || 'N/A'}</span>
                )}
            </div>
        </div>
    );
}
