/**
 * Appointments Feature - List Appointments Hook
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, endpoints, getErrorMessage } from '@/lib/api';
import type { Appointment, AppointmentListItem, PaginatedResponse } from '@/types';
import { toast } from '@/hooks/use-toast';

// =============================================================================
// Query Keys
// =============================================================================

export const appointmentKeys = {
    all: ['appointments'] as const,
    lists: () => [...appointmentKeys.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...appointmentKeys.lists(), filters] as const,
    details: () => [...appointmentKeys.all, 'detail'] as const,
    detail: (id: string) => [...appointmentKeys.details(), id] as const,
    upcoming: () => [...appointmentKeys.all, 'upcoming'] as const,
    history: () => [...appointmentKeys.all, 'history'] as const,
};

// =============================================================================
// Types
// =============================================================================

export interface AppointmentFilters {
    status?: string;
    consultationType?: string;
    doctorId?: string;
    patientId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    [key: string]: any;
}

// =============================================================================
// Hooks
// =============================================================================

/**
 * Hook to fetch paginated appointments list
 */
export function useAppointments(filters: AppointmentFilters = {}) {
    return useQuery({
        queryKey: appointmentKeys.list(filters),
        queryFn: async () => {
            const { data, meta } = await api.getWithMeta<AppointmentListItem[]>(
                endpoints.appointments.list,
                { params: filters }
            );
            return { appointments: data, pagination: meta };
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}

/**
 * Hook to fetch a single appointment
 */
export function useAppointment(id: string) {
    return useQuery({
        queryKey: appointmentKeys.detail(id),
        queryFn: () => api.get<Appointment>(endpoints.appointments.get(id)),
        enabled: !!id,
        staleTime: 1 * 60 * 1000, // 1 minute
    });
}

/**
 * Hook to fetch upcoming appointments
 */
export function useUpcomingAppointments() {
    return useQuery({
        queryKey: appointmentKeys.upcoming(),
        queryFn: () => api.get<AppointmentListItem[]>(endpoints.appointments.upcoming),
        staleTime: 2 * 60 * 1000,
    });
}

/**
 * Hook to fetch appointment history
 */
export function useAppointmentHistory(page: number = 1, limit: number = 10) {
    return useQuery({
        queryKey: [...appointmentKeys.history(), { page, limit }],
        queryFn: async () => {
            const { data, meta } = await api.getWithMeta<AppointmentListItem[]>(
                endpoints.appointments.history,
                { params: { page, limit } }
            );
            return { appointments: data, pagination: meta };
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook for appointment actions (cancel, reschedule, check-in)
 */
export function useAppointmentActions() {
    const queryClient = useQueryClient();

    const invalidateAppointments = () => {
        queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    };

    const cancelMutation = useMutation({
        mutationFn: async ({ id, reason }: { id: string; reason: string }) =>
            api.post(endpoints.appointments.cancel(id), { reason }),
        onSuccess: () => {
            toast.success('Appointment cancelled');
            invalidateAppointments();
        },
        onError: (err) => {
            toast.error(getErrorMessage(err));
        },
    });

    const checkInMutation = useMutation({
        mutationFn: (id: string) => api.post(endpoints.appointments.checkIn(id)),
        onSuccess: () => {
            toast.success('Checked in successfully');
            invalidateAppointments();
        },
        onError: (err) => {
            toast.error(getErrorMessage(err));
        },
    });

    return {
        cancel: cancelMutation.mutateAsync,
        checkIn: checkInMutation.mutateAsync,
        isCancelling: cancelMutation.isPending,
        isCheckingIn: checkInMutation.isPending,
    };
}
