'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Calendar,
    Clock,
    User,
    Phone,
    Mail,
    Video,
    Users,
    CreditCard,
    CheckCircle,
    XCircle,
    Stethoscope
} from 'lucide-react';
import { api } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { LoadingSpinner } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AppointmentDetails {
    [x: string]: any;
    id: string;
    appointment_number: string;
    scheduled_date: string;
    scheduled_start: string;
    scheduled_end: string;
    status: string;
    consultation_type: string;
    consultation_fee: number;
    platform_fee: number;
    total_amount: number;
    payment_method: string | null;
    patient_notes: string | null;
    checked_in_at: string | null;
    started_at: string | null;
    ended_at: string | null;
    cancelled_at: string | null;
    cancellation_reason: string | null;
    patient: {
        id: string;
        name: string;
        phone: string;
        email: string;
        avatar_url?: string;
        gender?: string;
    };
    doctor: {
        id: string;
        users: {
            name: string;
            avatar_url?: string;
            phone: string;
            email: string;
        };
        qualifications?: string[];
        experience_years?: number;
    };
}

export default function AppointmentDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [appointment, setAppointment] = useState<AppointmentDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const appointmentId = params.id as string;

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const data = await api.get<AppointmentDetails>(endpoints.appointments.get(appointmentId));
                setAppointment(data);
            } catch (error) {
                console.error('Failed to fetch appointment:', error);
                toast.error('Failed to load appointment details');
            } finally {
                setLoading(false);
            }
        };

        if (appointmentId) {
            fetchAppointment();
        }
    }, [appointmentId]);

    const handleCheckIn = async () => {
        if (!appointment) return;
        setActionLoading(true);
        try {
            await api.post(endpoints.appointments.checkIn(appointmentId), {});
            toast.success('Patient checked in successfully');
            const data = await api.get<AppointmentDetails>(endpoints.appointments.get(appointmentId));
            setAppointment(data);
        } catch (error) {
            console.error('Failed to check in:', error);
            toast.error('Failed to check in patient');
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!appointment) return;
        if (!confirm('Are you sure you want to cancel this appointment?')) return;

        setActionLoading(true);
        try {
            await api.post(endpoints.appointments.cancel(appointmentId), {
                reason: 'Cancelled by hospital admin'
            });
            toast.success('Appointment cancelled');
            const data = await api.get<AppointmentDetails>(endpoints.appointments.get(appointmentId));
            setAppointment(data);
        } catch (error) {
            console.error('Failed to cancel:', error);
            toast.error('Failed to cancel appointment');
        } finally {
            setActionLoading(false);
        }
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-blue-100 text-blue-700';
            case 'checked_in': return 'bg-green-100 text-green-700';
            case 'in_progress': return 'bg-purple-100 text-purple-700';
            case 'completed': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            case 'pending_payment': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!appointment) {
        return (
            <div className="p-6">
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
                    <h2 className="text-lg font-semibold">Appointment Not Found</h2>
                    <p>The appointment you are looking for does not exist.</p>
                    <Link href="/hospital/appointments" className="mt-4 inline-block text-primary hover:underline">
                        ← Back to Appointments
                    </Link>
                </div>
            </div>
        );
    }

    console.log(appointment);

    return (
        <>
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">Appointment Details</h1>
                    <p className="text-muted-foreground">#{appointment.appointment_number}</p>
                </div>
                <Badge className={`text-sm py-1 px-3 ${getStatusStyle(appointment.status)}`}>
                    {appointment.status?.replace(/_/g, ' ').toUpperCase()}
                </Badge>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Appointment Info Card */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                Appointment Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-sm text-muted-foreground">Date</p>
                                <p className="font-medium">{formatDate(appointment.scheduled_date)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Time</p>
                                <p className="font-medium">
                                    {formatTime(appointment.scheduled_start)} - {formatTime(appointment.scheduled_end)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Consultation Type</p>
                                <div className="flex items-center gap-2">
                                    {appointment.consultation_type === 'online' ? (
                                        <Video className="h-4 w-4 text-blue-600" />
                                    ) : (
                                        <Users className="h-4 w-4 text-green-600" />
                                    )}
                                    <span className="font-medium capitalize">{appointment.consultation_type?.replace('_', ' ')}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Payment</p>
                                <p className="font-medium capitalize">{appointment.payment_method || 'Not Paid'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Patient Info Card */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                Patient Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                                    {appointment.patient?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'P'}
                                </div>
                                <div>
                                    <p className="font-semibold text-lg">{appointment.patient?.name}</p>
                                    <p className="text-sm text-muted-foreground capitalize">{appointment.patient?.gender || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{appointment.patient?.phone || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{appointment.patient?.email || 'N/A'}</span>
                                </div>
                            </div>
                            {appointment.patient_notes && (
                                <div className="mt-4 p-3 bg-muted rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-1">Patient Notes</p>
                                    <p className="text-sm">{appointment.patient_notes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Doctor Info Card */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Stethoscope className="h-5 w-5 text-primary" />
                                Doctor Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Stethoscope className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-lg">Dr. {appointment.doctors?.users?.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {appointment.doctors?.qualifications?.join(', ') || 'Specialist'} {appointment.doctors?.specializations}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Payment Card */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-primary" />
                                Payment
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Consultation</span>
                                <span className="font-medium">₹{appointment.consultation_fee}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Platform Fee</span>
                                <span className="font-medium">₹{appointment.platform_fee}</span>
                            </div>
                            <div className="border-t pt-3 flex justify-between">
                                <span className="font-semibold">Total</span>
                                <span className="font-bold text-lg">₹{appointment.total_amount}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline Card */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Clock className="h-5 w-5 text-primary" />
                                Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Scheduled</span>
                                <span>{formatDateTime(appointment.scheduled_start)}</span>
                            </div>
                            {appointment.checked_in_at && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Checked In</span>
                                    <span>{formatDateTime(appointment.checked_in_at)}</span>
                                </div>
                            )}
                            {appointment.started_at && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Started</span>
                                    <span>{formatDateTime(appointment.started_at)}</span>
                                </div>
                            )}
                            {appointment.ended_at && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Completed</span>
                                    <span>{formatDateTime(appointment.ended_at)}</span>
                                </div>
                            )}
                            {appointment.cancelled_at && (
                                <div className="flex justify-between text-red-600">
                                    <span>Cancelled</span>
                                    <span>{formatDateTime(appointment.cancelled_at)}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Actions Card */}
                    {!['completed', 'cancelled'].includes(appointment.status) && (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {appointment.status === 'confirmed' && (
                                    <Button
                                        onClick={handleCheckIn}
                                        disabled={actionLoading}
                                        className="w-full bg-green-600 hover:bg-green-700"
                                    >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Check In Patient
                                    </Button>
                                )}
                                <Button
                                    onClick={handleCancel}
                                    disabled={actionLoading}
                                    variant="outline"
                                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                                >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Cancel Appointment
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {appointment.cancellation_reason && (
                        <Card className="border-red-200 bg-red-50">
                            <CardContent className="py-4">
                                <p className="text-sm font-medium text-red-800">Cancellation Reason</p>
                                <p className="text-sm text-red-700 mt-1">{appointment.cancellation_reason}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}
