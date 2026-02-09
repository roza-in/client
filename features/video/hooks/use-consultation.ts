/**
 * Video Feature - Consultation Hook
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    joinVideoRoom,
    leaveVideoRoom,
    getVideoRoomStatus,
    reportIssue,
    type VideoRoom,
} from '../api/consultation';
import { toast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/api';

// =============================================================================
// Types
// =============================================================================

export interface UseConsultationReturn {
    room: VideoRoom | null;
    isJoining: boolean;
    isConnected: boolean;
    isError: boolean;
    error: string | null;
    join: () => Promise<void>;
    leave: () => Promise<void>;
    reportIssue: (type: 'audio' | 'video' | 'connection' | 'other', description?: string) => void;
}

export interface ConsultationStatus {
    isActive: boolean;
    doctorJoined: boolean;
    patientJoined: boolean;
}

// =============================================================================
// Query Keys
// =============================================================================

export const consultationKeys = {
    room: (appointmentId: string) => ['consultation', 'room', appointmentId] as const,
    status: (appointmentId: string) => ['consultation', 'status', appointmentId] as const,
};

// =============================================================================
// Hooks
// =============================================================================

/**
 * Hook to get consultation room status
 */
export function useConsultationStatus(appointmentId: string | null) {
    return useQuery({
        queryKey: appointmentId ? consultationKeys.status(appointmentId) : ['consultation', 'disabled'],
        queryFn: () => getVideoRoomStatus(appointmentId!),
        enabled: !!appointmentId,
        refetchInterval: 5000, // Poll every 5 seconds
        staleTime: 2000,
    });
}

/**
 * Hook for managing video consultation
 */
export function useConsultation(appointmentId: string): UseConsultationReturn {
    const [room, setRoom] = useState<VideoRoom | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const joinMutation = useMutation({
        mutationFn: () => joinVideoRoom(appointmentId),
        onSuccess: (data) => {
            setRoom(data);
            setIsConnected(true);
            setError(null);
            queryClient.invalidateQueries({ queryKey: consultationKeys.status(appointmentId) });
        },
        onError: (err) => {
            const message = getErrorMessage(err);
            setError(message);
            toast.error(message);
        },
    });

    const leaveMutation = useMutation({
        mutationFn: () => leaveVideoRoom(appointmentId),
        onSuccess: () => {
            setRoom(null);
            setIsConnected(false);
            queryClient.invalidateQueries({ queryKey: consultationKeys.status(appointmentId) });
        },
        onError: (err) => {
            toast.error(getErrorMessage(err));
        },
    });

    const reportIssueMutation = useMutation({
        mutationFn: ({ type, description }: { type: 'audio' | 'video' | 'connection' | 'other'; description?: string }) =>
            reportIssue(appointmentId, { type, description }),
        onSuccess: () => {
            toast.success('Issue reported. Our team will look into it.');
        },
        onError: (err) => {
            toast.error(getErrorMessage(err));
        },
    });

    const join = useCallback(async () => {
        await joinMutation.mutateAsync();
    }, [joinMutation]);

    const leave = useCallback(async () => {
        await leaveMutation.mutateAsync();
    }, [leaveMutation]);

    const handleReportIssue = useCallback(
        (type: 'audio' | 'video' | 'connection' | 'other', description?: string) => {
            reportIssueMutation.mutate({ type, description });
        },
        [reportIssueMutation]
    );

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (isConnected) {
                leaveVideoRoom(appointmentId).catch(() => { });
            }
        };
    }, [appointmentId, isConnected]);

    return {
        room,
        isJoining: joinMutation.isPending,
        isConnected,
        isError: !!error,
        error,
        join,
        leave,
        reportIssue: handleReportIssue,
    };
}
