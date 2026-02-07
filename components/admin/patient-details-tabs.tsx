'use client';

import React, { useState } from 'react';
import {
    Info,
    Activity,
    Users,
    Calendar,
    Settings,
    User,
    Mail,
    Phone,
    MapPin,
    AlertCircle,
    CheckCircle,
    Clock,
    UserCircle,
    Shield,
    Trash2,
    Power
} from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface PatientDetailsTabsProps {
    patient: any;
    onToggleStatus: (isActive: boolean) => void;
    onDelete: () => void;
    isActionLoading: boolean;
}

export function PatientDetailsTabs({
    patient,
    onToggleStatus,
    onDelete,
    isActionLoading
}: PatientDetailsTabsProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'medical' | 'family' | 'settings'>('overview');

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Info },
        { id: 'medical', label: 'Medical Info', icon: Activity },
        { id: 'family', label: 'Family Members', icon: Users },
        { id: 'settings', label: 'Account & Safety', icon: Settings },
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
                                        Personal Profile
                                    </h3>
                                    <div className="space-y-4">
                                        <InfoItem label="Full Name" value={patient.name} />
                                        <InfoItem label="Email" value={patient.email} icon={<Mail className="h-4 w-4" />} />
                                        <InfoItem label="Phone" value={patient.phone} icon={<Phone className="h-4 w-4" />} />
                                        <InfoItem label="Gender" value={patient.gender} className="capitalize" />
                                        <InfoItem label="Blood Group" value={patient.blood_group} />
                                        <InfoItem label="Date of Birth" value={patient.date_of_birth ? format(new Date(patient.date_of_birth), 'PPP') : 'N/A'} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="rounded-xl border bg-card p-6 shadow-sm">
                                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-foreground">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        Contact Address
                                    </h3>
                                    <div className="space-y-4">
                                        <InfoItem label="Address" value={patient.address?.address} direction="vertical" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <InfoItem label="City" value={patient.address?.city} />
                                            <InfoItem label="State" value={patient.address?.state} />
                                        </div>
                                        <InfoItem label="Pincode" value={patient.address?.pincode} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'medical':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="rounded-xl border bg-card p-6 shadow-sm">
                                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-foreground">
                                    <Shield className="h-4 w-4 text-blue-500" />
                                    Allergies
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {patient.allergies?.length > 0 ? patient.allergies.map((allergy: string) => (
                                        <Badge key={allergy} variant="destructive" className="px-3 py-1 font-bold uppercase tracking-widest text-[10px]">
                                            {allergy}
                                        </Badge>
                                    )) : (
                                        <p className="text-sm text-muted-foreground italic font-medium opacity-60">No known allergies reported.</p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-xl border bg-card p-6 shadow-sm">
                                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-foreground">
                                    <Activity className="h-4 w-4 text-red-500" />
                                    Medical Conditions
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {patient.medical_conditions?.length > 0 ? patient.medical_conditions.map((condition: string) => (
                                        <Badge key={condition} variant="outline" className="px-3 py-1 font-bold uppercase tracking-widest text-[10px] bg-red-50 text-red-700 border-red-100">
                                            {condition}
                                        </Badge>
                                    )) : (
                                        <p className="text-sm text-muted-foreground italic font-medium opacity-60">No chronic medical conditions listed.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'family':
                return (
                    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-muted/20">
                            <div>
                                <h3 className="font-semibold text-foreground">Registered Family Members</h3>
                                <p className="text-sm text-muted-foreground">List of members managed under this patient's primary account</p>
                            </div>
                            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                                {patient.family_members?.length || 0} Total
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left font-medium">
                                <thead className="text-xs uppercase bg-muted/30 text-muted-foreground font-semibold">
                                    <tr>
                                        <th className="px-6 py-3">Member Name</th>
                                        <th className="px-6 py-3">Relationship</th>
                                        <th className="px-6 py-3 text-center">Gender</th>
                                        <th className="px-6 py-3 text-center">Blood Group</th>
                                        <th className="px-6 py-3 text-right">Age</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {patient.family_members?.length > 0 ? patient.family_members.map((member: any) => (
                                        <tr key={member.id} className="hover:bg-muted/10 transition-colors">
                                            <td className="px-6 py-4">{member.name}</td>
                                            <td className="px-6 py-4 capitalize">{member.relationship}</td>
                                            <td className="px-6 py-4 text-center capitalize">{member.gender || '—'}</td>
                                            <td className="px-6 py-4 text-center">{member.blood_group || '—'}</td>
                                            <td className="px-6 py-4 text-right">
                                                {member.date_of_birth ? Math.floor((new Date().getTime() - new Date(member.date_of_birth).getTime()) / 31557600000) : '—'}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic">
                                                No family members registered yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'settings':
                return (
                    <div className="space-y-6 max-w-2xl">
                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-foreground">
                                <Power className="h-5 w-5 text-primary" />
                                Platform Access
                            </h3>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border">
                                <div className="space-y-1">
                                    <p className="font-bold text-sm">Status: {patient.is_active ? 'Active' : 'Account Suspended'}</p>
                                    <p className="text-xs text-muted-foreground font-medium italic">
                                        {patient.is_active
                                            ? 'The patient can login and book consultations normally.'
                                            : 'The patient has been restricted from accessing the platform.'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => onToggleStatus(patient.is_active)}
                                    disabled={isActionLoading}
                                    className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${patient.is_active ? 'bg-green-600' : 'bg-muted shadow-inner'}`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${patient.is_active ? 'translate-x-5' : 'translate-x-0'}`}
                                    />
                                </button>
                            </div>
                        </div>

                        <div className="rounded-xl border bg-card p-6 shadow-sm border-red-100 bg-red-50/20">
                            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2 text-red-600">
                                <Trash2 className="h-5 w-5" />
                                Danger Zone
                            </h3>
                            <p className="text-xs text-muted-foreground mb-6 font-medium">
                                Permanently deleting this account will remove all patient health records, family profiles, and consultation history. This action cannot be undone.
                            </p>
                            <button
                                onClick={onDelete}
                                className="w-full py-3 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-100 active:scale-[0.98]"
                            >
                                <AlertCircle className="h-4 w-4" />
                                Delete Account Permanently
                            </button>
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
    icon = null
}: {
    label: string;
    value?: any;
    direction?: 'horizontal' | 'vertical';
    className?: string;
    icon?: React.ReactNode;
}) {
    if (direction === 'vertical') {
        return (
            <div className={className}>
                <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-1">{label}</p>
                <div className="text-sm font-medium leading-relaxed text-foreground opacity-80 border-l-2 border-primary/20 pl-3 italic">
                    {value || <span className="text-muted-foreground opacity-50 font-normal">Information not provided.</span>}
                </div>
            </div>
        );
    }

    return (
        <div className={`flex justify-between items-start gap-4 p-1 ${className}`}>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-wider shrink-0 pt-0.5">{label}</p>
            <div className="text-sm font-bold flex items-center gap-2 text-right overflow-hidden break-words text-foreground">
                {icon && <span className="text-primary/70 shrink-0">{icon}</span>}
                <span className="truncate">{value || 'N/A'}</span>
            </div>
        </div>
    );
}
