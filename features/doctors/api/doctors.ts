/**
 * Doctors Feature - API
 */

import { api, endpoints } from '@/lib/api';
import type { Doctor, DoctorListItem, DoctorCard, Specialization, DoctorSchedule } from '@/types';

// =============================================================================
// Types
// =============================================================================

export interface DoctorSearchParams {
    query?: string;
    specialization?: string;
    city?: string;
    hospitalId?: string;
    consultationType?: 'in_person' | 'video' | 'audio';
    gender?: 'male' | 'female';
    minExperience?: number;
    maxFee?: number;
    availability?: 'today' | 'tomorrow' | 'this_week';
    sortBy?: 'rating' | 'experience' | 'fee_low' | 'fee_high';
    page?: number;
    limit?: number;
    [key: string]: string | number | boolean | string[] | null | undefined;
}

export interface DoctorListResponse {
    doctors: DoctorListItem[];
    specializations: Specialization[];
    total: number;
    page: number;
    totalPages: number;
}

export interface DoctorReview {
    id: string;
    patientName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

// =============================================================================
// API Functions
// =============================================================================

/**
 * Get list of doctors with filters
 */
export async function getDoctors(params?: DoctorSearchParams): Promise<DoctorListResponse> {
    const { data, meta } = await api.getWithMeta<DoctorListItem[]>(endpoints.doctors.list, { params });
    return {
        doctors: data,
        specializations: [],
        total: meta?.total || 0,
        page: meta?.page || 1,
        totalPages: meta?.totalPages || 1,
    };
}

/**
 * Search doctors
 */
export async function searchDoctors(params: DoctorSearchParams): Promise<DoctorListResponse> {
    const { data, meta } = await api.getWithMeta<DoctorListItem[]>(endpoints.doctors.search, { params });
    return {
        doctors: data,
        specializations: [],
        total: meta?.total || 0,
        page: meta?.page || 1,
        totalPages: meta?.totalPages || 1,
    };
}

/**
 * Get doctor by ID
 */
export async function getDoctor(id: string): Promise<Doctor> {
    return api.get<Doctor>(endpoints.doctors.get(id));
}

/**
 * Get doctor by slug
 */
export async function getDoctorBySlug(slug: string): Promise<Doctor> {
    return api.get<Doctor>(endpoints.doctors.getBySlug(slug));
}

/**
 * Get doctor's schedule
 */
export async function getDoctorSchedule(doctorId: string): Promise<DoctorSchedule> {
    return api.get<DoctorSchedule>(endpoints.doctors.schedule(doctorId));
}

/**
 * Get doctor reviews
 */
export async function getDoctorReviews(
    doctorId: string,
    page: number = 1,
    limit: number = 10
): Promise<{ reviews: DoctorReview[]; total: number }> {
    const { data, meta } = await api.getWithMeta<DoctorReview[]>(endpoints.doctors.reviews(doctorId), {
        params: { page, limit },
    });
    return { reviews: data, total: meta?.total || 0 };
}

/**
 * Get all specializations
 */
export async function getSpecializations(): Promise<Specialization[]> {
    return api.get<Specialization[]>(endpoints.doctors.specializations);
}

/**
 * Get featured doctors (for homepage)
 */
export async function getFeaturedDoctors(limit: number = 6): Promise<DoctorCard[]> {
    return api.get<DoctorCard[]>(endpoints.doctors.list, {
        params: { featured: true, limit },
    });
}
