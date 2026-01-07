/**
 * Doctor API
 * Handles all doctor-related API calls
 */

import { api, buildQueryParams, type PaginationMeta } from '@/config/api';
import type {
  Doctor,
  DoctorListItem,
  DoctorStats,
  DoctorFilters,
  AvailableSlot,
  DoctorSchedule,
  Specialization,
} from '@/lib/types';

/**
 * Doctor detail with full information
 */
export type DoctorDetail = Doctor;

/**
 * List doctors with filters and pagination
 */
export async function listDoctors(
  filters: DoctorFilters = {}
): Promise<{ doctors: DoctorListItem[]; meta: PaginationMeta }> {
  const params = buildQueryParams(filters as Record<string, unknown>);
  const response = await api.getWithMeta<DoctorListItem[]>('/doctors', { params });
  return {
    doctors: response.data,
    meta: response.meta!,
  };
}

/**
 * Get doctor details by ID
 */
export async function getDoctor(id: string): Promise<DoctorDetail> {
  return api.get<DoctorDetail>(`/doctors/${id}`);
}

/**
 * Get doctor statistics
 */
export async function getDoctorStats(id: string): Promise<DoctorStats> {
  return api.get<DoctorStats>(`/doctors/${id}/stats`);
}

/**
 * Get doctor's available slots
 */
export async function getDoctorAvailability(
  id: string,
  filters: {
    startDate?: string;
    endDate?: string;
    consultationType?: 'video' | 'in_person';
  } = {}
): Promise<AvailableSlot[]> {
  const params = buildQueryParams(filters);
  return api.get<AvailableSlot[]>(`/doctors/${id}/availability`, { params });
}

/**
 * Get doctor's schedules
 */
export async function getDoctorSchedules(id: string): Promise<DoctorSchedule[]> {
  return api.get<DoctorSchedule[]>(`/schedules/doctor/${id}`);
}

/**
 * Get all specializations
 */
export async function getSpecializations(): Promise<Specialization[]> {
  return api.get<Specialization[]>('/doctors/specializations');
}

/**
 * Search doctors by name or specialization
 */
export async function searchDoctors(
  query: string,
  options: {
    hospitalId?: string;
    limit?: number;
  } = {}
): Promise<DoctorListItem[]> {
  const params = buildQueryParams({
    search: query,
    ...options,
    limit: options.limit || 10,
  });
  return api.get<DoctorListItem[]>('/doctors', { params });
}

/**
 * Get doctors by hospital
 */
export async function getDoctorsByHospital(
  hospitalId: string,
  filters: Omit<DoctorFilters, 'hospitalId'> = {}
): Promise<{ doctors: DoctorListItem[]; meta: PaginationMeta }> {
  return listDoctors({ ...filters, hospitalId });
}

/**
 * Get top-rated doctors
 */
export async function getTopRatedDoctors(
  options: {
    specialization?: string;
    city?: string;
    limit?: number;
  } = {}
): Promise<DoctorListItem[]> {
  const params = buildQueryParams({
    ...options,
    sortBy: 'rating',
    sortOrder: 'desc',
    limit: options.limit || 10,
  });
  return api.get<DoctorListItem[]>('/doctors', { params });
}

/**
 * Get doctors available today
 */
export async function getDoctorsAvailableToday(
  filters: {
    specialization?: string;
    hospitalId?: string;
    consultationType?: 'video' | 'in_person';
  } = {}
): Promise<DoctorListItem[]> {
  const today = new Date().toISOString().split('T')[0];
  const params = buildQueryParams({
    ...filters,
    availableFrom: today,
    availableTo: today,
  });
  return api.get<DoctorListItem[]>('/doctors', { params });
}

/**
 * Doctor API namespace export
 */
export const doctorApi = {
  list: listDoctors,
  get: getDoctor,
  getStats: getDoctorStats,
  getAvailability: getDoctorAvailability,
  getSchedules: getDoctorSchedules,
  getSpecializations,
  search: searchDoctors,
  getByHospital: getDoctorsByHospital,
  getTopRated: getTopRatedDoctors,
  getAvailableToday: getDoctorsAvailableToday,
};
