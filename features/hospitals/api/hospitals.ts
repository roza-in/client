/**
 * Hospitals Feature - API
 */

import { api, endpoints } from '@/lib/api';
import type { Hospital, HospitalListItem, Doctor } from '@/types';

// =============================================================================
// Types
// =============================================================================

export interface HospitalSearchParams {
    query?: string;
    city?: string;
    state?: string;
    type?: 'hospital' | 'clinic' | 'diagnostic_center' | 'nursing_home';
    specialization?: string;
    hasEmergency?: boolean;
    verified?: boolean;
    sortBy?: 'rating' | 'name' | 'distance';
    page?: number;
    limit?: number;
    [key: string]: string | number | boolean | string[] | null | undefined;
}

export interface HospitalListResponse {
    hospitals: HospitalListItem[];
    total: number;
    page: number;
    totalPages: number;
}

export interface HospitalSpecialty {
    id: string;
    name: string;
    doctorCount: number;
}

// =============================================================================
// API Functions
// =============================================================================

/**
 * Get list of hospitals with filters
 */
export async function getHospitals(params?: HospitalSearchParams): Promise<HospitalListResponse> {
    const { data, meta } = await api.getWithMeta<HospitalListItem[]>(endpoints.hospitals.list, { params });
    return {
        hospitals: data,
        total: meta?.total || 0,
        page: meta?.page || 1,
        totalPages: meta?.totalPages || 1,
    };
}

/**
 * Search hospitals
 */
export async function searchHospitals(params: HospitalSearchParams): Promise<HospitalListResponse> {
    const { data, meta } = await api.getWithMeta<HospitalListItem[]>(endpoints.hospitals.search, { params });
    return {
        hospitals: data,
        total: meta?.total || 0,
        page: meta?.page || 1,
        totalPages: meta?.totalPages || 1,
    };
}

/**
 * Get hospital by ID
 */
export async function getHospital(id: string): Promise<Hospital> {
    return api.get<Hospital>(endpoints.hospitals.get(id));
}

/**
 * Get hospital by slug
 */
export async function getHospitalBySlug(slug: string): Promise<Hospital> {
    return api.get<Hospital>(endpoints.hospitals.getBySlug(slug));
}

/**
 * Get doctors at a hospital
 */
export async function getHospitalDoctors(
    hospitalId: string,
    params?: { specialization?: string; page?: number; limit?: number;[key: string]: any }
): Promise<{ doctors: Doctor[]; total: number }> {
    const { data, meta } = await api.getWithMeta<Doctor[]>(endpoints.hospitals.doctors(hospitalId), { params });
    return { doctors: data, total: meta?.total || 0 };
}

/**
 * Get appointments at a hospital
 */
export async function getHospitalAppointments(
    hospitalId: string,
    params?: { status?: string; page?: number; limit?: number;[key: string]: any }
): Promise<{ appointments: any[]; total: number }> {
    const { data, meta } = await api.getWithMeta<any[]>(endpoints.hospitals.appointments(hospitalId), { params });
    return { appointments: data, total: meta?.total || 0 };
}

/**
 * Add a doctor to a hospital
 */
export async function addDoctor(hospitalId: string, data: any): Promise<Doctor> {
    return api.post<Doctor>(endpoints.hospitals.doctors(hospitalId), data);
}

/**
 * Get hospital specialties
 */
export async function getHospitalSpecialties(hospitalId: string): Promise<HospitalSpecialty[]> {
    return api.get<HospitalSpecialty[]>(endpoints.hospitals.specialties(hospitalId));
}

/**
 * Get featured hospitals (for homepage)
 */
export async function getFeaturedHospitals(limit: number = 6): Promise<HospitalListItem[]> {
    return api.get<HospitalListItem[]>(endpoints.hospitals.list, {
        params: { featured: true, limit, verified: true },
    });
}
