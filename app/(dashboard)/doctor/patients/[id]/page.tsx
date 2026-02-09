'use client';

import { use } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Calendar,
    ClipboardList,
    Phone,
    User,
    Mail,
    Heart,
    AlertTriangle,
    Activity,
    Video,
    Users,
    CheckCircle2,
    Clock,
    FileText,
    Pill,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import { useAppointments } from '@/features/appointments';
import { LoadingSpinner, EmptyState } from '@/components/shared';
import type { AppointmentListItem } from '@/types';

// =============================================================================
// Types
// =============================================================================

interface PageProps {
    params: Promise<{ id: string }>;
}

// =============================================================================
// Status Badge Component
// =============================================================================

function StatusBadge({ status }: { status: string }) {
    const config: Record<string, { bg: string; text: string }> = {
        completed: { bg: 'bg-green-100', text: 'text-green-700' },
        cancelled: { bg: 'bg-red-100', text: 'text-red-700' },
        no_show: { bg: 'bg-slate-100', text: 'text-slate-600' },
        confirmed: { bg: 'bg-blue-100', text: 'text-blue-700' },
    };
    const c = config[status] || { bg: 'bg-slate-100', text: 'text-slate-600' };

    return (
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${c.bg} ${c.text}`}>
            {status.replace('_', ' ')}
        </span>
    );
}

// =============================================================================
// Consultation Card Component
// =============================================================================

function ConsultationCard({ appointment }: { appointment: AppointmentListItem }) {
    const isVideo = appointment.consultationType === 'online';
    const appointmentDate = new Date(appointment.appointmentDate);

    return (
        <Link
            href={`/doctor/appointments/${appointment.id}`}
            className="block rounded-xl border bg-card p-5 hover:shadow-md hover:border-primary/30 transition-all group"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    {/* Date & Status */}
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span className="font-medium text-slate-700">
                                {format(appointmentDate, 'MMM d, yyyy')}
                            </span>
                            <span>•</span>
                            <span>{appointment.startTime}</span>
                        </div>
                        <StatusBadge status={appointment.status} />
                    </div>

                    {/* Symptoms/Complaint */}
                    <div className="mt-2">
                        {appointment.symptoms && appointment.symptoms.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mt-1">
                                {appointment.symptoms.slice(0, 3).map((symptom, idx) => (
                                    <span
                                        key={idx}
                                        className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                                    >
                                        {symptom}
                                    </span>
                                ))}
                                {appointment.symptoms.length > 3 && (
                                    <span className="text-xs text-muted-foreground">
                                        +{appointment.symptoms.length - 3} more
                                    </span>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">No symptoms recorded</p>
                        )}
                    </div>

                    {/* Type */}
                    <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
                        {isVideo ? (
                            <span className="flex items-center gap-1">
                                <Video className="h-3.5 w-3.5 text-primary" />
                                Video Consultation
                            </span>
                        ) : (
                            <span className="flex items-center gap-1">
                                <Users className="h-3.5 w-3.5 text-green-500" />
                                In-Person Visit
                            </span>
                        )}
                        {appointment.hospitalName && (
                            <span className="text-slate-500">• {appointment.hospitalName}</span>
                        )}
                    </div>
                </div>

                {/* Prescription Link */}
                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                        View Details →
                    </span>
                </div>
            </div>
        </Link>
    );
}

// =============================================================================
// Main Page Component
// =============================================================================

export default function PatientHistoryPage({ params }: PageProps) {
    const { id } = use(params);
    const { user } = useAuth();
    const doctorId = user?.doctor?.id;

    // Fetch all appointments with this patient
    // Since we derive patients from appointments, we need to fetch appointments
    // and filter by the patient name matching
    const { data, isLoading } = useAppointments({
        doctorId: doctorId || undefined,
        limit: 50,
    });

    // Get the specific patient's appointments
    // In a real implementation, you would fetch by patient ID
    const patientAppointments = data?.appointments?.filter((apt, _idx, arr) => {
        // For now, we use the first matching name as our patient
        return apt.id === id || apt.patientName === arr.find((a) => a.id === id)?.patientName;
    }).sort((a, b) =>
        new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
    ) || [];

    // Get patient info from the first appointment
    const patient = patientAppointments[0];

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <Link
                    href="/doctor/patients"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to patients
                </Link>
                <EmptyState
                    icon={User}
                    title="Patient not found"
                    description="The patient you're looking for doesn't exist or has no consultation history."
                />
            </div>
        );
    }

    // Stats
    const totalVisits = patientAppointments.length;
    const completedVisits = patientAppointments.filter((a) => a.status === 'completed').length;
    const lastVisit = patientAppointments[0];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Back Button */}
            <Link
                href="/doctor/patients"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to patients
            </Link>

            {/* Patient Info Card */}
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Avatar */}
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-primary/5 text-2xl font-bold text-primary shrink-0">
                        {(patient.patientName || 'P').charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-slate-900">{patient.patientName || 'Patient'}</h1>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1.5">
                                <Activity className="h-4 w-4 text-green-500" />
                                {totalVisits} visits
                            </span>
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-4 w-4 text-blue-500" />
                                {completedVisits} completed
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                Last visit: {formatDistanceToNow(new Date(lastVisit.appointmentDate), { addSuffix: true })}
                            </span>
                        </div>

                        {/* Booking Info */}
                        {lastVisit.hospitalName && (
                            <div className="mt-4 pt-4 border-t">
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-medium text-slate-600">Primary Hospital:</span>{' '}
                                    {lastVisit.hospitalName}
                                    {lastVisit.hospitalCity && `, ${lastVisit.hospitalCity}`}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3 md:gap-4 shrink-0">
                        <div className="bg-slate-50 rounded-xl p-4 text-center border">
                            <p className="text-2xl font-bold text-slate-900">{totalVisits}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Visits</p>
                        </div>
                        <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
                            <p className="text-2xl font-bold text-green-600">{completedVisits}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Completed</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Consultation History */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Consultation History
                    </h2>
                    <span className="text-sm text-muted-foreground">
                        {patientAppointments.length} records
                    </span>
                </div>

                {patientAppointments.length > 0 ? (
                    <div className="space-y-3">
                        {patientAppointments.map((appointment) => (
                            <ConsultationCard key={appointment.id} appointment={appointment} />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={Calendar}
                        title="No consultations"
                        description="No consultation history found for this patient."
                    />
                )}
            </div>
        </div>
    );
}
