/**
 * Payments Feature - Unified Payment Gateway Hook
 * Supports both Razorpay and PhonePe with dynamic provider detection
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
    getPaymentConfig,
    createPaymentOrder,
    verifyPayment,
    verifyPhonePePayment,
    getPaymentStatus,
    type PaymentConfig,
    type VerifyPaymentInput,
} from '../api/payments';
import { type RazorpayResponse } from '@/types';
import { toast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/api';

// =============================================================================
// Types
// =============================================================================

export interface PaymentGatewayOptions {
    appointmentId: string;
    onSuccess?: (paymentId: string) => void;
    onFailure?: (error: Error) => void;
    onDismiss?: () => void;
    description?: string;
}

// =============================================================================
// Hook
// =============================================================================

export function usePaymentGateway() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentAppointmentId, setCurrentAppointmentId] = useState<string | null>(null);
    const [pollingPaymentId, setPollingPaymentId] = useState<string | null>(null);

    // Mutation for creating payment order
    const createOrderMutation = useMutation({
        mutationFn: createPaymentOrder,
        onError: (err) => {
            toast.error(getErrorMessage(err));
        },
    });

    // Mutation for Razorpay verification
    const verifyRazorpayMutation = useMutation({
        mutationFn: verifyPayment,
        onError: (err) => {
            toast.error(getErrorMessage(err));
        },
    });

    // Mutation for PhonePe verification
    const verifyPhonePeMutation = useMutation({
        mutationFn: verifyPhonePePayment,
        onError: (err) => {
            toast.error(getErrorMessage(err));
        },
    });

    // Query for payment status polling (PhonePe)
    const { data: paymentStatus } = useQuery({
        queryKey: ['paymentStatus', pollingPaymentId],
        queryFn: () => getPaymentStatus(pollingPaymentId!),
        enabled: !!pollingPaymentId,
        refetchInterval: 3000, // Poll every 3 seconds
    });

    // Stop polling when payment is complete
    useEffect(() => {
        if (paymentStatus?.status === 'completed' || paymentStatus?.status === 'failed') {
            setPollingPaymentId(null);
        }
    }, [paymentStatus]);

    /**
     * Get payment configuration for an appointment
     */
    const getConfig = useCallback(async (appointmentId: string): Promise<PaymentConfig> => {
        return getPaymentConfig(appointmentId);
    }, []);

    /**
     * Initiate payment (automatically detects provider)
     */
    const initiatePayment = useCallback(
        async (options: PaymentGatewayOptions) => {
            const { appointmentId, onSuccess, onFailure, onDismiss, description } = options;

            setIsProcessing(true);
            setCurrentAppointmentId(appointmentId);

            try {
                // Create order and get provider info
                const order = await createOrderMutation.mutateAsync({ appointmentId });

                if (order.provider === 'phonepe') {
                    // PhonePe: Redirect to payment page
                    if (!order.paymentLink) {
                        throw new Error('PhonePe payment link not available');
                    }

                    // Store appointment ID in sessionStorage for callback
                    sessionStorage.setItem('phonepe_payment_appointment', appointmentId);
                    sessionStorage.setItem('phonepe_payment_order', order.orderId);

                    // Redirect to PhonePe
                    window.location.href = order.paymentLink;
                    return; // Will redirect
                }

                // Razorpay: Open checkout modal
                if (!window.Razorpay) {
                    throw new Error('Razorpay SDK not loaded');
                }

                if (!order.keyId) {
                    throw new Error('Razorpay key not available');
                }

                const razorpay = new window.Razorpay({
                    key: order.keyId,
                    amount: order.amount,
                    currency: order.currency,
                    order_id: order.orderId,
                    name: 'ROZX Healthcare',
                    description: description || 'Appointment Booking',
                    handler: async (response: RazorpayResponse) => {
                        try {
                            const payment = await verifyRazorpayMutation.mutateAsync({
                                razorpayOrderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpaySignature: response.razorpay_signature,
                                appointmentId,
                            });

                            toast.success('Payment successful!');
                            onSuccess?.(payment.id);
                        } catch (error) {
                            onFailure?.(error as Error);
                        } finally {
                            setIsProcessing(false);
                            setCurrentAppointmentId(null);
                        }
                    },
                    modal: {
                        ondismiss: () => {
                            setIsProcessing(false);
                            setCurrentAppointmentId(null);
                            onDismiss?.();
                        },
                    },
                    theme: {
                        color: '#0f766e', // teal-700
                    },
                });

                razorpay.open();
            } catch (error) {
                setIsProcessing(false);
                setCurrentAppointmentId(null);
                onFailure?.(error as Error);
            }
        },
        [createOrderMutation, verifyRazorpayMutation]
    );

    /**
     * Handle PhonePe callback (call this from the callback page)
     */
    const handlePhonePeCallback = useCallback(
        async (transactionId: string, options: { onSuccess?: (paymentId: string) => void; onFailure?: (error: Error) => void } = {}) => {
            setIsProcessing(true);

            try {
                const payment = await verifyPhonePeMutation.mutateAsync(transactionId);

                toast.success('Payment successful!');
                options.onSuccess?.(payment.id);

                // Clean up session storage
                sessionStorage.removeItem('phonepe_payment_appointment');
                sessionStorage.removeItem('phonepe_payment_order');
            } catch (error) {
                options.onFailure?.(error as Error);
            } finally {
                setIsProcessing(false);
            }
        },
        [verifyPhonePeMutation]
    );

    /**
     * Start polling for payment status (for PhonePe)
     */
    const startStatusPolling = useCallback((paymentId: string) => {
        setPollingPaymentId(paymentId);
    }, []);

    /**
     * Stop polling for payment status
     */
    const stopStatusPolling = useCallback(() => {
        setPollingPaymentId(null);
    }, []);

    return {
        // Methods
        getConfig,
        initiatePayment,
        handlePhonePeCallback,
        startStatusPolling,
        stopStatusPolling,

        // State
        isProcessing,
        isCreatingOrder: createOrderMutation.isPending,
        isVerifying: verifyRazorpayMutation.isPending || verifyPhonePeMutation.isPending,
        currentAppointmentId,
        paymentStatus,
        isPolling: !!pollingPaymentId,
    };
}
