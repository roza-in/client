/**
 * ROZX Healthcare Platform - Payment Status Constants
 */

// =============================================================================
// Payment Status Enum
// =============================================================================

export const PaymentStatus = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded',
    PARTIALLY_REFUNDED: 'partially_refunded',
    CANCELLED: 'cancelled',
} as const;

export type PaymentStatusType = (typeof PaymentStatus)[keyof typeof PaymentStatus];

// =============================================================================
// Status Labels
// =============================================================================

export const PAYMENT_STATUS_LABELS: Record<PaymentStatusType, string> = {
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
    refunded: 'Refunded',
    partially_refunded: 'Partially Refunded',
    cancelled: 'Cancelled',
};

// =============================================================================
// Status Colors
// =============================================================================

export const PAYMENT_STATUS_COLORS: Record<PaymentStatusType, {
    bg: string;
    text: string;
    border: string;
}> = {
    pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    processing: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    completed: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    failed: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    refunded: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    partially_refunded: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    cancelled: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
};

// =============================================================================
// Payment Methods
// =============================================================================

export const PaymentMethod = {
    UPI: 'upi',
    CARD: 'card',
    NETBANKING: 'netbanking',
    WALLET: 'wallet',
    CASH: 'cash',
    CREDIT: 'patient_credit',
} as const;

export type PaymentMethodType = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethodType, string> = {
    upi: 'UPI',
    card: 'Credit/Debit Card',
    netbanking: 'Net Banking',
    wallet: 'Wallet',
    cash: 'Cash',
    patient_credit: 'Patient Credit',
};

export const PAYMENT_METHOD_ICONS: Record<PaymentMethodType, string> = {
    upi: 'Smartphone',
    card: 'CreditCard',
    netbanking: 'Building',
    wallet: 'Wallet',
    cash: 'Banknote',
    patient_credit: 'BadgeDollarSign',
};

// =============================================================================
// Refund Status
// =============================================================================

export const RefundStatus = {
    PENDING: 'pending',
    APPROVED: 'approved',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    REJECTED: 'rejected',
} as const;

export type RefundStatusType = (typeof RefundStatus)[keyof typeof RefundStatus];

export const REFUND_STATUS_LABELS: Record<RefundStatusType, string> = {
    pending: 'Pending Review',
    approved: 'Approved',
    processing: 'Processing',
    completed: 'Refunded',
    rejected: 'Rejected',
};

// =============================================================================
// Utility Functions
// =============================================================================

export function getPaymentStatusLabel(status: string): string {
    return PAYMENT_STATUS_LABELS[status as PaymentStatusType] || status;
}

export function getPaymentStatusColors(status: string): { bg: string; text: string; border: string } {
    return PAYMENT_STATUS_COLORS[status as PaymentStatusType] || {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
    };
}

export function isSuccessfulPayment(status: string): boolean {
    return status === 'completed';
}

export function isRefundable(status: string): boolean {
    return status === 'completed';
}

export function canRetryPayment(status: string): boolean {
    return ['failed', 'cancelled'].includes(status);
}

export default PaymentStatus;
