import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getQueue, checkInPatient, checkInWithPayment, markNoShow, getAppointmentDetails } from '../api/reception.api';
import type { CheckInWithPaymentInput } from '../types';
import { toast } from 'sonner';

/**
 * Hook for fetching the reception queue
 */
export function useReceptionQueue(
    date?: string,
    status?: string,
    doctorId?: string
) {
    return useQuery({
        queryKey: ['reception-queue', date, status, doctorId],
        queryFn: () => getQueue(date, status, doctorId),
        refetchInterval: 30000, // Refresh every 30 seconds
        staleTime: 10000, // Consider data stale after 10 seconds
    });
}

/**
 * Hook for checking in a patient
 */
export function useCheckInPatient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (appointmentId: string) => checkInPatient(appointmentId),
        onSuccess: (data) => {
            toast.success('Patient checked in successfully');
            // Invalidate queue to refresh data
            queryClient.invalidateQueries({ queryKey: ['reception-queue'] });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to check in patient');
        },
    });
}

export const useAppointmentDetails = (appointmentId: string | null) => {
    return useQuery({
        queryKey: ['appointment-details', appointmentId],
        queryFn: () => (appointmentId ? getAppointmentDetails(appointmentId) : null),
        enabled: !!appointmentId,
    });
};

/**
 * Hook for checking in a patient with payment
 */
export function useCheckInWithPayment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CheckInWithPaymentInput) => checkInWithPayment(data),
        onSuccess: () => {
            toast.success('Patient checked in and payment recorded');
            queryClient.invalidateQueries({ queryKey: ['reception-queue'] });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to complete check-in');
        },
    });
}

/**
 * Hook for marking a patient as no-show
 */
export function useMarkNoShow() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ appointmentId, reason }: { appointmentId: string; reason?: string }) =>
            markNoShow(appointmentId, reason),
        onSuccess: () => {
            toast.success('Marked as no-show');
            queryClient.invalidateQueries({ queryKey: ['reception-queue'] });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to mark no-show');
        },
    });
}
