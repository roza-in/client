'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    Calendar, Clock, Video, Building2, MapPin, ArrowLeft, AlertCircle,
    User, ChevronRight, ExternalLink, Loader2, CreditCard,
    CheckCircle2, XCircle, FileText, Stethoscope, Navigation,
    Ban
} from 'lucide-react';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import { cn } from '@/lib/utils';
import { appointmentsApi } from '@/lib/api';
import { APPOINTMENT_STATUS_COLORS, APPOINTMENT_STATUS_LABELS } from '@/lib/constants/appointment-status';
import { AppointmentWithDetails } from '@/types/models/appointment';
import { useRazorpay } from '@/hooks/use-razorpay';
import { bookingApi } from '@/features/appointments';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function AppointmentDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const [appointment, setAppointment] = useState<AppointmentWithDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const { initiatePayment } = useRazorpay();

    const handlePayNow = async () => {
        if (!appointment) return;

        try {
            setIsProcessing(true);
            toast.loading("Initializing payment...");

            // Get payment config
            const config = await bookingApi.getPaymentConfig(appointment.id);
            toast.dismiss();

            initiatePayment({
                key: config.provider === 'razorpay' ? config.key_id! : '',
                amount: config.amount,
                currency: config.currency,
                orderId: config.order_id!,
                prefill: config.prefill
            }, appointment.id, {
                onSuccess: () => {
                    // Refresh appointment details on success
                    fetchAppointmentDetails();
                }
            });
        } catch (error: any) {
            toast.dismiss();
            toast.error(error.message || "Failed to initialize payment");
        } finally {
            setIsProcessing(false);
        }
    };

    async function fetchAppointmentDetails() {
        setLoading(true);
        setError(null);

        try {
            const data = await appointmentsApi.getAppointment(id);
            setAppointment(data);
        } catch (err: any) {
            console.error('Failed to fetch appointment details:', err);
            setError('Failed to load appointment details.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (id) {
            fetchAppointmentDetails();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                <p className="text-sm text-muted-foreground">Loading appointment details...</p>
            </div>
        );
    }

    if (error || !appointment) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="font-semibold mb-1">{error || 'Appointment not found'}</h2>
                <Link
                    href="/patient/appointments"
                    className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to appointments
                </Link>
            </div>
        );
    }

    const isOnline = appointment.consultationType === 'online';

    // Format dates safely
    const getDateLabel = () => {
        try {
            const date = parseISO(appointment.appointmentDate);
            if (isToday(date)) return 'Today';
            if (isTomorrow(date)) return 'Tomorrow';
            return format(date, 'EEEE, MMMM d, yyyy');
        } catch {
            return appointment.appointmentDate;
        }
    };

    const getGoogleMapsLink = (hospital: any) => {
        const query = encodeURIComponent(`${hospital.name}, ${hospital.address || ''}, ${hospital.city || ''}`);
        return `https://www.google.com/maps/search/?api=1&query=${query}`;
    };

    return (
        <div className="space-y-6 pb-20 max-w-7xl mx-auto">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold tracking-tight">
                            {isOnline ? 'Video Consultation' : 'In-Clinic Appointment'}
                        </h1>
                        <Badge
                            variant="secondary"
                            className={cn(
                                "capitalize px-2.5 py-0.5",
                                APPOINTMENT_STATUS_COLORS[appointment.status]?.bg,
                                APPOINTMENT_STATUS_COLORS[appointment.status]?.text
                            )}
                        >
                            {APPOINTMENT_STATUS_LABELS[appointment.status]}
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <span>Booking ID: <span className="font-mono text-foreground">{appointment.bookingId}</span></span>
                        <span className="text-muted-foreground/30">•</span>
                        <span>Booked on {appointment.createdAt ? format(parseISO(appointment.createdAt), 'MMM d, yyyy') : 'N/A'}</span>
                    </p>
                </div>

                <div className="flex gap-2">
                    {/* Action Buttons based on status */}
                    {appointment.status === 'confirmed' && isOnline && (
                        <Button asChild className="gap-2">
                            <Link href={`/consultation/${id}`}>
                                <Video className="h-4 w-4" />
                                Join Call
                            </Link>
                        </Button>
                    )}

                    {appointment.status === 'confirmed' && !isOnline && appointment.hospital && (
                        <Button asChild variant="outline" className="gap-2">
                            <a
                                href={getGoogleMapsLink(appointment.hospital)}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Navigation className="h-4 w-4" />
                                Get Directions
                            </a>
                        </Button>
                    )}

                    {(appointment.status === 'pending_payment' || appointment.payment?.status === 'pending' || appointment.payment?.status === 'failed') && (
                        <Button onClick={handlePayNow} disabled={isProcessing} className="gap-2">
                            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                            Pay ₹{appointment.payment?.totalAmount || appointment.totalAmount}
                        </Button>
                    )}

                    {!['cancelled', 'completed', 'no_show'].includes(appointment.status) && (
                        <Button variant="outline" disabled className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 shadow-none border-red-200 dark:border-red-900/30">
                            <Ban className="h-4 w-4" />
                            <span className="hidden sm:inline">Cancel</span>
                        </Button>
                    )}
                </div>
            </div>

            <Separator />

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content (Left 2/3) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Doctor Profile Card */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Stethoscope className="h-5 w-5 text-primary" />
                                Doctor Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4">
                                {appointment.doctor?.profilePictureUrl ? (
                                    <img
                                        src={appointment.doctor.profilePictureUrl}
                                        alt={appointment.doctor.name || 'Doctor'}
                                        className="h-20 w-20 rounded-2xl object-cover border"
                                    />
                                ) : (
                                    <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary border border-primary/20">
                                        {(appointment.doctor?.name || 'D').charAt(0)}
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <h3 className="font-bold text-lg">Dr. {appointment.doctor?.name}</h3>
                                    <p className="text-muted-foreground font-medium">{appointment.doctor?.specialization}</p>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                                        {/* Placeholder for future specific doctor info like Registration No. */}
                                        <Badge variant="outline" className="rounded-md font-normal">
                                            {isOnline ? 'Online Specialist' : 'Senior Consultant'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Schedule & Location */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                {isOnline ? 'Schedule' : 'Schedule & Location'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                        <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Date & Time</p>
                                        <p className="text-sm text-muted-foreground mt-0.5">{getDateLabel()}</p>
                                        <p className="text-sm font-semibold text-primary mt-1">
                                            {appointment.startTime} - {appointment.endTime}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {!isOnline && appointment.hospital && (
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                                            <Building2 className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Hospital</p>
                                            <p className="text-sm font-medium mt-0.5">{appointment.hospital.name}</p>
                                            <p className="text-sm text-muted-foreground mt-0.5 leading-snug">
                                                {[appointment.hospital.address, appointment.hospital.city].filter(Boolean).join(', ')}
                                            </p>
                                            <a
                                                href={getGoogleMapsLink(appointment.hospital)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-xs text-primary font-medium mt-2 hover:underline"
                                            >
                                                <Navigation className="h-3 w-3" />
                                                Get Directions
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Clinical Info */}
                    {(appointment.chiefComplaint || (appointment.symptoms && appointment.symptoms.length > 0)) && (
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    Clinical Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {appointment.chiefComplaint && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Chief Complaint</p>
                                        <p className="text-sm">{appointment.chiefComplaint}</p>
                                    </div>
                                )}

                                {appointment.symptoms && appointment.symptoms.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-2">Symptoms</p>
                                        <div className="flex flex-wrap gap-2">
                                            {appointment.symptoms.map((symptom) => (
                                                <Badge key={symptom} variant="secondary" className="font-normal">
                                                    {symptom}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {appointment.consultation?.vitals && (
                                    <div className="pt-2">
                                        <p className="text-sm font-medium text-muted-foreground mb-2">Vitals (Recorded)</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {Object.entries(appointment.consultation.vitals).map(([key, value]) => (
                                                <div key={key} className="bg-muted/50 p-2 rounded-lg">
                                                    <p className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                                    <p className="text-sm font-medium">{value as string}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                </div>

                {/* Sidebar (Right 1/3) */}
                <div className="space-y-6">

                    {/* Patient Info Card */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Appointment For</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {(appointment.patientName || 'U').charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium">{appointment.patientName}</p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span>{appointment.patientAge ? `${appointment.patientAge} years` : 'Age N/A'}</span>
                                        <span>•</span>
                                        <span>{appointment.patientGender || 'Gender N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            {appointment.familyMemberId && (
                                <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                                    <p>Booked for family member</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Payment Card */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center justify-between">
                                <span>Payment</span>
                                <Badge variant={appointment.payment?.status === 'completed' ? 'success' : 'outline'}
                                    className={cn(
                                        appointment.payment?.status === 'completed'
                                            ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                                            : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400"
                                    )}
                                >
                                    {appointment.payment?.status === 'completed' ? 'Paid' : 'Pending'}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Consultation Fee</span>
                                    <span>₹{appointment.payment?.consultationFee || appointment.consultationFee || 0}</span>
                                </div>
                                {(appointment.payment?.platformFee || appointment.platformFee) ? (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Platform Fee</span>
                                        <span>₹{appointment.payment?.platformFee || appointment.platformFee}</span>
                                    </div>
                                ) : null}
                                <Separator />
                                <div className="flex justify-between font-bold text-base">
                                    <span>Total</span>
                                    <span>₹{appointment.payment?.totalAmount || appointment.totalAmount || 0}</span>
                                </div>
                            </div>

                            {(appointment.status === 'pending_payment' || appointment.payment?.status === 'pending' || appointment.payment?.status === 'failed') && (
                                <Button onClick={handlePayNow} disabled={isProcessing} className="w-full mt-4">
                                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
                                    Pay Now
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Timeline */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg">Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Timeline status={appointment.status} createdAt={appointment.createdAt} />
                        </CardContent>
                    </Card>

                    {/* Support */}
                    <div className="bg-muted/30 rounded-xl p-5 text-center border">
                        <p className="text-sm font-medium mb-1">Need assistance?</p>
                        <p className="text-xs text-muted-foreground mb-3">Facing issues with your appointment?</p>
                        <Button variant="outline" size="sm" asChild className="w-full">
                            <Link href="/contact">Contact Support</Link>
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
}

// Timeline Component
function Timeline({ status, createdAt }: { status: string, createdAt: string }) {
    // Define steps based on lifecycle
    const steps = [
        { id: 'booked', label: 'Booked', date: createdAt, active: true },
        { id: 'confirmed', label: 'Confirmed', active: ['confirmed', 'checked_in', 'in_progress', 'completed'].includes(status) },
        { id: 'in_progress', label: 'In Progress', active: ['in_progress', 'completed'].includes(status) },
        { id: 'completed', label: 'Completed', active: ['completed'].includes(status) }
    ];

    // Handle cancelled/no-show as special states
    if (status === 'cancelled') {
        return (
            <div className="relative border-l-2 border-red-200 dark:border-red-900/30 ml-2 space-y-6 py-1">
                <div className="relative pl-6">
                    <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-primary border-2 border-background" />
                    <p className="text-sm font-medium leading-none">Booked</p>
                    <p className="text-xs text-muted-foreground mt-1">{format(parseISO(createdAt), 'MMM d, h:mm a')}</p>
                </div>
                <div className="relative pl-6">
                    <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-red-500 border-2 border-background" />
                    <p className="text-sm font-medium leading-none text-red-600">Cancelled</p>
                    <p className="text-xs text-muted-foreground mt-1">Assessment terminated</p>
                </div>
            </div>
        )
    }

    return (
        <div className="relative border-l-2 border-muted ml-2 space-y-6 py-1">
            {steps.map((step, index) => {
                const isActive = step.active;
                const isLast = index === steps.length - 1;

                return (
                    <div key={step.id} className="relative pl-6">
                        <span className={cn(
                            "absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-background transition-colors",
                            isActive ? "bg-primary" : "bg-muted-foreground/30"
                        )} />
                        <p className={cn("text-sm font-medium leading-none", isActive ? "text-foreground" : "text-muted-foreground")}>
                            {step.label}
                        </p>
                        {step.date && (
                            <p className="text-xs text-muted-foreground mt-1">
                                {format(parseISO(step.date), 'MMM d, h:mm a')}
                            </p>
                        )}
                        {/* Connecting line tweaks if needed */}
                    </div>
                );
            })}
        </div>
    );
}
