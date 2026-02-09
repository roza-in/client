/**
 * Doctors Feature - Hooks
 */

'use client';

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
    getDoctors,
    searchDoctors,
    getDoctor,
    getDoctorBySlug,
    getDoctorSchedule,
    getDoctorReviews,
    getSpecializations,
    getFeaturedDoctors,
    type DoctorSearchParams,
} from '../api/doctors';

// =============================================================================
// Query Keys
// =============================================================================

export const doctorKeys = {
    all: ['doctors'] as const,
    lists: () => [...doctorKeys.all, 'list'] as const,
    list: (filters: DoctorSearchParams) => [...doctorKeys.lists(), filters] as const,
    search: (params: DoctorSearchParams) => [...doctorKeys.all, 'search', params] as const,
    details: () => [...doctorKeys.all, 'detail'] as const,
    detail: (id: string) => [...doctorKeys.details(), id] as const,
    bySlug: (slug: string) => [...doctorKeys.all, 'slug', slug] as const,
    schedule: (id: string) => [...doctorKeys.all, 'schedule', id] as const,
    reviews: (id: string) => [...doctorKeys.all, 'reviews', id] as const,
    specializations: () => [...doctorKeys.all, 'specializations'] as const,
    featured: () => [...doctorKeys.all, 'featured'] as const,
};

// =============================================================================
// Hooks
// =============================================================================

/**
 * Hook to fetch doctors list with filters
 */
export function useDoctors(params: DoctorSearchParams = {}) {
    return useQuery({
        queryKey: doctorKeys.list(params),
        queryFn: () => getDoctors(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook to search doctors with infinite scroll
 */
export function useSearchDoctors(params: Omit<DoctorSearchParams, 'page'>) {
    return useInfiniteQuery({
        queryKey: doctorKeys.search(params),
        queryFn: ({ pageParam = 1 }) => searchDoctors({ ...params, page: pageParam }),
        getNextPageParam: (lastPage) =>
            lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
        initialPageParam: 1,
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Hook to fetch a single doctor by ID
 */
export function useDoctor(id: string | null) {
    return useQuery({
        queryKey: id ? doctorKeys.detail(id) : ['doctor', 'disabled'],
        queryFn: () => getDoctor(id!),
        enabled: !!id,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}

/**
 * Hook to fetch a doctor by slug
 */
export function useDoctorBySlug(slug: string | null) {
    return useQuery({
        queryKey: slug ? doctorKeys.bySlug(slug) : ['doctor', 'disabled'],
        queryFn: () => getDoctorBySlug(slug!),
        enabled: !!slug,
        staleTime: 10 * 60 * 1000,
    });
}

/**
 * Hook to fetch doctor's schedule
 */
export function useDoctorSchedule(doctorId: string | null) {
    return useQuery({
        queryKey: doctorId ? doctorKeys.schedule(doctorId) : ['schedule', 'disabled'],
        queryFn: () => getDoctorSchedule(doctorId!),
        enabled: !!doctorId,
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Hook to fetch doctor reviews
 */
export function useDoctorReviews(doctorId: string | null, page: number = 1) {
    return useQuery({
        queryKey: doctorId ? [...doctorKeys.reviews(doctorId), page] : ['reviews', 'disabled'],
        queryFn: () => getDoctorReviews(doctorId!, page),
        enabled: !!doctorId,
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Hook to fetch all specializations
 */
export function useSpecializations() {
    return useQuery({
        queryKey: doctorKeys.specializations(),
        queryFn: getSpecializations,
        staleTime: 30 * 60 * 1000, // 30 minutes - rarely changes
    });
}

/**
 * Hook to fetch featured doctors
 */
export function useFeaturedDoctors(limit: number = 6) {
    return useQuery({
        queryKey: [...doctorKeys.featured(), limit],
        queryFn: () => getFeaturedDoctors(limit),
        staleTime: 10 * 60 * 1000,
    });
}
