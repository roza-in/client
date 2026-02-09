import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createWalkInBooking, registerPatient } from '../api/reception.api';
import type { WalkInBookingInput, WalkInBookingResponse } from '../types';
import { toast } from 'sonner';

/**
 * Hook for creating a walk-in booking
 */
export function useWalkInBooking() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: WalkInBookingInput) => createWalkInBooking(data),
        onSuccess: (data) => {
            toast.success(`Walk-in booked successfully. Token: ${data.appointment.appointmentNumber}`);
            // Invalidate queue to refresh data
            queryClient.invalidateQueries({ queryKey: ['reception-queue'] });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create walk-in booking');
        },
    });
}

/**
 * Hook for registering a new patient
 */
export function useRegisterPatient() {
    return useMutation({
        mutationFn: (data: {
            name: string;
            phone: string;
            email?: string;
            dateOfBirth?: string;
            gender?: 'male' | 'female' | 'other';
        }) => registerPatient(data),
        onSuccess: () => {
            toast.success('Patient registered successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to register patient');
        },
    });
}
