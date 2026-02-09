/**
 * Patients Feature - Hooks
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getFamilyMembers,
    createFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
    type CreateFamilyMemberInput,
    type UpdateFamilyMemberInput,
} from '../api/family-members';
import {
    getHealthRecords,
    uploadHealthRecord,
    deleteHealthRecord,
    type HealthRecordFilters,
    type UploadHealthRecordInput,
} from '../api/health-records';
import { toast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/api';

// =============================================================================
// Query Keys
// =============================================================================

export const patientKeys = {
    familyMembers: ['family-members'] as const,
    healthRecords: () => ['health-records'] as const,
    healthRecordList: (filters: HealthRecordFilters) => [...patientKeys.healthRecords(), 'list', filters] as const,
};

// =============================================================================
// Family Members Hooks
// =============================================================================

export function useFamilyMembers() {
    return useQuery({
        queryKey: patientKeys.familyMembers,
        queryFn: getFamilyMembers,
        staleTime: 10 * 60 * 1000,
    });
}

export function useCreateFamilyMember() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createFamilyMember,
        onSuccess: () => {
            toast.success('Family member added');
            queryClient.invalidateQueries({ queryKey: patientKeys.familyMembers });
        },
        onError: (err) => {
            toast.error(getErrorMessage(err));
        },
    });
}

export function useUpdateFamilyMember() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateFamilyMemberInput }) =>
            updateFamilyMember(id, data),
        onSuccess: () => {
            toast.success('Family member updated');
            queryClient.invalidateQueries({ queryKey: patientKeys.familyMembers });
        },
        onError: (err) => {
            toast.error(getErrorMessage(err));
        },
    });
}

export function useDeleteFamilyMember() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteFamilyMember,
        onSuccess: () => {
            toast.success('Family member removed');
            queryClient.invalidateQueries({ queryKey: patientKeys.familyMembers });
        },
        onError: (err) => {
            toast.error(getErrorMessage(err));
        },
    });
}

// =============================================================================
// Health Records Hooks
// =============================================================================

export function useHealthRecords(filters?: HealthRecordFilters) {
    return useQuery({
        queryKey: patientKeys.healthRecordList(filters || {}),
        queryFn: () => getHealthRecords(filters),
        staleTime: 5 * 60 * 1000,
    });
}

export function useUploadHealthRecord() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: uploadHealthRecord,
        onSuccess: () => {
            toast.success('Health record uploaded');
            queryClient.invalidateQueries({ queryKey: patientKeys.healthRecords() });
        },
        onError: (err) => {
            toast.error(getErrorMessage(err));
        },
    });
}

export function useDeleteHealthRecord() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteHealthRecord,
        onSuccess: () => {
            toast.success('Health record deleted');
            queryClient.invalidateQueries({ queryKey: patientKeys.healthRecords() });
        },
        onError: (err) => {
            toast.error(getErrorMessage(err));
        },
    });
}
