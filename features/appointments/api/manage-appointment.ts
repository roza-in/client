/**
 * Appointments Feature - Cancel/Reschedule API
 */

import { api, endpoints, ApiError } from '@/lib/api';
import type { Appointment } from '@/types';

// =============================================================================
// Types
// =============================================================================

export interface CancelAppointmentInput {
    appointmentId: string;
    reason: string;
}

export interface RescheduleAppointmentInput {
    appointmentId: string;
    newDate: string;
    newTimeSlot: string;
    reason: string;
}

export interface AppointmentActionResult {
    appointment: Appointment;
    refundEligible?: boolean;
    refundAmount?: number;
}

// =============================================================================
// API Functions
// =============================================================================

/**
 * Cancel an appointment
 */
export async function cancelAppointment(
    input: CancelAppointmentInput
): Promise<AppointmentActionResult> {
    return api.post<AppointmentActionResult>(
        endpoints.appointments.cancel(input.appointmentId),
        { reason: input.reason }
    );
}

/**
 * Reschedule an appointment
 */
export async function rescheduleAppointment(
    input: RescheduleAppointmentInput
): Promise<AppointmentActionResult> {
    return api.post<AppointmentActionResult>(
        endpoints.appointments.reschedule(input.appointmentId),
        {
            newDate: input.newDate,
            newTimeSlot: input.newTimeSlot,
            reason: input.reason,
        }
    );
}

/**
 * Check in for an appointment
 */
export async function checkInAppointment(appointmentId: string): Promise<Appointment> {
    return api.post<Appointment>(endpoints.appointments.checkIn(appointmentId));
}

/**
 * Complete an appointment (doctor action)
 */
export async function completeAppointment(
    appointmentId: string,
    notes?: string
): Promise<Appointment> {
    return api.post<Appointment>(endpoints.appointments.complete(appointmentId), { notes });
}

/**
 * Add vitals to an appointment
 */
export async function addAppointmentVitals(
    appointmentId: string,
    vitals: {
        bloodPressureSystolic?: number;
        bloodPressureDiastolic?: number;
        heartRate?: number;
        temperature?: number;
        weight?: number;
        height?: number;
        spo2?: number;
    }
): Promise<Appointment> {
    return api.post<Appointment>(endpoints.appointments.vitals(appointmentId), vitals);
}

export { ApiError };
