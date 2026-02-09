import { api } from '@/lib/api';
import type { QueueResponse, WalkInBookingInput, WalkInBookingResponse, PatientSearchResult, QueueAppointment, CheckInWithPaymentInput, CheckInWithPaymentResponse } from '../types';

/**
 * Reception API Functions
 */

const BASE_URL = '/reception';

/**
 * Get today's appointment queue for the hospital
 */
export async function getQueue(
    date?: string,
    status?: string,
    doctorId?: string
): Promise<QueueResponse> {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (status) params.append('status', status);
    if (doctorId) params.append('doctorId', doctorId);

    const queryString = params.toString();
    const url = `${BASE_URL}/queue${queryString ? `?${queryString}` : ''}`;

    return api.get<QueueResponse>(url);
}

/**
 * Check in a patient for their appointment
 */
export async function checkInPatient(appointmentId: string): Promise<QueueAppointment> {
    return api.patch<QueueAppointment>(`${BASE_URL}/appointments/${appointmentId}/check-in`);
}

/**
 * Check in a patient for their appointment and collect payment
 */
export const checkInWithPayment = async (input: CheckInWithPaymentInput): Promise<CheckInWithPaymentResponse> => {
    return api.patch<CheckInWithPaymentResponse>(
        `/reception/appointments/${input.appointmentId}/check-in-with-payment`,
        { amount: input.amount, method: input.method }
    );
};

export const getAppointmentDetails = async (appointmentId: string): Promise<any> => {
    return api.get<any>(`/appointments/${appointmentId}`);
};
/**
 * Mark an appointment as no-show
 */
export async function markNoShow(appointmentId: string, reason?: string): Promise<QueueAppointment> {
    return api.patch<QueueAppointment>(`${BASE_URL}/appointments/${appointmentId}/no-show`, { reason });
}

/**
 * Create a walk-in booking with cash payment
 */
export async function createWalkInBooking(data: WalkInBookingInput): Promise<WalkInBookingResponse> {
    return api.post<WalkInBookingResponse>(`${BASE_URL}/walk-in`, data);
}

/**
 * Search patients by phone or name
 */
export async function searchPatients(
    query: string,
    limit: number = 20
): Promise<PatientSearchResult[]> {
    if (query.length < 2) return [];
    return api.get<PatientSearchResult[]>(`${BASE_URL}/patients/search?q=${encodeURIComponent(query)}&limit=${limit}`);
}

/**
 * Register a new walk-in patient
 */
export async function registerPatient(data: {
    name: string;
    phone: string;
    email?: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other';
}): Promise<{ id: string; name: string; phone: string }> {
    return api.post<{ id: string; name: string; phone: string }>(`${BASE_URL}/patients`, data);
}

/**
 * Record a cash payment for an appointment
 */
export async function recordCashPayment(data: {
    appointmentId: string;
    amount: number;
    receiptNumber?: string;
}): Promise<any> {
    return api.post(`${BASE_URL}/payments/cash`, data);
}
