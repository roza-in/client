'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    joinWaitlist,
    getMyWaitlistEntries,
    getWaitingPatients,
    cancelWaitlistEntry,
} from '../api/waitlist-api';
import type { JoinWaitlistInput } from '@/types';

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const waitlistKeys = {
    all: ['waitlist'] as const,
    myEntries: () => [...waitlistKeys.all, 'my'] as const,
    doctorWaiting: (doctorId: string) => [...waitlistKeys.all, 'doctor', doctorId] as const,
};

// ─── Query Hooks ──────────────────────────────────────────────────────────────

export function useMyWaitlistEntries() {
    return useQuery({
        queryKey: waitlistKeys.myEntries(),
        queryFn: getMyWaitlistEntries,
        staleTime: 1 * 60 * 1000,
    });
}

export function useWaitingPatients(doctorId: string) {
    return useQuery({
        queryKey: waitlistKeys.doctorWaiting(doctorId),
        queryFn: () => getWaitingPatients(doctorId),
        enabled: !!doctorId,
        staleTime: 1 * 60 * 1000,
    });
}

// ─── Mutation Hooks ───────────────────────────────────────────────────────────

export function useJoinWaitlist() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: JoinWaitlistInput) => joinWaitlist(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: waitlistKeys.all });
        },
    });
}

export function useCancelWaitlistEntry() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (entryId: string) => cancelWaitlistEntry(entryId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: waitlistKeys.all });
        },
    });
}
