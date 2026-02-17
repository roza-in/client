/**
 * Prescriptions Feature - Hooks
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getPrescriptions,
    getPrescription,
    createPrescription,
    updatePrescription,
} from '../api/prescriptions';
import type {
    PrescriptionFilters,
    CreatePrescriptionInput,
    UpdatePrescriptionInput
} from '@/types';
import { toast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/api';

// =============================================================================
// Query Keys
// =============================================================================

export const prescriptionKeys = {
    all: ['prescriptions'] as const,
    lists: () => [...prescriptionKeys.all, 'list'] as const,
    list: (filters: PrescriptionFilters) => [...prescriptionKeys.lists(), filters] as const,
    details: () => [...prescriptionKeys.all, 'detail'] as const,
    detail: (id: string) => [...prescriptionKeys.details(), id] as const,
    forAppointment: (appointmentId: string) => [...prescriptionKeys.all, 'appointment', appointmentId] as const,
};

// =============================================================================
// Hooks
// =============================================================================

/**
 * Hook to fetch prescriptions list
 */
export function usePrescriptions(params?: PrescriptionFilters) {
    return useQuery({
        queryKey: prescriptionKeys.list(params || {}),
        queryFn: () => getPrescriptions(params),
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Hook to fetch a single prescription
 */
export function usePrescription(id: string | null) {
    return useQuery({
        queryKey: id ? prescriptionKeys.detail(id) : ['prescription', 'disabled'],
        queryFn: () => getPrescription(id!),
        enabled: !!id,
        staleTime: 10 * 60 * 1000,
    });
}

/**
 * Hook to create a prescription
 */
export function useCreatePrescription() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createPrescription,
        onSuccess: (data) => {
            toast.success('Prescription created');
            queryClient.invalidateQueries({ queryKey: prescriptionKeys.all });
            // Also invalidate the appointment to reflect prescription status
            queryClient.invalidateQueries({ queryKey: ['appointments', 'detail', data.appointmentId] });
        },
        onError: (err) => {
            toast.error(getErrorMessage(err));
        },
    });
}

/**
 * Hook to update a prescription
 */
export function useUpdatePrescription() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdatePrescriptionInput }) =>
            updatePrescription(id, data),
        onSuccess: (data, { id }) => {
            toast.success('Prescription updated');
            queryClient.invalidateQueries({ queryKey: prescriptionKeys.detail(id) });
        },
        onError: (err) => {
            toast.error(getErrorMessage(err));
        },
    });
}
