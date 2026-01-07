/**
 * ROZX Healthcare Platform - Payment Types
 */

import type {
  PaymentStatus,
  PaymentMethod,
  PaymentGateway,
  TransactionType,
  RefundType,
  RefundStatus,
  SettlementStatus,
} from './enums';

// ============================================================================
// Payment Types
// ============================================================================

export interface Payment {
  id: string;
  appointmentId: string | null;
  payerId: string;
  hospitalId: string;
  doctorId: string | null;
  transactionType: TransactionType;
  consultationFee: number;
  platformFee: number;
  gatewayFee: number;
  gstAmount: number;
  totalAmount: number;
  discountAmount: number;
  hospitalNetAmount: number;
  paymentMethod: PaymentMethod;
  paymentGateway: PaymentGateway | null;
  gatewayTransactionId: string | null;
  gatewayOrderId: string | null;
  gatewayPaymentId: string | null;
  gatewaySignature: string | null;
  status: PaymentStatus;
  failureReason: string | null;
  refundAmount: number | null;
  refundReason: string | null;
  refundedAt: string | null;
  settledToHospital: boolean;
  settlementId: string | null;
  settlementDate: string | null;
  settlementUtr: string | null;
  invoiceNumber: string | null;
  invoiceUrl: string | null;
  receiptUrl: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  paidAt: string | null;
}

// ============================================================================
// Payment List Types
// ============================================================================

export interface PaymentListItem {
  id: string;
  appointmentId: string | null;
  transactionType: TransactionType;
  totalAmount: number;
  hospitalNetAmount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  patientName: string;
  doctorName: string;
  paidAt: string | null;
  createdAt: string;
}

export interface PaymentWithDetails extends Payment {
  appointment?: {
    id: string;
    bookingId: string;
    appointmentDate: string;
    doctorName: string;
    patientName: string;
  };
  patient: {
    id: string;
    fullName: string;
    phone: string;
    email: string | null;
  };
  hospital: {
    id: string;
    name: string;
  };
}

// ============================================================================
// Refund Types
// ============================================================================

export interface Refund {
  id: string;
  paymentId: string;
  refundType: RefundType;
  originalAmount: number;
  refundPercentage: number;
  refundAmount: number;
  reason: string;
  status: RefundStatus;
  processedBy: string | null;
  gatewayRefundId: string | null;
  failureReason: string | null;
  createdAt: string;
  processedAt: string | null;
}

export interface RefundInput {
  reason: string;
  amount?: number;
  refundType?: RefundType;
}

// ============================================================================
// Payment Filters Types
// ============================================================================

export interface PaymentFilters {
  hospitalId?: string;
  doctorId?: string;
  patientId?: string;
  status?: PaymentStatus | PaymentStatus[];
  transactionType?: TransactionType;
  paymentMethod?: PaymentMethod;
  startDate?: string;
  endDate?: string;
  settled?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'amount' | 'paidAt';
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// Payment Stats Types
// ============================================================================

export interface PaymentStats {
  totalRevenue: number;
  platformFees: number;
  gatewayFees: number;
  netRevenue: number;
  pendingSettlement: number;
  refunds: number;
  transactionCount: number;
  successRate: number;
}

export interface RevenueBreakdown {
  online: number;
  inPerson: number;
  walkIn: number;
  followUp: number;
}

export interface PaymentTrend {
  date: string;
  revenue: number;
  transactions: number;
  refunds: number;
}

export interface DailyRevenue {
  date: string;
  consultationFees: number;
  platformFees: number;
  netRevenue: number;
  appointmentCount: number;
}

// ============================================================================
// Payout Types
// ============================================================================

export interface DoctorPayout {
  doctorId: string;
  doctorName: string;
  totalConsultations: number;
  grossAmount: number;
  payoutAmount: number;
  pendingPayout: number;
  lastPaidAt: string | null;
}

export interface PayoutHistory {
  id: string;
  doctorId: string;
  amount: number;
  period: string;
  consultationCount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paidAt: string | null;
  transactionId: string | null;
  createdAt: string;
}

// ============================================================================
// Settlement Types
// ============================================================================

export interface Settlement {
  id: string;
  hospitalId: string;
  settlementNumber: string;
  periodStart: string;
  periodEnd: string;
  grossAmount: number;
  platformFee: number;
  gatewayFee: number;
  gstAmount: number;
  netAmount: number;
  appointmentCount: number;
  status: SettlementStatus;
  bankAccountNumber: string | null;
  ifscCode: string | null;
  utrNumber: string | null;
  settledAt: string | null;
  createdAt: string;
}

export interface SettlementLineItem {
  id: string;
  settlementId: string;
  paymentId: string;
  appointmentId: string;
  consultationFee: number;
  platformFee: number;
  netAmount: number;
  appointmentDate: string;
  doctorName: string;
  patientName: string;
}

// ============================================================================
// Payment Input Types
// ============================================================================

export interface InitiatePaymentInput {
  appointmentId: string;
  paymentMethod: PaymentMethod;
}

export interface PaymentVerification {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface CashfreePaymentVerification {
  orderId: string;
  paymentId: string;
}

// ============================================================================
// Invoice Types
// ============================================================================

export interface Invoice {
  id: string;
  invoiceNumber: string;
  paymentId: string | null;
  hospitalId: string;
  patientId: string;
  invoiceType: 'consultation' | 'subscription' | 'other';
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'cancelled';
  dueDate: string | null;
  paidAt: string | null;
  pdfUrl: string | null;
  createdAt: string;
}

// ============================================================================
// Patient Credit Types
// ============================================================================

export interface PatientCredit {
  id: string;
  patientId: string;
  creditType: 'refund' | 'promotional' | 'compensation' | 'referral';
  amount: number;
  balanceRemaining: number;
  reason: string;
  expiresAt: string | null;
  sourcePaymentId: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreditTransaction {
  id: string;
  creditId: string;
  transactionType: 'credit' | 'debit';
  amount: number;
  balanceAfter: number;
  appointmentId: string | null;
  description: string;
  createdAt: string;
}
