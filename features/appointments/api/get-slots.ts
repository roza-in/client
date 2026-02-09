/**
 * Appointments Feature - Slots API
 */

import { api, endpoints } from '@/lib/api';
import type { TimeSlot, DayAvailability } from '@/types';

// =============================================================================
// Types
// =============================================================================

export interface GetSlotsInput {
    doctorId: string;
    date: string;
    hospitalId?: string;
    consultationType?: 'in_person' | 'online' | 'phone' | 'home_visit';
}

export interface AvailabilityResponse {
    doctorId: string;
    date: string;
    slots: TimeSlot[];
    consultationFee: number;
    platformFee: number;
    totalFee: number;
}

export interface WeekAvailabilityResponse {
    doctorId: string;
    startDate: string;
    endDate: string;
    availability: DayAvailability[];
}

// =============================================================================
// API Functions
// =============================================================================

/**
 * Get available slots for a specific date
 */
export async function getAvailableSlots(input: GetSlotsInput): Promise<AvailabilityResponse> {
    return api.get<AvailabilityResponse>(endpoints.appointments.checkAvailability, {
        params: input as any,
    });
}

/**
 * Get weekly availability for a doctor
 */
export async function getWeeklyAvailability(
    doctorId: string,
    startDate: string
): Promise<WeekAvailabilityResponse> {
    return api.get<WeekAvailabilityResponse>(endpoints.doctors.availability(doctorId), {
        params: { startDate },
    });
}

/**
 * Get consultation fee breakdown
 */
export async function getConsultationFeeBreakdown(params: {
    doctorId: string;
    consultationType: 'in_person' | 'online' | 'phone' | 'home_visit';
    hospitalId?: string;
}): Promise<{
    consultationFee: number;
    platformFee: number;
    gst: number;
    totalFee: number;
}> {
    return api.get(endpoints.appointments.feeBreakdown, { params: params as any });
}
