/**
 * Appointment Booking API
 * Complete booking flow with slot locking and payment integration
 */

import { apiClient, ApiError } from '@/lib/api/client';
import type {
    Appointment,
    ConsultationType,
    Gender,
    TimeSlot,
    DayAvailability as GlobalDayAvailability
} from '@/types';

// Use local alias for clarity if needed, but we'll import from global types
type DayAvailability = GlobalDayAvailability;

import { AppointmentWithDetails } from '@/types/models/appointment';

export interface DoctorAvailabilityResponse {
    doctorId: string;
    doctorName: string;
    consultationType: ConsultationType;
    slotDurationMinutes: number;
    availability: DayAvailability[];
}

export type BookAppointmentInput = {
    doctorId: string;
    hospitalId: string;
    appointmentDate: string;
    startTime: string;
    consultationType: ConsultationType;
    familyMemberId?: string;
    patientName: string;
    patientPhone: string;
    patientAge?: number;
    patientGender?: Gender;
    chiefComplaint?: string;
    symptoms?: string[];
    idempotencyKey?: string;
}

export type LockSlotInput = {
    doctorId: string;
    appointmentDate: string;
    startTime: string;
    consultationType: ConsultationType;
}

export interface LockSlotResponse {
    lockId: string;
    lockedUntil: string;
    expiresInSeconds: number;
}

export interface BookingResponse {
    appointment: Appointment;
    requiresPayment: boolean;
    paymentOrder?: {
        orderId: string;
        amount: number;
        currency: string;
        key: string;
    };
}

export interface PaymentVerificationInput {
    appointmentId: string;
    razorpayPaymentId: string;
    razorpayOrderId: string;
    razorpaySignature: string;
}

export interface PaymentVerificationResponse {
    success: boolean;
    appointment: Appointment;
    payment: {
        id: string;
        amount: number;
        status: string;
    };
    whatsappSent: boolean;
}

// =============================================================================
// Helper: Generate Idempotency Key
// =============================================================================

export function generateIdempotencyKey(): string {
    return `booking_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// =============================================================================
// API Functions
// =============================================================================

/**
 * Get doctor availability for date range
 */
export async function getDoctorAvailability(
    doctorId: string,
    startDate: string,
    endDate: string,
    consultationType: ConsultationType = 'in_person'
): Promise<DoctorAvailabilityResponse> {
    return apiClient.get<DoctorAvailabilityResponse>(
        `/doctors/${doctorId}/availability`,
        {
            params: { startDate, endDate, consultationType },
        }
    );
}

/**
 * Get available slots for a specific date
 * @deprecated Use getAvailableSlots from get-slots.ts instead
 */
export async function getAvailableSlots(
    doctorId: string,
    date: string,
    consultationType: ConsultationType = 'in_person'
): Promise<TimeSlot[]> {
    const response = await apiClient.get<{ slots: TimeSlot[] }>(
        `/doctors/${doctorId}/availability`,
        {
            params: { date, consultationType },
        }
    );
    return response.slots || [];
}

/**
 * Lock a slot temporarily to prevent double booking
 * Slot is locked for 5 minutes during checkout
 */
export async function lockSlot(input: LockSlotInput): Promise<LockSlotResponse> {
    return apiClient.post<LockSlotResponse>('/appointments/lock-slot', input);
}

/**
 * Release a locked slot
 */
export async function releaseSlot(lockId: string): Promise<void> {
    await apiClient.delete<void>(`/appointments/lock-slot/${lockId}`);
}

/**
 * Book appointment - Step 1 of booking flow
 * Creates appointment in pending_payment status
 */
export async function bookAppointment(
    input: BookAppointmentInput
): Promise<BookingResponse> {
    const idempotencyKey = input.idempotencyKey || generateIdempotencyKey();

    return apiClient.post<BookingResponse>('/appointments', input, {
        headers: {
            'X-Idempotency-Key': idempotencyKey,
        },
    });
}

/**
 * Create payment order for appointment
 */
export async function createPaymentOrder(appointmentId: string): Promise<{
    orderId: string;
    amount: number;
    currency: string;
    key: string;
    notes: Record<string, string>;
}> {
    return apiClient.post('/payments/create-order', { appointmentId });
}

/**
 * Verify payment and confirm appointment - Step 2 of booking flow
 */
export async function verifyPaymentAndConfirm(
    input: PaymentVerificationInput
): Promise<PaymentVerificationResponse> {
    return apiClient.post<PaymentVerificationResponse>('/payments/verify', {
        gateway_payment_id: input.razorpayPaymentId,
        gateway_order_id: input.razorpayOrderId,
        gateway_signature: input.razorpaySignature,
        provider: 'razorpay',
        appointmentId: input.appointmentId,
    });
}

/**
 * Get appointment details by ID
 */
export async function getAppointment(id: string): Promise<AppointmentWithDetails> {
    return apiClient.get<AppointmentWithDetails>(`/appointments/${id}`);
}

/**
 * Check slot availability before booking
 * Server returns list of available slots - we check if our slot is in it
 */
export async function checkSlotAvailability(
    doctorId: string,
    appointmentDate: string,
    startTime: string,
    consultationType: ConsultationType
): Promise<{ available: boolean; reason?: string }> {
    try {
        const response = await apiClient.get<{
            slots: Array<{ time: string; available: boolean }>
        }>(
            '/appointments/check-availability',
            {
                params: {
                    doctorId,
                    date: appointmentDate,
                    consultationType,
                },
            }
        );

        // Check if the requested slot is in the available slots
        // Normalize time to HH:mm format for comparison (server may return HH:mm:ss)
        const slots = response.slots || [];
        const normalizeTime = (t: string) => t.split(':').slice(0, 2).join(':');
        const normalizedStartTime = normalizeTime(startTime);

        const requestedSlot = slots.find(slot => normalizeTime(slot.time) === normalizedStartTime);

        if (!requestedSlot) {
            return {
                available: false,
                reason: 'This time slot is not available for booking'
            };
        }

        if (!requestedSlot.available) {
            return {
                available: false,
                reason: 'This slot has already been booked'
            };
        }

        return { available: true };
    } catch (error) {
        // If API fails, let booking proceed (it will fail at book step if unavailable)
        console.warn('Failed to check slot availability:', error);
        return { available: true };
    }
}

/**
 * Get consultation fee for doctor
 */
export async function getConsultationFee(
    doctorId: string,
    consultationType: ConsultationType
): Promise<{
    consultationFee: number;
    platformFee: number;
    gstAmount: number;
    totalAmount: number;
}> {
    return apiClient.get('/appointments/fee-breakdown', {
        params: { doctorId, consultationType },
    });
}

/**
 * Get payment configuration for appointment
 */
export async function getPaymentConfig(appointmentId: string): Promise<{
    provider: string;
    amount: number;
    currency: string;
    key_id?: string;
    order_id?: string;
    payment_link?: string;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
}> {
    return apiClient.get(`/payments/config/${appointmentId}`);
}

// =============================================================================
// Complete Booking Flow
// =============================================================================

export interface CompleteBookingInput extends BookAppointmentInput {
    onSlotLocked?: (lockResponse: LockSlotResponse) => void;
    onAppointmentCreated?: (response: BookingResponse) => void;
    onPaymentRequired?: (paymentOrder: BookingResponse['paymentOrder']) => void;
}

export interface CompleteBookingResult {
    success: boolean;
    appointment?: Appointment;
    requiresPayment?: boolean;
    paymentOrder?: BookingResponse['paymentOrder'];
    error?: string;
}

/**
 * Execute complete booking flow:
 * 1. Check slot availability
 * 2. Create appointment (server handles atomic slot locking)
 * 3. Return payment order if needed
 */
export async function executeBookingFlow(
    input: CompleteBookingInput
): Promise<CompleteBookingResult> {
    try {
        // Step 1: Check availability (optional - server will also check)
        const availability = await checkSlotAvailability(
            input.doctorId,
            input.appointmentDate,
            input.startTime,
            input.consultationType
        );

        if (!availability.available) {
            return {
                success: false,
                error: availability.reason || 'Slot is no longer available',
            };
        }

        // Step 2: Create appointment (server handles atomic slot locking)
        const bookingResponse = await bookAppointment({
            ...input,
            idempotencyKey: generateIdempotencyKey(),
        });
        input.onAppointmentCreated?.(bookingResponse);

        // Step 3: Check if payment is required
        if (bookingResponse.requiresPayment && bookingResponse.paymentOrder) {
            input.onPaymentRequired?.(bookingResponse.paymentOrder);
            return {
                success: true,
                appointment: bookingResponse.appointment,
                requiresPayment: true,
                paymentOrder: bookingResponse.paymentOrder,
            };
        }

        // No payment needed (walk-in with cash, or free follow-up)
        return {
            success: true,
            appointment: bookingResponse.appointment,
            requiresPayment: false,
        };
    } catch (error) {
        const message = error instanceof ApiError
            ? error.message
            : 'Booking failed. Please try again.';

        return {
            success: false,
            error: message,
        };
    }
}

// =============================================================================
// Exports
// =============================================================================

export const bookingApi = {
    getDoctorAvailability,
    // getAvailableSlots is omitted here to avoid collision with get-slots.ts
    lockSlot,
    releaseSlot,
    bookAppointment,
    createPaymentOrder,
    verifyPaymentAndConfirm,
    checkSlotAvailability,
    getConsultationFee,
    getPaymentConfig,
    executeBookingFlow,
    generateIdempotencyKey,
    getAppointment,
};

export { ApiError };
