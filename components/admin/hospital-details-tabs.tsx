'use client';

import React, { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    Calendar,
    ShieldCheck,
    Info,
    Phone,
    Mail,
    MapPin,
    ExternalLink,
    Clock,
    UserCheck,
    AlertCircle,
    FileText,
    CreditCard,
    Power
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { DataTable } from '@/components/shared';

interface HospitalDetailsTabsProps {
    hospital: any;
    doctors: any[];
    appointments: any[];
    onVerify: (status: 'verified' | 'rejected' | 'under_review', remarks?: string) => void;
    onToggleStatus: (is_active: boolean) => void;
    isActionLoading: boolean;
}

export function HospitalDetailsTabs({
    hospital,
    doctors,
    appointments,
    onVerify,
    onToggleStatus,
    isActionLoading
}: HospitalDetailsTabsProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'registration' | 'doctors' | 'appointments' | 'verification'>('overview');
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectionForm, setShowRejectionForm] = useState(false);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Info },
        { id: 'registration', label: 'Registration', icon: FileText },
        { id: 'doctors', label: 'Doctors', icon: Users },
        { id: 'appointments', label: 'Appointments', icon: Calendar },
        { id: 'verification', label: 'Verification', icon: ShieldCheck },
    ] as const;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-6">
                                <div className="rounded-xl border bg-card p-6 shadow-sm">
                                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                        <Info className="h-4 w-4 text-primary" />
                                        Hospital Profile
                                    </h3>
                                    <div className="space-y-4">
                                        <InfoItem label="Hospital Type" value={hospital.type?.replace('_', ' ')} className="capitalize" />
                                        <InfoItem label="Founded Year" value={hospital.founding_year} />
                                        <InfoItem label="Description" value={hospital.description} direction="vertical" />
                                    </div>
                                </div>

                                <div className="rounded-xl border bg-card p-6 shadow-sm">
                                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        Location & Address
                                    </h3>
                                    <div className="space-y-4">
                                        <InfoItem label="Address" value={hospital.address} direction="vertical" />
                                        <InfoItem label="Landmark" value={hospital.landmark} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <InfoItem label="City" value={hospital.city} />
                                            <InfoItem label="State" value={hospital.state} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <InfoItem label="Pincode" value={hospital.pincode} />
                                            <InfoItem label="Country" value={hospital.country} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="rounded-xl border bg-card p-6 shadow-sm">
                                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-primary" />
                                        Contact Information
                                    </h3>
                                    <div className="space-y-4">
                                        <InfoItem
                                            label="Public Email"
                                            value={hospital.email}
                                            icon={<Mail className="h-4 w-4" />}
                                        />
                                        <InfoItem
                                            label="Public Phone"
                                            value={hospital.phone}
                                            icon={<Phone className="h-4 w-4" />}
                                        />
                                        <InfoItem
                                            label="Website"
                                            value={hospital.website}
                                            link={hospital.website}
                                            icon={<ExternalLink className="h-4 w-4" />}
                                        />
                                    </div>
                                </div>

                                <div className="rounded-xl border bg-card p-6 shadow-sm">
                                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                        <UserCheck className="h-4 w-4 text-primary" />
                                        Administrator Details
                                    </h3>
                                    {hospital.admin ? (
                                        <div className="space-y-4">
                                            <InfoItem label="Admin Name" value={hospital.admin.name} />
                                            <InfoItem label="Admin Email" value={hospital.admin.email} />
                                            <InfoItem label="Admin Phone" value={hospital.admin.phone} />
                                            <div className="pt-2">
                                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${hospital.admin.is_active ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                                                    }`}>
                                                    {hospital.admin.is_active ? 'Active Account' : 'Inactive Account'}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">No administrator details found.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'registration':
                return (
                    <div className="space-y-6 max-w-2xl">
                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Registration & Compliance
                            </h3>
                            <div className="space-y-6">
                                <div className="p-4 rounded-2xl bg-muted/30 border space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <ShieldCheck className="h-3 w-3" />
                                        Official Registration
                                    </h4>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex justify-between items-center p-3 rounded-xl bg-background border shadow-xs">
                                            <span className="text-sm font-medium text-muted-foreground">Registration Number</span>
                                            <span className="text-sm font-black text-foreground">{hospital.registration_number || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-muted/30 border space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <CreditCard className="h-3 w-3" />
                                        Tax Information
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1 p-3 rounded-xl bg-background border shadow-xs">
                                            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">GSTIN</span>
                                            <span className="text-sm font-black text-foreground">{hospital.gstin || 'N/A'}</span>
                                        </div>
                                        <div className="flex flex-col gap-1 p-3 rounded-xl bg-background border shadow-xs">
                                            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">PAN</span>
                                            <span className="text-sm font-black text-foreground">{hospital.pan || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-3">
                                    <div className="flex items-center gap-2 text-primary">
                                        <AlertCircle className="h-4 w-4" />
                                        <span className="text-xs font-bold">Verification Note</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Please ensure these details match the uploaded registration documents in the verification tab.
                                        Incorrect registration data may lead to application rejection.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'doctors':
                return (
                    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-muted/20">
                            <div>
                                <h3 className="font-semibold">Associated Doctors</h3>
                                <p className="text-sm text-muted-foreground">List of all doctors registered under this hospital</p>
                            </div>
                            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                                {doctors.length} Total
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-muted/30 text-muted-foreground font-semibold">
                                    <tr>
                                        <th className="px-6 py-3">Doctor</th>
                                        <th className="px-6 py-3">Specialization</th>
                                        <th className="px-6 py-3">Rating</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3 text-right">Registered</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {doctors.length > 0 ? doctors.map((doctor) => (
                                        <tr key={doctor.id} className="hover:bg-muted/10 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center font-bold text-xs">
                                                        {doctor.users?.name?.charAt(0) || doctor.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{doctor.users?.name || doctor.name}</p>
                                                        <p className="text-xs text-muted-foreground">{doctor.users?.email || doctor.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">{doctor.specialization || 'General'}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-yellow-500">★</span>
                                                    <span>{doctor.rating || '0'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${doctor.verification_status === 'verified'
                                                    ? 'bg-green-50 text-green-600 border-green-100'
                                                    : 'bg-yellow-50 text-yellow-600 border-yellow-100'
                                                    }`}>
                                                    {doctor.verification_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-muted-foreground">
                                                {format(new Date(doctor.created_at), 'MMM d, yyyy')}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground italic">
                                                No doctors found associated with this hospital.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'appointments':
                return (
                    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-muted/20">
                            <div>
                                <h3 className="font-semibold">Recent Appointments</h3>
                                <p className="text-sm text-muted-foreground">Latest appointments processed through this hospital</p>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-muted/30 text-muted-foreground font-semibold">
                                    <tr>
                                        <th className="px-6 py-3">Patient</th>
                                        <th className="px-6 py-3">Doctor</th>
                                        <th className="px-6 py-3">Date & Time</th>
                                        <th className="px-6 py-3">Type</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {appointments.length > 0 ? appointments.map((apt) => (
                                        <tr key={apt.id} className="hover:bg-muted/10 transition-colors">
                                            <td className="px-6 py-4 font-medium">{apt.patient?.name || 'N/A'}</td>
                                            <td className="px-6 py-4">{apt.doctor?.users?.name || 'N/A'}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span>{format(new Date(apt.appointment_date), 'PP')}</span>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Clock className="h-3 w-3" /> {apt.start_time}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 capitalize">{apt.type || 'In-Person'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${apt.status === 'completed'
                                                    ? 'bg-green-50 text-green-600 border-green-100'
                                                    : apt.status === 'cancelled'
                                                        ? 'bg-red-50 text-red-600 border-red-100'
                                                        : 'bg-blue-50 text-blue-600 border-blue-100'
                                                    }`}>
                                                    {apt.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-semibold">
                                                ₹{apt.total_amount || '0'}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground italic">
                                                No recent appointments found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'verification':
                return (
                    <div className="space-y-6 max-w-2xl">
                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <Power className="h-5 w-5 text-primary" />
                                Operational Status
                            </h3>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border">
                                <div className="space-y-1">
                                    <p className="font-bold text-sm">Status: {hospital.is_active ? 'Active' : 'Inactive'}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {hospital.is_active
                                            ? 'Hospital is visible and accepts appointments.'
                                            : 'Hospital is hidden and cannot accept new appointments.'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => onToggleStatus(!hospital.is_active)}
                                    disabled={isActionLoading}
                                    className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${hospital.is_active ? 'bg-green-600' : 'bg-muted'}`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${hospital.is_active ? 'translate-x-5' : 'translate-x-0'}`}
                                    />
                                </button>
                            </div>
                        </div>

                        <div className="rounded-xl border bg-card p-6 shadow-sm border-l-4 border-l-primary">
                            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-primary" />
                                Current Verification Status
                            </h3>
                            <div className="flex items-center gap-4 mb-4">
                                <span className={`rounded-full px-4 py-1 text-sm font-bold border ${hospital.verification_status === 'verified'
                                    ? 'bg-green-100 text-green-700 border-green-200'
                                    : hospital.verification_status === 'pending'
                                        ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                        : hospital.verification_status === 'under_review'
                                            ? 'bg-blue-100 text-blue-700 border-blue-200'
                                            : 'bg-red-100 text-red-700 border-red-200'
                                    } uppercase tracking-wide`}>
                                    {hospital.verification_status?.replace('_', ' ')}
                                </span>
                                {hospital.verified_at && (
                                    <p className="text-sm text-muted-foreground italic">
                                        Actioned on {format(new Date(hospital.verified_at), 'PPP')}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-primary" />
                                Take Action
                            </h3>
                            <p className="text-sm text-muted-foreground mb-6">
                                Please review all associated documents and basic information before verifying this hospital.
                                Once verified, the hospital and its doctors will be visible on the public platform.
                            </p>

                            <div className="space-y-4">
                                {!showRejectionForm ? (
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button
                                            onClick={() => onVerify('verified')}
                                            disabled={isActionLoading || hospital.verification_status === 'verified'}
                                            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-95 shadow-md"
                                        >
                                            {isActionLoading ? <Clock className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                                            Approve Hospital
                                        </button>
                                        <button
                                            onClick={() => setShowRejectionForm(true)}
                                            disabled={isActionLoading || hospital.verification_status === 'rejected'}
                                            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white border-2 border-red-100 px-6 py-3 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50 transition-all hover:border-red-200 active:scale-95"
                                        >
                                            <AlertCircle className="h-4 w-4" />
                                            Reject Request
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-foreground">Reason for Rejection</label>
                                            <textarea
                                                value={rejectionReason}
                                                onChange={(e) => setRejectionReason(e.target.value)}
                                                placeholder="Please provide a clear reason for rejecting this verification request..."
                                                className="w-full min-h-[120px] rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                            />
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => {
                                                    if (!rejectionReason.trim()) {
                                                        toast.error('Please provide a reason for rejection');
                                                        return;
                                                    }
                                                    onVerify('rejected', rejectionReason);
                                                }}
                                                disabled={isActionLoading}
                                                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                                            >
                                                {isActionLoading ? <Clock className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                                                Confirm Rejection
                                            </button>
                                            <button
                                                onClick={() => setShowRejectionForm(false)}
                                                disabled={isActionLoading}
                                                className="px-6 py-3 border font-bold rounded-xl hover:bg-muted/50 transition-all"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <p className="text-[10px] text-center text-muted-foreground italic">
                                    * {showRejectionForm ? 'Providing a detailed reason helps the hospital correct their information.' : 'Rejection will notify the hospital administrator to review their profile details.'}
                                </p>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex border-b overflow-x-auto no-scrollbar scroll-smooth">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all relative min-w-max ${activeTab === tab.id
                            ? 'text-primary'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-primary' : 'text-muted-foreground'}`} />
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full shadow-[0_-2px_4px_rgba(var(--primary),0.3)]" />
                        )}
                    </button>
                ))}
            </div>

            <div className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
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
                <p className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-1">{label}</p>
                <div className="text-sm font-medium leading-relaxed">
                    {value || <span className="text-muted-foreground italic">Not provided</span>}
                </div>
            </div>
        );
    }

    return (
        <div className={`flex justify-between items-start gap-4 ${className}`}>
            <p className="text-xs text-muted-foreground font-medium shrink-0 pt-0.5">{label}</p>
            <div className="text-sm font-semibold flex items-center gap-1.5 text-right overflow-hidden wrap-break-word">
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
