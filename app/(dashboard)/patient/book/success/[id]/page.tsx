'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle2, Calendar, Clock, MapPin, ArrowRight, Home } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { appointmentsApi } from '@/lib/api';
import { bookingApi } from '@/features/appointments';
import { LoadingSpinner } from '@/components/shared';
import { AppointmentWithDetails } from '@/types/models/appointment';
import { routes } from '@/config/routes';
import { useRazorpay } from '@/hooks/use-razorpay';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function AppointmentSuccessPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const { initiatePayment } = useRazorpay();

    const [appointment, setAppointment] = useState<AppointmentWithDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    console.log(appointment);
    useEffect(() => {
        async function fetchAppointmentDetails() {
            setLoading(true);
            try {
                const data = await appointmentsApi.getAppointment(id);
                setAppointment(data);
            } catch (err: any) {
                console.error('Failed to fetch appointment details:', err);
                setError('Failed to load appointment details, but your booking should be successful.');
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchAppointmentDetails();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px]">
                <LoadingSpinner size="lg" />
                <p className="text-muted-foreground mt-4 animate-pulse">Confirming your appointment...</p>
            </div>
        );
    }

    if (error || !appointment) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px] p-6 text-center">
                <div className="rounded-full bg-green-100 p-4 mb-4 dark:bg-green-900/30">
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Booking Successful!</h1>
                <p className="text-muted-foreground mb-6 max-w-md">
                    We successfully received your booking request. However, we couldn't load the details right now.
                </p>
                <div className="flex gap-4">
                    <Link
                        href={routes.patient.dashboard}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        <Home className="h-4 w-4" />
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const isPending = appointment.status === 'pending_payment';

    const handlePayNow = async () => {
        try {
            toast.loading("Initializing payment...");
            const config = await bookingApi.getPaymentConfig(appointment.id);
            toast.dismiss();

            initiatePayment({
                key: config.provider === 'razorpay' ? config.key_id! : '', // Assuming razorpay for now
                amount: config.amount,
                currency: config.currency,
                orderId: config.order_id!,
                prefill: config.prefill
            }, appointment.id);
        } catch (error: any) {
            toast.dismiss();
            toast.error(error.message || "Failed to initialize payment");
        }
    };

    return (
        <div className="min-h-[600px] flex items-center justify-center">
            <div className="w-full max-w-lg bg-background rounded-2xl border shadow-sm p-8 text-center">
                <div className={cn(
                    "mx-auto flex h-20 w-20 items-center justify-center rounded-full mb-6",
                    isPending ? "bg-amber-100 dark:bg-amber-900/30" : "bg-green-100 dark:bg-green-900/30"
                )}>
                    {isPending ? (
                        <Clock className="h-10 w-10 text-amber-600" />
                    ) : (
                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                    )}
                </div>

                <h1 className="text-3xl font-bold mb-2">
                    {isPending ? 'Booking Requested' : 'Booking Confirmed!'}
                </h1>
                <p className="text-muted-foreground mb-8">
                    {isPending
                        ? 'Your booking is currently pending payment. Please complete the payment to confirm your slot.'
                        : <>Your appointment with <span className="font-semibold text-foreground">Dr. {appointment.doctors?.users?.name}</span> has been successfully scheduled.</>
                    }
                </p>

                <div className="bg-muted/50 rounded-xl p-6 mb-8 text-left space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Date</p>
                            <p className="font-semibold">{format(parseISO(appointment.appointmentDate), 'EEEE, MMMM d, yyyy')}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                            <Clock className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Time</p>
                            <p className="font-semibold">{appointment.startTime} - {appointment.endTime}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                            <MapPin className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Location</p>
                            <p className="font-semibold capitalize">
                                {appointment.consultationType === 'online' ? 'Online Video Call' : (appointment.hospital?.name || 'In Person')}
                            </p>
                        </div>
                    </div>

                    <div className="pt-4 border-t mt-4 flex justify-between items-center font-semibold">
                        <span className="text-muted-foreground">Payment Status</span>
                        <span className={cn(
                            "px-3 py-1 rounded-full text-xs uppercase tracking-wider",
                            isPending ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                        )}>
                            {isPending ? 'Pending' : 'Paid'}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href={routes.patient.dashboard}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-3 text-sm font-medium hover:bg-muted transition-colors"
                    >
                        <Home className="h-4 w-4" />
                        Dashboard
                    </Link>
                    {isPending ? (
                        <Button
                            onClick={handlePayNow}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            Pay Now
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Link
                            href={`/patient/appointments/${id}`}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            View Appointment
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
