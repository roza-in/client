/**
 * Appointments Feature - Available Slots Hook
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { getAvailableSlots, getWeeklyAvailability, getConsultationFeeBreakdown } from '../api/get-slots';
import type { GetSlotsInput } from '../api/get-slots';

// =============================================================================
// Query Keys
// =============================================================================

export const slotKeys = {
    all: ['slots'] as const,
    forDate: (input: GetSlotsInput) => [...slotKeys.all, 'date', input] as const,
    weekly: (doctorId: string, startDate: string) => [...slotKeys.all, 'weekly', doctorId, startDate] as const,
    fee: (doctorId: string, consultationType: string) => [...slotKeys.all, 'fee', doctorId, consultationType] as const,
};

// =============================================================================
// Hooks
// =============================================================================

/**
 * Hook to fetch available slots for a specific date
 */
export function useAvailableSlots(input: GetSlotsInput | null) {
    return useQuery({
        queryKey: input ? slotKeys.forDate(input) : ['slots', 'disabled'],
        queryFn: () => getAvailableSlots(input!),
        enabled: !!input?.doctorId && !!input?.date,
        staleTime: 30 * 1000, // 30 seconds - slots can change frequently
        refetchInterval: 60 * 1000, // Refresh every minute
    });
}

/**
 * Hook to fetch weekly availability
 */
export function useWeeklyAvailability(doctorId: string | null, startDate: string) {
    return useQuery({
        queryKey: doctorId ? slotKeys.weekly(doctorId, startDate) : ['slots', 'disabled'],
        queryFn: () => getWeeklyAvailability(doctorId!, startDate),
        enabled: !!doctorId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
