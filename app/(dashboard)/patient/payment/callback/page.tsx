/**
 * PhonePe Payment Callback Page
 * Handles the redirect back from PhonePe after payment
 */

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { usePaymentGateway } from '@/features/payments';
import { LoadingSpinner } from '@/components/shared';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

type PaymentStatus = 'loading' | 'success' | 'failed' | 'error';

export default function PhonePeCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { handlePhonePeCallback, isProcessing } = usePaymentGateway();

    const [status, setStatus] = useState<PaymentStatus>('loading');
    const [message, setMessage] = useState('Verifying your payment...');
    const [appointmentId, setAppointmentId] = useState<string | null>(null);

    useEffect(() => {
        const transactionId = searchParams.get('id');

        // Also check session storage for appointment info
        const storedAppointmentId = sessionStorage.getItem('phonepe_payment_appointment');
        setAppointmentId(storedAppointmentId);

        if (!transactionId) {
            setStatus('error');
            setMessage('Invalid callback - no transaction ID');
            return;
        }

        // Verify the payment
        handlePhonePeCallback(transactionId, {
            onSuccess: (paymentId) => {
                setStatus('success');
                setMessage('Payment successful! Redirecting to your appointment...');

                // Redirect to appointment after 2 seconds
                setTimeout(() => {
                    if (storedAppointmentId) {
                        router.push(`/patient/appointments/${storedAppointmentId}`);
                    } else {
                        router.push('/patient/appointments');
                    }
                }, 2000);
            },
            onFailure: (error) => {
                setStatus('failed');
                setMessage(error.message || 'Payment verification failed');
            },
        });
    }, [searchParams, handlePhonePeCallback, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="max-w-md w-full mx-auto p-8 text-center">
                {/* Status Icon */}
                <div className="mb-6">
                    {status === 'loading' && (
                        <div className="flex justify-center">
                            <LoadingSpinner size="lg" />
                        </div>
                    )}
                    {status === 'success' && (
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                    )}
                    {status === 'failed' && (
                        <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                    )}
                    {status === 'error' && (
                        <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto" />
                    )}
                </div>

                {/* Status Message */}
                <h1 className="text-2xl font-bold mb-2">
                    {status === 'loading' && 'Processing Payment'}
                    {status === 'success' && 'Payment Successful!'}
                    {status === 'failed' && 'Payment Failed'}
                    {status === 'error' && 'Something Went Wrong'}
                </h1>
                <p className="text-muted-foreground mb-6">{message}</p>

                {/* Actions */}
                {status === 'failed' && (
                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                if (appointmentId) {
                                    router.push(`/patient/book/${appointmentId}`);
                                } else {
                                    router.push('/patient/appointments');
                                }
                            }}
                            className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => router.push('/patient/appointments')}
                            className="w-full py-3 px-4 border rounded-lg font-medium hover:bg-muted transition-colors"
                        >
                            Go to Appointments
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <button
                        onClick={() => router.push('/patient/appointments')}
                        className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                        Go to Appointments
                    </button>
                )}

                {/* Loading indicator */}
                {isProcessing && status === 'loading' && (
                    <p className="text-sm text-muted-foreground mt-4">
                        Please wait while we verify your payment...
                    </p>
                )}
            </div>
        </div>
    );
}
