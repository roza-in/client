'use client';

import { use } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Video,
    Phone,
    Calendar,
    Clock,
    User,
    FileText,
    ClipboardList,
    MapPin,
    AlertTriangle,
    Heart,
    Thermometer,
    Activity,
    CheckCircle2,
    XCircle,
    Play,
    MessageSquare,
    Stethoscope,
} from 'lucide-react';
import { format } from 'date-fns';
import { useAppointment } from '@/features/appointments/hooks/use-appointments';
import { LoadingSpinner, EmptyState } from '@/components/shared';

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
    const config: Record<string, { bg: string; text: string; label: string }> = {
        confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Confirmed' },
        checked_in: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Checked In' },
        in_progress: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'In Progress' },
        completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
        cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' },
        no_show: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'No Show' },
        pending_payment: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Pending Payment' },
    };

    const c = config[status] || { bg: 'bg-slate-100', text: 'text-slate-700', label: status };

    return (
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${c.bg} ${c.text}`}>
            {c.label}
        </span>
    );
}

// =============================================================================
// Vital Card Component
// =============================================================================

function VitalCard({
    icon: Icon,
    label,
    value,
    unit,
    color = 'slate',
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string | number | null | undefined;
    unit: string;
    color?: 'slate' | 'red' | 'green' | 'amber' | 'blue';
}) {
    const colorClasses = {
        slate: 'bg-slate-50 border-slate-100 text-slate-600',
        red: 'bg-red-50 border-red-100 text-red-600',
        green: 'bg-green-50 border-green-100 text-green-600',
        amber: 'bg-amber-50 border-amber-100 text-amber-600',
        blue: 'bg-blue-50 border-blue-100 text-blue-600',
    };

    return (
        <div className={`rounded-xl p-4 border ${colorClasses[color]}`}>
            <div className="flex items-center gap-2 mb-2">
                <Icon className="h-4 w-4 opacity-60" />
                <span className="text-xs font-medium uppercase tracking-wider opacity-70">{label}</span>
            </div>
            <div className="text-xl font-bold text-slate-900">
                {value ?? '-'}
                <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>
            </div>
        </div>
    );
}

// =============================================================================
// Info Row Component
// =============================================================================

function InfoRow({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="flex items-start gap-3 py-3 border-b last:border-b-0">
            <Icon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">{value || '-'}</p>
            </div>
        </div>
    );
}

// =============================================================================
// Main Page Component
// =============================================================================

export default function DoctorAppointmentDetailPage({ params }: PageProps) {
    const { id } = use(params);

    // Fetch appointment data
    const { data: appointment, isLoading, error } = useAppointment(id);

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error || !appointment) {
        return (
            <div className="p-6">
                <Link
                    href="/doctor/appointments"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to appointments
                </Link>
                <EmptyState
                    icon={AlertTriangle}
                    title="Appointment not found"
                    description="The appointment you're looking for doesn't exist or you don't have access to it."
                />
            </div>
        );
    }

    const isVideo = appointment.consultationType === 'online';
    const canStart = isVideo && (appointment.status === 'confirmed' || appointment.status === 'checked_in');
    const isCompleted = appointment.status === 'completed';
    const appointmentDate = new Date(appointment.appointmentDate);

    // Parse vitals if available
    const vitals = appointment.vitals || {};

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Back Button */}
            <Link
                href="/doctor/appointments"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to appointments
            </Link>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-2xl font-bold text-slate-900">Consultation</h1>
                        <StatusBadge status={appointment.status} />
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Booking ID: <span className="font-mono font-medium">{appointment.bookingId}</span>
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 flex-wrap">
                    {canStart && (
                        <Link
                            href={`/consultation/${appointment.id}`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors shadow-sm"
                        >
                            <Play className="h-4 w-4 fill-current" />
                            Start Consultation
                        </Link>
                    )}
                    {!isCompleted && (
                        <Link
                            href={`/doctor/appointments/${id}/prescription`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border font-semibold hover:bg-muted transition-colors"
                        >
                            <ClipboardList className="h-4 w-4" />
                            Write Prescription
                        </Link>
                    )}
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Patient Information Card */}
                    <div className="rounded-2xl border bg-card p-6 shadow-sm">
                        <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            Patient Information
                        </h2>

                        <div className="flex gap-5">
                            {/* Avatar */}
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-primary/5 text-2xl font-bold text-primary shrink-0">
                                {(appointment.patientName || 'P').charAt(0).toUpperCase()}
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-slate-900">{appointment.patientName || 'Patient'}</h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1 flex-wrap">
                                    {appointment.patientAge && (
                                        <span>{appointment.patientAge} years</span>
                                    )}
                                    {appointment.patientGender && (
                                        <span className="capitalize">{appointment.patientGender}</span>
                                    )}
                                    {appointment.patientPhone && (
                                        <span className="flex items-center gap-1">
                                            <Phone className="h-3.5 w-3.5" />
                                            {appointment.patientPhone}
                                        </span>
                                    )}
                                </div>

                                {/* Follow-up Badge */}
                                {appointment.isFollowup && (
                                    <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Follow-up Visit
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Allergies Warning */}
                        {appointment.patient?.allergies && appointment.patient.allergies.length > 0 && (
                            <div className="mt-4 rounded-lg bg-red-50 dark:bg-red-950/30 p-3 border border-red-200">
                                <p className="text-sm font-medium text-red-700 dark:text-red-400 flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4" />
                                    Allergies: {appointment.patient.allergies}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Chief Complaint */}
                    <div className="rounded-2xl border bg-card p-6 shadow-sm">
                        <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Stethoscope className="h-5 w-5 text-primary" />
                            Chief Complaint
                        </h2>

                        <p className="text-slate-700">
                            {appointment.chiefComplaint || (
                                <span className="text-muted-foreground italic">No complaint recorded</span>
                            )}
                        </p>

                        {appointment.symptoms && appointment.symptoms.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm text-muted-foreground mb-2">Symptoms:</p>
                                <div className="flex flex-wrap gap-2">
                                    {appointment.symptoms.map((symptom, idx) => (
                                        <span
                                            key={idx}
                                            className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700"
                                        >
                                            {symptom}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Vitals */}
                    <div className="rounded-2xl border bg-card p-6 shadow-sm">
                        <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Activity className="h-5 w-5 text-primary" />
                            Vitals
                            <span className="text-xs font-normal text-muted-foreground ml-2">(Self-reported)</span>
                        </h2>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <VitalCard
                                icon={Heart}
                                label="Blood Pressure"
                                value={
                                    vitals.bloodPressureSystolic && vitals.bloodPressureDiastolic
                                        ? `${vitals.bloodPressureSystolic}/${vitals.bloodPressureDiastolic}`
                                        : null
                                }
                                unit="mmHg"
                                color="red"
                            />
                            <VitalCard
                                icon={Activity}
                                label="Heart Rate"
                                value={vitals.heartRate}
                                unit="bpm"
                                color="amber"
                            />
                            <VitalCard
                                icon={Thermometer}
                                label="Temperature"
                                value={vitals.temperature}
                                unit="°F"
                                color="blue"
                            />
                            <VitalCard
                                icon={User}
                                label="Weight"
                                value={vitals.weight}
                                unit="kg"
                                color="green"
                            />
                        </div>
                    </div>

                    {/* Diagnosis & Notes (if completed) */}
                    {isCompleted && appointment.diagnosis && (
                        <div className="rounded-2xl border bg-card p-6 shadow-sm">
                            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Diagnosis & Notes
                            </h2>

                            <div className="space-y-4">
                                {appointment.diagnosis && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Diagnosis</p>
                                        <p className="text-slate-700">{appointment.diagnosis}</p>
                                    </div>
                                )}
                                {appointment.consultationNotes && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Consultation Notes</p>
                                        <p className="text-slate-700">{appointment.consultationNotes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Appointment Details Card */}
                    <div className="rounded-2xl border bg-card p-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4">Appointment Details</h3>

                        <div className="space-y-1">
                            <InfoRow
                                icon={Calendar}
                                label="Date"
                                value={format(appointmentDate, 'EEEE, MMMM d, yyyy')}
                            />
                            <InfoRow
                                icon={Clock}
                                label="Time"
                                value={`${appointment.startTime} - ${appointment.endTime}`}
                            />
                            <InfoRow
                                icon={isVideo ? Video : MapPin}
                                label="Type"
                                value={
                                    <span className="capitalize">
                                        {appointment.consultationType === 'online'
                                            ? 'Video Consultation'
                                            : appointment.consultationType === 'in_person'
                                                ? 'In-Person Visit'
                                                : appointment.consultationType}
                                    </span>
                                }
                            />
                            {appointment.hospital && (
                                <InfoRow
                                    icon={MapPin}
                                    label="Hospital"
                                    value={
                                        <span>
                                            {appointment.hospital.name}
                                            {appointment.hospital.city && (
                                                <span className="text-muted-foreground font-normal">
                                                    {' '}
                                                    • {appointment.hospital.city}
                                                </span>
                                            )}
                                        </span>
                                    }
                                />
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-3">
                        {canStart && (
                            <Link
                                href={`/consultation/${id}`}
                                className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
                            >
                                <Video className="h-4 w-4" />
                                Start Video Call
                            </Link>
                        )}

                        <Link
                            href={`/doctor/appointments/${id}/prescription`}
                            className="flex items-center justify-center gap-2 w-full rounded-xl border py-3.5 text-sm font-semibold hover:bg-muted transition-colors"
                        >
                            <ClipboardList className="h-4 w-4" />
                            {isCompleted ? 'View Prescription' : 'Write Prescription'}
                        </Link>

                        <Link
                            href={`/doctor/patients/${appointment.patientId || id}`}
                            className="flex items-center justify-center gap-2 w-full rounded-xl border py-3.5 text-sm font-semibold hover:bg-muted transition-colors"
                        >
                            <FileText className="h-4 w-4" />
                            View Full History
                        </Link>
                    </div>

                    {/* Payment Info */}
                    {appointment.payment && (
                        <div className="rounded-2xl border bg-card p-6 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-4">Payment</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Consultation Fee</span>
                                    <span className="font-medium">₹{appointment.payment.consultationFee}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Platform Fee</span>
                                    <span className="font-medium">₹{appointment.payment.platformFee}</span>
                                </div>
                                <div className="flex justify-between border-t pt-2 mt-2">
                                    <span className="font-semibold">Total</span>
                                    <span className="font-bold text-primary">₹{appointment.payment.totalAmount}</span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-muted-foreground">Status</span>
                                    <span
                                        className={`text-xs font-semibold px-2 py-1 rounded-full ${appointment.payment.status === 'completed'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-amber-100 text-amber-700'
                                            }`}
                                    >
                                        {appointment.payment.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
