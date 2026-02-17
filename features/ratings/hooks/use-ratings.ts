'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getDoctorRatings,
    getDoctorRatingStats,
    createRating,
    getAllRatings,
    getRating,
    moderateRating,
} from '../api/ratings-api';
import type {
    CreateRatingInput,
    ModerateRatingInput,
    RatingFilters,
} from '@/types';

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const ratingKeys = {
    all: ['ratings'] as const,
    lists: () => [...ratingKeys.all, 'list'] as const,
    allList: (filters: Record<string, unknown>) => [...ratingKeys.lists(), 'all', filters] as const,
    doctorRatings: (doctorId: string, filters: Record<string, unknown>) =>
        [...ratingKeys.lists(), 'doctor', doctorId, filters] as const,
    doctorStats: (doctorId: string) => [...ratingKeys.all, 'doctor-stats', doctorId] as const,
    details: () => [...ratingKeys.all, 'detail'] as const,
    detail: (id: string) => [...ratingKeys.details(), id] as const,
};

// ─── Query Hooks ──────────────────────────────────────────────────────────────

export function useDoctorRatings(doctorId: string, filters: RatingFilters = {}) {
    return useQuery({
        queryKey: ratingKeys.doctorRatings(doctorId, filters),
        queryFn: () => getDoctorRatings(doctorId, filters),
        enabled: !!doctorId,
        staleTime: 5 * 60 * 1000,
    });
}

export function useDoctorRatingStats(doctorId: string) {
    return useQuery({
        queryKey: ratingKeys.doctorStats(doctorId),
        queryFn: () => getDoctorRatingStats(doctorId),
        enabled: !!doctorId,
        staleTime: 5 * 60 * 1000,
    });
}

export function useAllRatings(filters: RatingFilters = {}) {
    return useQuery({
        queryKey: ratingKeys.allList(filters),
        queryFn: () => getAllRatings(filters),
        staleTime: 2 * 60 * 1000,
    });
}

export function useRating(id: string) {
    return useQuery({
        queryKey: ratingKeys.detail(id),
        queryFn: () => getRating(id),
        enabled: !!id,
        staleTime: 2 * 60 * 1000,
    });
}

// ─── Mutation Hooks ───────────────────────────────────────────────────────────

export function useCreateRating() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: CreateRatingInput) => createRating(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ratingKeys.all });
        },
    });
}

export function useModerateRating() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: ModerateRatingInput }) =>
            moderateRating(id, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ratingKeys.all });
        },
    });
}
