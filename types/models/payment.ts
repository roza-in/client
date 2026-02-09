/**
 * ROZX Healthcare Platform - Payment Model Types
 */

import type {
    PaymentStatus,
    PaymentMethod,
    RefundType,
    RefundStatus,
    SettlementStatus
} from '../enums';

// =============================================================================
// Payment Entity (Full)
// =============================================================================

export interface Payment {
    id: string;
    appointmentId: string;
    patientId: string;
    doctorId: string;
    hospitalId: string;

    // Order Info
    razorpayOrderId: string;
    razorpayPaymentId: string | null;
    razorpaySignature: string | null;

    // Amount Breakdown
    consultationFee: number;
    platformFee: number;
    gatewayFee: number;
    gstAmount: number;
    totalAmount: number;
    discountAmount: number;
    couponCode: string | null;
    creditsUsed: number;
    finalAmount: number;

    // Payouts
    doctorPayout: number;
    hospitalPayout: number;
    platformRevenue: number;

    // Status
    status: PaymentStatus;
    paymentMethod: PaymentMethod | null;

    // Timestamps
    initiatedAt: string;
    paidAt: string | null;
    failedAt: string | null;
    failureReason: string | null;

    // Metadata
    metadata: Record<string, unknown> | null;
    idempotencyKey: string | null;

    // Timestamps
    createdAt: string;
    updatedAt: string;
}

// =============================================================================
// Payment List Item
// =============================================================================

export interface PaymentListItem {
    id: string;
    appointmentId: string;
    patientName: string;
    doctorName: string;
    hospitalName: string;
    totalAmount: number;
    finalAmount: number;
    status: PaymentStatus;
    paymentMethod: PaymentMethod | null;
    paidAt: string | null;
    createdAt: string;
}

// =============================================================================
// Payment with Details
// =============================================================================

export interface PaymentWithDetails extends Payment {
    patient: {
        id: string;
        name: string;
        phone: string;
        email: string | null;
    };
    doctor: {
        id: string;
        name: string;
        specialization: string;
    };
    hospital: {
        id: string;
        name: string;
        city: string;
    };
    appointment: {
        id: string;
        bookingId: string;
        appointmentDate: string;
        startTime: string;
        consultationType: string;
        status: string;
    };
    refunds?: Refund[];
}

// =============================================================================
// Refund
// =============================================================================

export interface Refund {
    id: string;
    paymentId: string;
    razorpayRefundId: string | null;

    // Amount
    amount: number;
    refundType: RefundType;

    // Status
    status: RefundStatus;

    // Details
    reason: string;
    initiatedBy: string;
    processedAt: string | null;
    failureReason: string | null;

    // Bank Details
    bankReference: string | null;

    // Timestamps
    createdAt: string;
    updatedAt: string;
}

// =============================================================================
// Payment Order (Razorpay)
// =============================================================================

export interface PaymentOrder {
    orderId: string;
    amount: number;
    currency: string;
    key: string;
    notes?: Record<string, string>;
    appointmentId: string;
}

// =============================================================================
// Payment Verification
// =============================================================================

export interface PaymentVerification {
    razorpayPaymentId: string;
    razorpayOrderId: string;
    razorpaySignature: string;
    appointmentId: string;
}

export interface PaymentVerificationResult {
    success: boolean;
    payment: Payment;
    appointment: {
        id: string;
        status: string;
    };
    whatsappSent: boolean;
}

// =============================================================================
// Invoice
// =============================================================================

export interface Invoice {
    id: string;
    invoiceNumber: string;
    type: 'appointment' | 'medicine_order' | 'settlement';
    referenceId: string;

    // Parties
    issuedTo: {
        name: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        gstin: string | null;
    };
    issuedBy: {
        name: string;
        address: string;
        gstin: string | null;
    };

    // Line Items
    lineItems: InvoiceLineItem[];

    // Amounts
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    totalAmount: number;

    // Status
    status: 'draft' | 'issued' | 'paid' | 'cancelled';
    pdfUrl: string | null;

    // Dates
    issuedDate: string;
    dueDate: string | null;
    paidDate: string | null;

    // Timestamps
    createdAt: string;
    updatedAt: string;
}

export interface InvoiceLineItem {
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    taxRate: number;
    taxAmount: number;
}

// =============================================================================
// Patient Credits
// =============================================================================

export interface PatientCredit {
    id: string;
    patientId: string;
    balance: number;
    totalEarned: number;
    totalUsed: number;
    totalExpired: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreditTransaction {
    id: string;
    creditId: string;
    type: 'earned' | 'used' | 'expired' | 'refund' | 'adjustment';
    amount: number;
    description: string;
    referenceType: string | null;
    referenceId: string | null;
    expiresAt: string | null;
    createdAt: string;
}

// =============================================================================
// Payment Stats
// =============================================================================

export interface PaymentStats {
    totalRevenue: number;
    totalTransactions: number;
    successfulPayments: number;
    failedPayments: number;
    pendingPayments: number;
    totalRefunds: number;
    refundAmount: number;
    averageTransactionValue: number;
    platformEarnings: number;
}

export interface RevenueByPeriod {
    period: string;
    revenue: number;
    transactions: number;
    refunds: number;
}

// =============================================================================
// Input Types
// =============================================================================

export interface CreatePaymentOrderInput {
    appointmentId: string;
    couponCode?: string;
    useCredits?: boolean;
}

export interface RequestRefundInput {
    paymentId: string;
    amount?: number;
    reason: string;
}

// =============================================================================
// Filter Types
// =============================================================================

export interface PaymentFilters {
    patientId?: string;
    doctorId?: string;
    hospitalId?: string;
    status?: PaymentStatus | PaymentStatus[];
    paymentMethod?: PaymentMethod;
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'amount' | 'paidAt';
    sortOrder?: 'asc' | 'desc';
}

export interface RefundFilters {
    paymentId?: string;
    status?: RefundStatus | RefundStatus[];
    refundType?: RefundType;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}
