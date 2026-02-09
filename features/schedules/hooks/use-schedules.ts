/**
 * Schedule Hooks - Hospital Dashboard
 * React Query hooks for schedule management
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    getDoctorSchedule,
    createSchedule,
    bulkCreateSchedules,
    updateSchedule,
    deleteSchedule,
    createOverride,
    getOverrides,
    deleteOverride,
    type CreateScheduleInput,
    type BulkScheduleInput,
    type UpdateScheduleInput,
    type CreateOverrideInput,
} from '../api/schedule';

// =============================================================================
// Query Keys
// =============================================================================

export const scheduleKeys = {
    all: ['schedules'] as const,
    doctor: (doctorId: string) => [...scheduleKeys.all, 'doctor', doctorId] as const,
    overrides: (doctorId: string) => [...scheduleKeys.all, 'overrides', doctorId] as const,
};

// =============================================================================
// Query Hooks
// =============================================================================

/**
 * Hook to fetch doctor's weekly schedule
 */
export function useDoctorSchedule(doctorId: string | null) {
    return useQuery({
        queryKey: doctorId ? scheduleKeys.doctor(doctorId) : ['schedule', 'disabled'],
        queryFn: () => getDoctorSchedule(doctorId!),
        enabled: !!doctorId,
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Hook to fetch schedule overrides
 */
export function useScheduleOverrides(doctorId: string | null, startDate?: string, endDate?: string) {
    return useQuery({
        queryKey: doctorId ? [...scheduleKeys.overrides(doctorId), startDate, endDate] : ['overrides', 'disabled'],
        queryFn: () => getOverrides(doctorId!, startDate, endDate),
        enabled: !!doctorId,
        staleTime: 5 * 60 * 1000,
    });
}

// =============================================================================
// Mutation Hooks
// =============================================================================

/**
 * Hook to create a single schedule
 */
export function useCreateSchedule() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ doctorId, data }: { doctorId: string; data: CreateScheduleInput }) =>
            createSchedule(doctorId, data),
        onSuccess: (_, { doctorId }) => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.doctor(doctorId) });
            toast.success('Schedule created successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create schedule');
        },
    });
}

/**
 * Hook to bulk create/replace schedules
 */
export function useBulkCreateSchedules() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ doctorId, data }: { doctorId: string; data: BulkScheduleInput }) =>
            bulkCreateSchedules(doctorId, data),
        onSuccess: (_, { doctorId }) => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.doctor(doctorId) });
            toast.success('Schedules updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update schedules');
        },
    });
}

/**
 * Hook to update a schedule
 */
export function useUpdateSchedule() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ scheduleId, data }: { scheduleId: string; data: UpdateScheduleInput }) =>
            updateSchedule(scheduleId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
            toast.success('Schedule updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update schedule');
        },
    });
}

/**
 * Hook to delete a schedule
 */
export function useDeleteSchedule() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (scheduleId: string) => deleteSchedule(scheduleId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
            toast.success('Schedule deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete schedule');
        },
    });
}

/**
 * Hook to create schedule override
 */
export function useCreateOverride() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ doctorId, data }: { doctorId: string; data: CreateOverrideInput }) =>
            createOverride(doctorId, data),
        onSuccess: (_, { doctorId }) => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.overrides(doctorId) });
            toast.success('Override created successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create override');
        },
    });
}

/**
 * Hook to delete schedule override
 */
export function useDeleteOverride() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (overrideId: string) => deleteOverride(overrideId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
            toast.success('Override deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete override');
        },
    });
}
