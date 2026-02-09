/**
 * Payments Feature - API
 * Supports both Razorpay and PhonePe payment gateways
 */

import { api, endpoints } from '@/lib/api';
import type { Payment, Invoice, Refund } from '@/types';

// =============================================================================
// Types
// =============================================================================

export interface CreatePaymentOrderInput {
    appointmentId: string;
    amount?: number;
    currency?: string;
}

export interface PaymentOrder {
    orderId: string;
    amount: number;
    currency: string;
    keyId?: string;
    notes?: Record<string, string>;
    provider?: 'razorpay' | 'phonepe';
    paymentLink?: string; // PhonePe redirect URL
}

export interface PaymentConfig {
    provider: 'razorpay' | 'phonepe';
    appointmentId: string;
    amount: number;
    currency: string;
    // Razorpay-specific
    keyId?: string;
    orderId?: string;
    // PhonePe-specific
    paymentLink?: string;
    merchantTransactionId?: string;
    // Common
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
}

export interface VerifyPaymentInput {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    appointmentId: string;
}

export interface VerifyPhonePeInput {
    transactionId: string;
}

export interface PaymentStatus {
    id: string;
    status: 'pending' | 'completed' | 'failed' | 'expired' | 'refunded';
    paidAt?: string;
}

export interface PaymentFilters {
    status?: 'pending' | 'completed' | 'failed' | 'refunded';
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    [key: string]: string | number | boolean | string[] | null | undefined;
}

// =============================================================================
// API Functions
// =============================================================================

/**
 * Get payment configuration for an appointment
 * Returns provider-specific config for client-side payment initialization
 */
export async function getPaymentConfig(appointmentId: string): Promise<PaymentConfig> {
    return api.get<PaymentConfig>(`/payments/config/${appointmentId}`);
}

/**
 * Create a payment order (generic - works with both providers)
 */
export async function createPaymentOrder(input: CreatePaymentOrderInput): Promise<PaymentOrder> {
    const response = await api.post<any>(endpoints.payments.createOrder, {
        appointment_id: input.appointmentId,
    });

    return {
        orderId: response.order_id,
        amount: response.amount,
        currency: response.currency,
        keyId: response.key_id,
        notes: response.notes,
        provider: response.provider,
        paymentLink: response.payment_link,
    };
}

/**
 * Verify Razorpay payment after success
 */
export async function verifyPayment(input: VerifyPaymentInput): Promise<Payment> {
    return api.post<Payment>(endpoints.payments.verify, {
        gateway_order_id: input.razorpayOrderId,
        gateway_payment_id: input.razorpayPaymentId,
        gateway_signature: input.razorpaySignature,
        provider: 'razorpay',
    });
}

/**
 * Verify PhonePe payment after redirect callback
 */
export async function verifyPhonePePayment(transactionId: string): Promise<Payment> {
    return api.post<Payment>('/payments/phonepe/callback', {
        transactionId,
    });
}

/**
 * Get payment status (for polling)
 */
export async function getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    const response = await api.get<any>(`/payments/${paymentId}/status`);
    return {
        id: response.id,
        status: response.status,
        paidAt: response.paid_at,
    };
}

/**
 * Get payment history
 */
export async function getPaymentHistory(filters?: PaymentFilters): Promise<{
    payments: Payment[];
    total: number;
}> {
    const { data, meta } = await api.getWithMeta<Payment[]>(endpoints.payments.history, {
        params: filters,
    });
    return { payments: data, total: meta?.total || 0 };
}

/**
 * Get payment by ID
 */
export async function getPayment(id: string): Promise<Payment> {
    return api.get<Payment>(endpoints.payments.get(id));
}

/**
 * Get invoice for a payment
 */
export async function getInvoice(paymentId: string): Promise<Invoice> {
    return api.get<Invoice>(endpoints.payments.invoice(paymentId));
}

/**
 * Download invoice PDF
 */
export async function downloadInvoicePdf(paymentId: string): Promise<Blob> {
    const response = await fetch(`/api${endpoints.payments.invoice(paymentId)}?format=pdf`, {
        credentials: 'include',
    });
    return response.blob();
}

/**
 * Request refund (patient initiated)
 */
export async function requestRefund(
    paymentId: string,
    reason: string
): Promise<Refund> {
    return api.post<Refund>(endpoints.payments.refund(paymentId), { reason });
}
