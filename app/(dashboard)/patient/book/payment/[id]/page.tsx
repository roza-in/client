'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin, ArrowRight, CreditCard, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { bookingApi } from '@/features/appointments';
import { AppointmentWithDetails } from '@/types/models/appointment';
import { routes } from '@/config/routes';
import { useRazorpay } from '@/hooks/use-razorpay';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/shared';

export default function PaymentReviewPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const { initiatePayment } = useRazorpay();

    const [appointment, setAppointment] = useState<AppointmentWithDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        async function fetchAppointmentDetails() {
            setLoading(true);
            try {
                const data = await bookingApi.getAppointment(id);
                console.log('PaymentReview: Fetched appointment:', data);
                setAppointment(data);

                // If already paid, redirect to success
                if (data.status === 'confirmed' || data.payment?.status === 'completed') {
                    router.replace(`/patient/book/success/${id}`);
                }
            } catch (err: any) {
                console.error('Failed to fetch appointment details:', err);
                setError('Failed to load appointment details.');
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchAppointmentDetails();
        }
    }, [id, router]);

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
            }, appointment.id);
        } catch (error: any) {
            toast.dismiss();
            toast.error(error.message || "Failed to initialize payment");
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px]">
                <LoadingSpinner size="lg" />
                <p className="text-muted-foreground mt-4 animate-pulse">Loading payment details...</p>
            </div>
        );
    }

    if (error || !appointment) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px] p-6 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h2 className="font-semibold mb-2">{error || 'Appointment not found'}</h2>
                <Button onClick={() => router.back()} variant="outline">
                    Go Back
                </Button>
            </div>
        );
    }

    const { payment } = appointment;
    const totalAmount = payment?.totalAmount || 0;

    return (
        <>
            <h1 className="text-3xl font-bold mb-2">Review & Pay</h1>
            <p className="text-muted-foreground mb-8">Complete your payment to confirm your appointment.</p>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Appointment Summary */}
                <div className="space-y-6">
                    <div className="bg-card rounded-xl border p-6">
                        <h2 className="font-semibold mb-4 text-lg">Appointment Details</h2>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                    {(appointment.doctor?.name || appointment.doctors?.users?.name || 'D').charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold">{appointment.doctor?.name ? `Dr. ${appointment.doctor.name}` : (appointment.doctors?.users?.name ? `Dr. ${appointment.doctors.users.name}` : 'Doctor')}</p>
                                    <p className="text-sm text-muted-foreground">{appointment.doctor?.specialization || appointment.doctors?.specialization || 'Specialist'}</p>
                                </div>
                            </div>

                            <div className="border-t pt-4 space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                        {appointment.appointmentDate ? (
                                            (() => {
                                                try {
                                                    return format(parseISO(appointment.appointmentDate), 'EEEE, MMMM d, yyyy');
                                                } catch (e) {
                                                    return appointment.appointmentDate;
                                                }
                                            })()
                                        ) : (
                                            'Date not available'
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span>{appointment.startTime || '--:--'} - {appointment.endTime || '--:--'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="capitalize">{appointment.consultationType === 'online' ? 'Online Video Call' : 'In-Clinic Visit'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Breakdown */}
                <div className="space-y-6">
                    <div className="bg-card rounded-xl border p-6 shadow-sm">
                        <h2 className="font-semibold mb-4 text-lg flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Payment Summary
                        </h2>

                        <div className="space-y-3 text-sm mb-6">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Consultation Fee</span>
                                <span>₹{payment?.consultationFee || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Platform Fee</span>
                                <span>₹0</span>
                            </div>
                            {/* Add taxes if applicable in schema, forcing GST calculation representation if needed */}
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">GST (18%)</span>
                                <span>Included</span>
                            </div>

                            <div className="border-t pt-3 flex justify-between font-bold text-lg mt-2">
                                <span>Total Payable</span>
                                <span className="text-primary">₹{totalAmount}</span>
                            </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex items-start gap-3 mb-6">
                            <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                            <div className="text-xs text-blue-800 dark:text-blue-300">
                                <p className="font-semibold mb-1">Secure Payment</p>
                                <p>Your transaction is secured with 256-bit SSL encryption. We do not store your card details.</p>
                            </div>
                        </div>

                        <Button
                            className="w-full h-12 text-base"
                            size="lg"
                            onClick={handlePayNow}
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Processing Payment...
                                </>
                            ) : (
                                <>
                                    Pay ₹{totalAmount}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>

                        <p className="text-xs text-center text-muted-foreground mt-4">
                            By clicking "Pay", you agree to our Terms of Service.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
