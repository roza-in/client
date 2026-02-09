/**
 * Hospital Doctors Hooks
 * Hooks for managing doctors within a hospital context
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store';
import { getHospitalDoctors, addDoctor } from '../api/hospitals';
import type { Doctor } from '@/types';

// =============================================================================
// Query Keys
// =============================================================================

export const hospitalDoctorKeys = {
    all: ['hospital-doctors'] as const,
    list: (hospitalId: string) => [...hospitalDoctorKeys.all, 'list', hospitalId] as const,
    detail: (doctorId: string) => [...hospitalDoctorKeys.all, 'detail', doctorId] as const,
};

// =============================================================================
// Hooks
// =============================================================================

/**
 * Hook to fetch doctors for the current hospital
 */
export function useHospitalDoctors(params?: { page?: number; limit?: number; search?: string }) {
    const { user } = useAuthStore();
    const hospitalId = user?.hospital?.id;

    return useQuery({
        queryKey: hospitalId ? [...hospitalDoctorKeys.list(hospitalId), params] : ['hospital-doctors', 'disabled'],
        queryFn: () => getHospitalDoctors(hospitalId!, params),
        enabled: !!hospitalId,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}

/**
 * Hook to add a new doctor to the hospital
 */
export function useAddDoctor() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const hospitalId = user?.hospital?.id;

    return useMutation({
        mutationFn: (data: any) => addDoctor(hospitalId!, data),
        onSuccess: () => {
            // Invalidate doctors list to refetch
            if (hospitalId) {
                queryClient.invalidateQueries({ queryKey: hospitalDoctorKeys.list(hospitalId) });
            }
        },
    });
}
