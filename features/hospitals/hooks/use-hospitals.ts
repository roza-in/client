/**
 * Hospitals Feature - Hooks
 */

'use client';

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
    getHospitals,
    searchHospitals,
    getHospital,
    getHospitalBySlug,
    getHospitalDoctors,
    getHospitalAppointments,
    getHospitalSpecialties,
    getFeaturedHospitals,
    type HospitalSearchParams,
} from '../api/hospitals';

// =============================================================================
// Query Keys
// =============================================================================

export const hospitalKeys = {
    all: ['hospitals'] as const,
    lists: () => [...hospitalKeys.all, 'list'] as const,
    list: (filters: HospitalSearchParams) => [...hospitalKeys.lists(), filters] as const,
    search: (params: HospitalSearchParams) => [...hospitalKeys.all, 'search', params] as const,
    details: () => [...hospitalKeys.all, 'detail'] as const,
    detail: (id: string) => [...hospitalKeys.details(), id] as const,
    bySlug: (slug: string) => [...hospitalKeys.all, 'slug', slug] as const,
    doctors: (id: string) => [...hospitalKeys.all, 'doctors', id] as const,
    appointments: (id: string) => [...hospitalKeys.all, 'appointments', id] as const,
    specialties: (id: string) => [...hospitalKeys.all, 'specialties', id] as const,
    featured: () => [...hospitalKeys.all, 'featured'] as const,
};

// =============================================================================
// Hooks
// =============================================================================

/**
 * Hook to fetch hospitals list with filters
 */
export function useHospitals(params: HospitalSearchParams = {}) {
    return useQuery({
        queryKey: hospitalKeys.list(params),
        queryFn: () => getHospitals(params),
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Hook to search hospitals with infinite scroll
 */
export function useSearchHospitals(params: Omit<HospitalSearchParams, 'page'>) {
    return useInfiniteQuery({
        queryKey: hospitalKeys.search(params),
        queryFn: ({ pageParam = 1 }) => searchHospitals({ ...params, page: pageParam }),
        getNextPageParam: (lastPage) =>
            lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
        initialPageParam: 1,
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Hook to fetch a single hospital by ID
 */
export function useHospital(id: string | null) {
    return useQuery({
        queryKey: id ? hospitalKeys.detail(id) : ['hospital', 'disabled'],
        queryFn: () => getHospital(id!),
        enabled: !!id,
        staleTime: 10 * 60 * 1000,
    });
}

/**
 * Hook to fetch a hospital by slug
 */
export function useHospitalBySlug(slug: string | null) {
    return useQuery({
        queryKey: slug ? hospitalKeys.bySlug(slug) : ['hospital', 'disabled'],
        queryFn: () => getHospitalBySlug(slug!),
        enabled: !!slug,
        staleTime: 10 * 60 * 1000,
    });
}

/**
 * Hook to fetch doctors at a hospital
 */
export function useHospitalDoctors(hospitalId: string | null, specialization?: string) {
    return useQuery({
        queryKey: hospitalId ? [...hospitalKeys.doctors(hospitalId), specialization] : ['doctors', 'disabled'],
        queryFn: () => getHospitalDoctors(hospitalId!, { specialization }),
        enabled: !!hospitalId,
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Hook to fetch hospital specialties
 */
export function useHospitalSpecialties(hospitalId: string | null) {
    return useQuery({
        queryKey: hospitalId ? hospitalKeys.specialties(hospitalId) : ['specialties', 'disabled'],
        queryFn: () => getHospitalSpecialties(hospitalId!),
        enabled: !!hospitalId,
        staleTime: 10 * 60 * 1000,
    });
}

/**
 * Hook to fetch hospital appointments
 */
export function useHospitalAppointments(hospitalId: string | null, params: { status?: string; page?: number; limit?: number } = {}) {
    return useQuery({
        queryKey: hospitalId ? hospitalKeys.appointments(hospitalId) : ['appointments', 'disabled'],
        queryFn: () => getHospitalAppointments(hospitalId!, params),
        enabled: !!hospitalId,
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Hook to fetch featured hospitals
 */
export function useFeaturedHospitals(limit: number = 6) {
    return useQuery({
        queryKey: [...hospitalKeys.featured(), limit],
        queryFn: () => getFeaturedHospitals(limit),
        staleTime: 10 * 60 * 1000,
    });
}
