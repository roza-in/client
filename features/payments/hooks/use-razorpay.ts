/**
 * Payments Feature - Razorpay Hook
 */

'use client';

import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
    createPaymentOrder,
    verifyPayment,
    type CreatePaymentOrderInput,
    type VerifyPaymentInput,
    type PaymentOrder,
} from '../api/payments';
import { type RazorpayOptions, type RazorpayResponse } from '@/types';
import { toast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/api';
import { env } from '@/config/env';

// =============================================================================
// Hook
// =============================================================================

export function useRazorpay() {
    const [isProcessing, setIsProcessing] = useState(false);

    const createOrderMutation = useMutation({
        mutationFn: createPaymentOrder,
        onError: (err) => {
            toast.error(getErrorMessage(err));
        },
    });

    const verifyMutation = useMutation({
        mutationFn: verifyPayment,
        onError: (err) => {
            toast.error(getErrorMessage(err));
        },
    });

    /**
     * Initiate Razorpay payment
     */
    const initiatePayment = useCallback(
        async (
            input: CreatePaymentOrderInput,
            options: {
                name?: string;
                email?: string;
                phone?: string;
                description?: string;
                onSuccess?: (paymentId: string) => void;
                onFailure?: (error: Error) => void;
                onDismiss?: () => void;
            } = {}
        ) => {
            setIsProcessing(true);

            try {
                // Create order on backend
                const order = await createOrderMutation.mutateAsync(input);

                // Check if Razorpay is loaded
                if (!window.Razorpay) {
                    throw new Error('Razorpay SDK not loaded');
                }

                // Open Razorpay checkout
                const razorpay = new window.Razorpay({
                    key: order.keyId,
                    amount: order.amount,
                    currency: order.currency,
                    order_id: order.orderId,
                    name: 'ROZX Healthcare',
                    description: options.description || 'Appointment Booking',
                    prefill: {
                        name: options.name,
                        email: options.email,
                        contact: options.phone,
                    },
                    handler: async (response: RazorpayResponse) => {
                        try {
                            // Verify payment on backend
                            const payment = await verifyMutation.mutateAsync({
                                razorpayOrderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpaySignature: response.razorpay_signature,
                                appointmentId: input.appointmentId,
                            });

                            toast.success('Payment successful!');
                            options.onSuccess?.(payment.id);
                        } catch (error) {
                            options.onFailure?.(error as Error);
                        } finally {
                            setIsProcessing(false);
                        }
                    },
                    modal: {
                        ondismiss: () => {
                            setIsProcessing(false);
                            options.onDismiss?.();
                        },
                    },
                    theme: {
                        color: '#0f766e', // teal-700
                    },
                });

                razorpay.open();
            } catch (error) {
                setIsProcessing(false);
                options.onFailure?.(error as Error);
            }
        },
        [createOrderMutation, verifyMutation]
    );

    return {
        initiatePayment,
        isProcessing,
        isCreatingOrder: createOrderMutation.isPending,
        isVerifying: verifyMutation.isPending,
    };
}
