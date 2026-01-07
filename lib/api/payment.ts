/**
 * Payment API
 * Handles all payment-related API calls
 */

import { api, buildQueryParams, type PaginationMeta } from '@/config/api';
import type {
  Payment,
  PaymentWithDetails,
  PaymentFilters,
  Refund,
  RefundInput,
  PaymentStats,
  PaymentMethod,
  PaymentStatus,
} from '@/lib/types';

/**
 * Payment detail type alias
 */
export type PaymentDetail = PaymentWithDetails;

/**
 * Payment order response
 */
export interface PaymentOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  key: string;
  notes?: Record<string, string>;
}

/**
 * Payment verification data
 */
export interface PaymentVerificationData {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

/**
 * Create payment order
 */
export async function createPaymentOrder(
  data: {
    appointmentId: string;
    amount: number;
    currency?: string;
    notes?: Record<string, string>;
  }
): Promise<PaymentOrderResponse> {
  return api.post<PaymentOrderResponse>('/payments/order', data);
}

/**
 * Verify payment
 */
export async function verifyPayment(data: PaymentVerificationData): Promise<Payment> {
  return api.post<Payment>('/payments/verify', data);
}

/**
 * Get payment details
 */
export async function getPayment(id: string): Promise<PaymentDetail> {
  return api.get<PaymentDetail>(`/payments/${id}`);
}

/**
 * List payments with filters
 */
export async function listPayments(
  filters: PaymentFilters = {}
): Promise<{ payments: Payment[]; meta: PaginationMeta }> {
  const params = buildQueryParams(filters as Record<string, unknown>);
  const response = await api.getWithMeta<Payment[]>('/payments', { params });
  return {
    payments: response.data,
    meta: response.meta!,
  };
}

/**
 * Request refund
 */
export async function requestRefund(data: RefundInput): Promise<Refund> {
  return api.post<Refund>('/payments/refund', data);
}

/**
 * Get refund status
 */
export async function getRefundStatus(paymentId: string): Promise<Refund[]> {
  return api.get<Refund[]>(`/payments/${paymentId}/refunds`);
}

/**
 * Get payment statistics (admin/hospital)
 */
export async function getPaymentStats(
  filters: {
    startDate?: string;
    endDate?: string;
    hospitalId?: string;
    doctorId?: string;
  } = {}
): Promise<PaymentStats> {
  const params = buildQueryParams(filters);
  return api.get<PaymentStats>('/payments/stats', { params });
}

/**
 * Get payment by appointment
 */
export async function getPaymentByAppointment(appointmentId: string): Promise<Payment | null> {
  try {
    return await api.get<Payment>(`/payments/appointment/${appointmentId}`);
  } catch {
    return null;
  }
}

/**
 * Get patient payments
 */
export async function getPatientPayments(
  patientId: string,
  filters: Omit<PaymentFilters, 'patientId'> = {}
): Promise<{ payments: Payment[]; meta: PaginationMeta }> {
  return listPayments({ ...filters, patientId });
}

/**
 * Get hospital payments
 */
export async function getHospitalPayments(
  hospitalId: string,
  filters: Omit<PaymentFilters, 'hospitalId'> = {}
): Promise<{ payments: Payment[]; meta: PaginationMeta }> {
  return listPayments({ ...filters, hospitalId });
}

/**
 * Get recent payments
 */
export async function getRecentPayments(
  options: {
    limit?: number;
    status?: PaymentStatus;
  } = {}
): Promise<Payment[]> {
  const params = buildQueryParams({
    sortBy: 'createdAt',
    sortOrder: 'desc',
    limit: options.limit || 10,
    status: options.status,
  });
  return api.get<Payment[]>('/payments', { params });
}

/**
 * Get pending payments
 */
export async function getPendingPayments(
  options: { limit?: number } = {}
): Promise<Payment[]> {
  return getRecentPayments({ ...options, status: 'pending' });
}

/**
 * Calculate service fee
 */
export function calculateServiceFee(amount: number, feePercentage: number = 5): number {
  return Math.round(amount * (feePercentage / 100) * 100) / 100;
}

/**
 * Calculate total with fee
 */
export function calculateTotalWithFee(
  consultationFee: number,
  serviceFeePercentage: number = 5
): {
  consultationFee: number;
  serviceFee: number;
  total: number;
} {
  const serviceFee = calculateServiceFee(consultationFee, serviceFeePercentage);
  return {
    consultationFee,
    serviceFee,
    total: consultationFee + serviceFee,
  };
}

/**
 * Format currency
 */
export function formatCurrency(
  amount: number,
  currency: string = 'INR',
  locale: string = 'en-IN'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Payment API namespace export
 */
export const paymentApi = {
  createOrder: createPaymentOrder,
  verify: verifyPayment,
  get: getPayment,
  list: listPayments,
  requestRefund,
  getRefundStatus,
  getStats: getPaymentStats,
  getByAppointment: getPaymentByAppointment,
  getPatientPayments,
  getHospitalPayments,
  getRecent: getRecentPayments,
  getPending: getPendingPayments,
  calculateServiceFee,
  calculateTotalWithFee,
  formatCurrency,
};
