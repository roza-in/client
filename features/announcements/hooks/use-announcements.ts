'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getPublicAnnouncements,
    getActiveAnnouncements,
    getAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
} from '../api/announcements-api';
import type {
    CreateAnnouncementInput,
    UpdateAnnouncementInput,
} from '@/types';

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const announcementKeys = {
    all: ['announcements'] as const,
    hospital: (hospitalId: string) => [...announcementKeys.all, hospitalId] as const,
    publicList: (hospitalId: string) => [...announcementKeys.hospital(hospitalId), 'public'] as const,
    activeList: (hospitalId: string) => [...announcementKeys.hospital(hospitalId), 'active'] as const,
    allList: (hospitalId: string) => [...announcementKeys.hospital(hospitalId), 'all'] as const,
};

// ─── Query Hooks ──────────────────────────────────────────────────────────────

export function usePublicAnnouncements(hospitalId: string) {
    return useQuery({
        queryKey: announcementKeys.publicList(hospitalId),
        queryFn: () => getPublicAnnouncements(hospitalId),
        enabled: !!hospitalId,
        staleTime: 5 * 60 * 1000,
    });
}

export function useActiveAnnouncements(hospitalId: string) {
    return useQuery({
        queryKey: announcementKeys.activeList(hospitalId),
        queryFn: () => getActiveAnnouncements(hospitalId),
        enabled: !!hospitalId,
        staleTime: 2 * 60 * 1000,
    });
}

export function useAnnouncements(hospitalId: string) {
    return useQuery({
        queryKey: announcementKeys.allList(hospitalId),
        queryFn: () => getAnnouncements(hospitalId),
        enabled: !!hospitalId,
        staleTime: 2 * 60 * 1000,
    });
}

// ─── Mutation Hooks ───────────────────────────────────────────────────────────

export function useCreateAnnouncement() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ hospitalId, input }: { hospitalId: string; input: CreateAnnouncementInput }) =>
            createAnnouncement(hospitalId, input),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: announcementKeys.hospital(variables.hospitalId) });
        },
    });
}

export function useUpdateAnnouncement() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            hospitalId,
            announcementId,
            input,
        }: {
            hospitalId: string;
            announcementId: string;
            input: UpdateAnnouncementInput;
        }) => updateAnnouncement(hospitalId, announcementId, input),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: announcementKeys.hospital(variables.hospitalId) });
        },
    });
}

export function useDeleteAnnouncement() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ hospitalId, announcementId }: { hospitalId: string; announcementId: string }) =>
            deleteAnnouncement(hospitalId, announcementId),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: announcementKeys.hospital(variables.hospitalId) });
        },
    });
}
