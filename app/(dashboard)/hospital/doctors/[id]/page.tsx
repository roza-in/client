'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    Calendar, Clock, Star, Phone, Mail, FileText, Languages,
    Briefcase, GraduationCap, BadgeCheck, XCircle, Shield,
    ClipboardList, CalendarDays, MessageSquare, User,
    MapPin, AlertCircle, Award
} from 'lucide-react';
import { LoadingSpinner } from '@/components/shared';
import { useDoctor, useDoctorReviews, useDoctorSchedule } from '@/features/doctors/hooks/use-doctors';
import { useAppointments } from '@/features/appointments/hooks/use-appointments';
import { ScheduleManager } from '@/features/schedules/components/schedule-manager';
import { DoctorSettingsManager } from '@/features/schedules/components/doctor-settings-manager';
import { format } from 'date-fns';

type TabType = 'overview' | 'schedule' | 'appointments' | 'ratings' | 'registration' | 'verification' | 'settings';

export default function HospitalDoctorDetailPage() {
    const params = useParams();
    const doctorId = params.id as string;
    const [activeTab, setActiveTab] = useState<TabType>('overview');

    const { data: doctor, isLoading, error } = useDoctor(doctorId);

    // Fetch data for other tabs
    const { data: scheduleData, isLoading: isLoadingSchedule } = useDoctorSchedule(activeTab === 'schedule' ? doctorId : null);
    const { data: appointmentsData, isLoading: isLoadingAppointments } = useAppointments(
        activeTab === 'appointments' ? { doctorId, limit: 10 } : {}
    );
    const { data: reviewsData, isLoading: isLoadingReviews } = useDoctorReviews(activeTab === 'ratings' ? doctorId : null);

    // Group schedule data by day
    const groupedSchedule = useMemo(() => {
        if (!scheduleData || !Array.isArray(scheduleData)) return {};
        return scheduleData.reduce((acc: any, curr: any) => {
            const day = curr.day_of_week || curr.dayOfWeek;
            if (!acc[day]) acc[day] = [];
            acc[day].push(curr);
            return acc;
        }, {});
    }, [scheduleData]);

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error || !doctor) {
        return (
            <div className="p-6">
                <Link
                    href="/hospital/doctors"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
                >
                    ← Back to doctors
                </Link>
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
                    <h2 className="font-semibold">Doctor not found</h2>
                    <p className="text-sm">The doctor you're looking for doesn't exist or you don't have access.</p>
                </div>
            </div>
        );
    }

    // Handle both snake_case (from API) and camelCase (from interface)
    const doc = doctor as any;
    const doctorName = doc.users?.name || doc.name || 'Unknown Doctor';
    const specialization = doc.specializations?.name || doc.specialization || 'Not specified';
    const imageUrl = doc.profilePictureUrl || doc.profile_picture_url || doc.users?.avatar_url;
    const expYears = doc.experienceYears || doc.experience_years || 0;

    const tabs: { key: TabType; label: string }[] = [
        { key: 'overview', label: 'Overview' },
        { key: 'schedule', label: 'Schedule' },
        { key: 'appointments', label: 'Appointments' },
        { key: 'ratings', label: 'Ratings' },
        { key: 'settings', label: 'Settings' },
        { key: 'registration', label: 'Registration' },
        { key: 'verification', label: 'Verification' },
    ];

    const getStatusBadge = () => {
        const isActive = doc.isActive ?? doc.is_active;
        const vStatus = doc.verificationStatus || doc.verification_status;

        if (isActive) {
            return <span className="rounded-full bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20 px-3 py-1 text-sm font-medium">Active</span>;
        }
        if (vStatus === 'pending') {
            return <span className="rounded-full bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20 px-3 py-1 text-sm font-medium">Pending Verification</span>;
        }
        if (vStatus === 'rejected') {
            return <span className="rounded-full bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20 px-3 py-1 text-sm font-medium">Rejected</span>;
        }
        return <span className="rounded-full bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10 px-3 py-1 text-sm font-medium">Inactive</span>;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={doctorName}
                            className="h-16 w-16 rounded-full object-cover ring-2 ring-background border shadow-sm"
                        />
                    ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-primary/10 text-primary text-xl font-semibold border border-primary/10">
                            {doctorName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold">Dr. {doctorName}</h1>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                            {specialization} • {expYears} years exp
                        </p>
                    </div>
                </div>
                {getStatusBadge()}
            </div>

            {/* Tabs */}
            <div className="border-b">
                <nav className="flex gap-6 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.key
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Overview TabContent */}
            {activeTab === 'overview' && (
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Contact Info */}
                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <h2 className="font-semibold mb-4 text-rose-600 flex items-center gap-2">
                                <Phone className="h-4 w-4" /> Contact Information
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-muted">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Email Address</p>
                                        <p className="text-sm font-medium">{doc.users?.email || doc.email || 'Not provided'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-muted">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Phone Number</p>
                                        <p className="text-sm font-medium">{doc.users?.phone || doc.phone || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Professional Info */}
                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <h2 className="font-semibold mb-4 text-blue-600 flex items-center gap-2">
                                <GraduationCap className="h-4 w-4" /> Professional Details
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-muted">
                                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Qualifications</p>
                                        <p className="text-sm font-medium">{(doc.qualifications || doc.qualification) || 'Not specified'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-muted">
                                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Years of Experience</p>
                                        <p className="text-sm font-medium">{expYears} years</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-muted">
                                        <Languages className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Languages</p>
                                        <p className="text-sm font-medium">{doc.languages?.join(', ') || 'English, Hindi'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bio */}
                        {(doc.bio) && (
                            <div className="rounded-xl border bg-card p-6 shadow-sm">
                                <h2 className="font-semibold mb-4 flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" /> About Doctor
                                </h2>
                                <p className="text-sm text-muted-foreground leading-relaxed italic border-l-4 border-primary/20 pl-4">{doc.bio}</p>
                            </div>
                        )}

                        {/* Consultation Types */}
                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <h2 className="font-semibold mb-4 flex items-center gap-2">
                                <BadgeCheck className="h-4 w-4 text-green-600" /> Consultation Types
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/30">
                                    {(doc.in_person_enabled ?? doc.isAvailableForInPerson) !== false ? (
                                        <BadgeCheck className="h-5 w-5 text-green-600" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-gray-400" />
                                    )}
                                    <span className="text-sm font-medium">In-Person</span>
                                </div>
                                <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/30">
                                    {(doc.online_consultation_enabled ?? doc.isAvailableForOnline) ? (
                                        <BadgeCheck className="h-5 w-5 text-green-600" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-gray-400" />
                                    )}
                                    <span className="text-sm font-medium">Online</span>
                                </div>
                                <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/30">
                                    {(doc.walk_in_enabled) ? (
                                        <BadgeCheck className="h-5 w-5 text-green-600" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-gray-400" />
                                    )}
                                    <span className="text-sm font-medium">Walk-In</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Stats */}
                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <h2 className="font-semibold mb-4">Quick Stats</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-2 border-b border-dashed">
                                    <span className="text-sm text-muted-foreground">Avg Rating</span>
                                    <span className="flex items-center gap-1 font-bold text-lg">
                                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                        {doc.rating?.toFixed(1) || '0.0'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-dashed">
                                    <span className="text-sm text-muted-foreground">Total Reviews</span>
                                    <span className="font-bold">{doc.totalRatings || doc.total_ratings || 0}</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-sm text-muted-foreground">Consultations</span>
                                    <span className="font-bold text-primary">{doc.totalConsultations || doc.total_consultations || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Fees */}
                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <h2 className="font-semibold mb-4">Pricing</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center bg-muted/30 p-2 rounded">
                                    <span className="text-sm text-muted-foreground">In-Person</span>
                                    <span className="font-bold">₹{doc.consultationFeeInPerson || doc.consultation_fee_in_person || 0}</span>
                                </div>
                                <div className="flex justify-between items-center bg-muted/30 p-2 rounded">
                                    <span className="text-sm text-muted-foreground">Online</span>
                                    <span className="font-bold text-blue-600">₹{doc.consultationFeeOnline || doc.consultation_fee_online || 0}</span>
                                </div>
                                <div className="flex justify-between items-center bg-muted/30 p-2 rounded">
                                    <span className="text-sm text-muted-foreground">Walk-In</span>
                                    <span className="font-bold">₹{doc.consultationFeeWalkIn || doc.consultation_fee_walk_in || 0}</span>
                                </div>
                                <div className="pt-2 flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground">Follow-up Fee</span>
                                    <span className="text-sm font-medium">₹{doc.followupFee || doc.follow_up_fee || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Schedule TabContent - Hospital Admin Can Manage */}
            {activeTab === 'schedule' && (
                <ScheduleManager doctorId={doctorId} doctorName={doctorName} />
            )}

            {/* Settings TabContent - Hospital Admin Can Manage */}
            {activeTab === 'settings' && (
                <DoctorSettingsManager doctorId={doctorId} doctorName={doctorName} />
            )}

            {/* Appointments TabContent */}
            {activeTab === 'appointments' && (
                <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                    <div className="p-6 border-b">
                        <h2 className="font-semibold text-lg flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" /> Recent Appointments
                        </h2>
                    </div>
                    {isLoadingAppointments ? (
                        <div className="p-12 text-center"><LoadingSpinner /></div>
                    ) : (appointmentsData && appointmentsData.appointments && appointmentsData.appointments.length > 0) ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-muted/40 border-b">
                                        <th className="px-6 py-3 text-left font-medium text-muted-foreground uppercase tracking-wider text-[10px]">Patient</th>
                                        <th className="px-6 py-3 text-left font-medium text-muted-foreground uppercase tracking-wider text-[10px]">Date</th>
                                        <th className="px-6 py-3 text-left font-medium text-muted-foreground uppercase tracking-wider text-[10px]">Type</th>
                                        <th className="px-6 py-3 text-left font-medium text-muted-foreground uppercase tracking-wider text-[10px]">Status</th>
                                        <th className="px-6 py-3 text-right font-medium text-muted-foreground uppercase tracking-wider text-[10px]">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {appointmentsData.appointments.map((apt: any) => (
                                        <tr key={apt.id} className="hover:bg-muted/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-medium">{apt.patient?.name || 'Unknown'}</p>
                                                <p className="text-xs text-muted-foreground">{apt.patient?.phone}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="whitespace-nowrap">{format(new Date(apt.scheduled_start || apt.scheduledStart), 'MMM dd, yyyy')}</p>
                                                <p className="text-xs text-muted-foreground">{format(new Date(apt.scheduled_start || apt.scheduledStart), 'hh:mm a')}</p>
                                            </td>
                                            <td className="px-6 py-4 capitalize">{(apt.consultation_type || apt.consultationType || '').replace('_', ' ')}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {apt.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold">₹{apt.total_amount || apt.totalAmount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center text-muted-foreground">
                            <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p>No appointments found for this doctor yet.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Ratings TabContent */}
            {activeTab === 'ratings' && (
                <div className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-3">
                        <div className="sm:col-span-1 rounded-xl border bg-card p-6 shadow-sm flex flex-col items-center justify-center text-center">
                            <p className="text-sm text-muted-foreground mb-2">Overall Rating</p>
                            <p className="text-5xl font-black text-primary mb-2">{doc.rating?.toFixed(1) || '0.0'}</p>
                            <div className="flex gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`h-5 w-5 ${star <= Math.round(doc.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground">Based on {doc.totalRatings || doc.total_ratings || 0} reviews</p>
                        </div>

                        <div className="sm:col-span-2 rounded-xl border bg-card p-6 shadow-sm">
                            <h2 className="font-semibold mb-6 flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-primary" /> Patient Reviews
                            </h2>

                            {isLoadingReviews ? (
                                <div className="py-12 flex justify-center"><LoadingSpinner /></div>
                            ) : (reviewsData && reviewsData.reviews && reviewsData.reviews.length > 0) ? (
                                <div className="space-y-6">
                                    {reviewsData.reviews.slice(0, 5).map((review: any) => (
                                        <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                                                        {(review.patient_name || review.patientName)?.[0]?.toUpperCase() || 'P'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold">{review.patient_name || review.patientName || 'Patient Reviewer'}</p>
                                                        <div className="flex gap-0.5">
                                                            {[1, 2, 3, 4, 5].map((s) => (
                                                                <Star key={s} className={`h-3 w-3 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] text-muted-foreground">{format(new Date(review.created_at || review.createdAt), 'MMM dd, yyyy')}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground pl-10 italic">"{review.review || review.comment || 'No comment provided.'}"</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center text-muted-foreground border border-dashed rounded-lg">
                                    <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                    <p className="text-sm">No patient reviews available yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Registration TabContent */}
            {activeTab === 'registration' && (
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <ClipboardList className="h-5 w-5 text-rose-600" />
                        <h2 className="font-semibold text-lg">Registration Details</h2>
                    </div>
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-2 p-4 rounded-xl border bg-muted/10">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Medical License Number</p>
                            <p className="font-black text-xl text-primary">{doc.registrationNumber || doc.registration_number || 'N/A'}</p>
                        </div>
                        <div className="space-y-2 p-4 rounded-xl border bg-muted/10">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">State Medical Council</p>
                            <p className="font-bold text-lg">{doc.registrationCouncil || doc.registration_council || 'N/A'}</p>
                        </div>
                        <div className="space-y-2 p-4 rounded-xl border bg-muted/10">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Year of Registration</p>
                            <p className="font-bold text-lg">{doc.registrationYear || doc.registration_year || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="mt-10 space-y-8">
                        {/* Certifications & Memberships */}
                        <div className="grid gap-8 sm:grid-cols-2">
                            <div className="p-6 rounded-xl border bg-card/50">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <Award className="h-4 w-4 text-amber-500" /> Certifications
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {doc.certifications?.length > 0 ? (
                                        doc.certifications.map((cert: string, i: number) => (
                                            <span key={i} className="bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 px-3 py-1 rounded-full text-xs font-medium">{cert}</span>
                                        ))
                                    ) : (
                                        <p className="text-xs text-muted-foreground">No certifications listed.</p>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 rounded-xl border bg-card/50">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <User className="h-4 w-4 text-blue-500" /> Professional Memberships
                                </h3>
                                <ul className="space-y-2">
                                    {doc.memberships?.length > 0 ? (
                                        doc.memberships.map((mem: string, i: number) => (
                                            <li key={i} className="text-xs flex items-center gap-2">
                                                <div className="h-1 w-1 rounded-full bg-primary" /> {mem}
                                            </li>
                                        ))
                                    ) : (
                                        <p className="text-xs text-muted-foreground">No memberships listed.</p>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* Legal Notice */}
                        <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-100 flex gap-3">
                            <AlertCircle className="h-5 w-5 text-blue-500 shrink-0" />
                            <p className="text-xs text-blue-800">
                                Registration details are verified against official medical council databases. Any changes should be reported immediately.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Verification TabContent */}
            {activeTab === 'verification' && (
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <Shield className="h-5 w-5 text-primary" />
                        <h2 className="font-semibold text-lg">Verification & Internal Status</h2>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="p-5 rounded-2xl border bg-background flex flex-col items-center text-center">
                            <div className={`p-3 rounded-full mb-3 ${(doc.isActive ?? doc.is_active) ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                                {(doc.isActive ?? doc.is_active) ? <BadgeCheck className="h-8 w-8" /> : <XCircle className="h-8 w-8" />}
                            </div>
                            <p className="text-sm font-bold mb-1">Active Status</p>
                            <p className={`text-xs font-medium uppercase tracking-widest ${(doc.isActive ?? doc.is_active) ? 'text-green-600' : 'text-gray-400'}`}>
                                {(doc.isActive ?? doc.is_active) ? 'Enabled' : 'Disabled'}
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl border bg-background flex flex-col items-center text-center">
                            <div className={`p-3 rounded-full mb-3 ${(doc.verificationStatus || doc.verification_status) === 'verified' ? 'bg-green-50 text-green-600' :
                                (doc.verificationStatus || doc.verification_status) === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                                    'bg-red-50 text-red-600'
                                }`}>
                                {(doc.verificationStatus || doc.verification_status) === 'verified' ? <Shield className="h-8 w-8" /> :
                                    (doc.verificationStatus || doc.verification_status) === 'pending' ? <Clock className="h-8 w-8" /> :
                                        <AlertCircle className="h-8 w-8" />}
                            </div>
                            <p className="text-sm font-bold mb-1">Verification</p>
                            <p className={`text-xs font-medium uppercase tracking-widest ${(doc.verificationStatus || doc.verification_status) === 'verified' ? 'text-green-600' :
                                (doc.verificationStatus || doc.verification_status) === 'pending' ? 'text-yellow-600' :
                                    'text-red-600'
                                }`}>
                                {doc.verificationStatus || doc.verification_status}
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl border bg-background flex flex-col items-center text-center">
                            <div className={`p-3 rounded-full mb-3 ${(doc.isAcceptingAppointments ?? doc.is_accepting_appointments) ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                                <Calendar className="h-8 w-8" />
                            </div>
                            <p className="text-sm font-bold mb-1">Availability</p>
                            <p className={`text-xs font-medium uppercase tracking-widest ${(doc.isAcceptingAppointments ?? doc.is_accepting_appointments) ? 'text-green-600' : 'text-gray-400'}`}>
                                {(doc.isAcceptingAppointments ?? doc.is_accepting_appointments) ? 'Available' : 'Busy/Away'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 border-t pt-8">
                        <div className="rounded-xl border overflow-hidden">
                            <div className="bg-muted/30 px-6 py-4 border-b">
                                <h3 className="font-bold text-sm">Verification Timeline</h3>
                            </div>
                            <div className="px-6 py-4 space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /> Account Created</span>
                                    <span className="font-medium">{(doc.createdAt || doc.created_at) ? format(new Date(doc.createdAt || doc.created_at), 'MMMM dd, yyyy') : '—'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500" /> Last Profile Sync</span>
                                    <span className="font-medium">{(doc.updatedAt || doc.updated_at) ? format(new Date(doc.updatedAt || doc.updated_at), 'MMMM dd, yyyy') : '—'}</span>
                                </div>
                                {(doc.verifiedAt || doc.verified_at) && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /> Verification Date</span>
                                        <span className="font-medium">{format(new Date(doc.verifiedAt || doc.verified_at), 'MMMM dd, yyyy')}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {(doc.rejectionReason || doc.rejection_reason) && (
                            <div className="mt-6 p-4 rounded-2xl bg-red-50 border-2 border-red-100 flex gap-4">
                                <div className="p-2 h-fit bg-red-100 rounded-full text-red-600">
                                    <AlertCircle className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-black text-red-900 text-sm">REJECTION NOTICE</p>
                                    <p className="text-sm text-red-700 leading-relaxed mt-1 font-medium">{doc.rejectionReason || doc.rejection_reason}</p>
                                    <p className="text-xs text-red-500 mt-2 italic">* Contact support for appeal processing.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
