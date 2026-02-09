'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { consultationsApi } from '../api/consultations';
import { useToast } from '@/hooks/use-toast';
import { useCallback, useRef, useState, useEffect } from 'react';
import { ApiError } from '@/lib/api/error-handler';

export function useConsultationRoom(appointmentId: string, consultationId?: string) {
    const queryClient = useQueryClient();
    const { toast, success, error: toastError } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    // Fetch consultation by appointmentId if no consultationId is provided
    const { data: consultationByApp, isLoading: isLoadingByApp } = useQuery({
        queryKey: ['consultations', 'appointment', appointmentId],
        queryFn: async () => {
            const response = await consultationsApi.listConsultations({ appointmentId });
            return response[0] || null;
        },
        enabled: !!appointmentId && !consultationId,
        refetchInterval: (query) => (query.state.data ? false : 3000), // Poll every 3s until consultation is found
        retry: (failureCount, error) => {
            if (error instanceof ApiError && error.status === 401) return false;
            return failureCount < 3;
        }
    });

    const effectiveConsultationId = consultationId || consultationByApp?.id;

    // Fetch consultation details
    const { data: consultation, isLoading: isLoadingDetails, error } = useQuery({
        queryKey: ['consultation', effectiveConsultationId],
        queryFn: () => consultationsApi.getConsultation(effectiveConsultationId!),
        enabled: !!effectiveConsultationId,
        refetchInterval: (query) => (query.state.data?.status === 'completed' ? false : 5000), // Poll details every 5s if not completed
        retry: (failureCount, error) => {
            if (error instanceof ApiError && error.status === 401) return false;
            return failureCount < 3;
        }
    });

    const activeConsultation = consultation || consultationByApp;
    const loading = isLoadingByApp || isLoadingDetails;

    // Mutations
    const startMutation = useMutation({
        mutationFn: (id: string) => consultationsApi.startConsultation(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['consultation'] });
            success('Consultation started');
        },
        onError: (err: any) => {
            toastError('Failed to start consultation', {
                description: err.message,
            });
        },
    });

    const notesMutation = useMutation({
        mutationFn: ({ id, notes }: { id: string; notes: string }) =>
            consultationsApi.updateNotes(id, notes),
        onSettled: () => setIsSaving(false),
    });

    const vitalsMutation = useMutation({
        mutationFn: ({ id, vitals }: { id: string; vitals: any }) =>
            consultationsApi.updateVitals(id, vitals),
        onSuccess: () => success('Vitals updated'),
    });

    const joinMutation = useMutation({
        mutationFn: (id: string) => consultationsApi.joinConsultation(id),
    });

    const endMutation = useMutation({
        mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
            consultationsApi.endConsultation(id, notes),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['consultation'] });
            success('Consultation ended');
        },
        onError: (err: any) => {
            toastError('Failed to end consultation', {
                description: err.message,
            });
        },
    });

    // Custom debounced notes update
    const updateNotes = useCallback((notes: string) => {
        if (!effectiveConsultationId) return;

        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        setIsSaving(true);
        debounceTimer.current = setTimeout(() => {
            notesMutation.mutate({ id: effectiveConsultationId, notes });
        }, 2000);
    }, [effectiveConsultationId, notesMutation]);

    // Auto-join when consultation is available
    useEffect(() => {
        if (effectiveConsultationId) {
            joinMutation.mutate(effectiveConsultationId);
        }
    }, [effectiveConsultationId]); // Only join once when ID becomes available

    return {
        consultation: activeConsultation,
        isLoading: loading,
        error,
        isSaving,
        startConsultation: startMutation.mutateAsync,
        endConsultation: endMutation.mutateAsync,
        updateNotes,
        updateVitals: (vitals: any) => {
            if (effectiveConsultationId) vitalsMutation.mutate({ id: effectiveConsultationId, vitals });
        },
        joinConsultation: () => {
            if (effectiveConsultationId) joinMutation.mutate(effectiveConsultationId);
        },
        isStarting: startMutation.isPending,
        isEnding: endMutation.isPending,
    };
}
