/**
 * Hospital API
 * Handles all hospital-related API calls
 */

import { api, buildQueryParams, type PaginationMeta } from '@/config/api';
import type {
  Hospital,
  HospitalListItem,
  HospitalStats,
  HospitalFilters,
  UpdateHospitalInput,
  VerificationStatus,
} from '@/lib/types';

/**
 * Hospital detail with full information
 */
export type HospitalDetail = Hospital;

/**
 * List hospitals with filters and pagination
 */
export async function listHospitals(
  filters: HospitalFilters = {}
): Promise<{ hospitals: HospitalListItem[]; meta: PaginationMeta }> {
  const params = buildQueryParams(filters as Record<string, unknown>);
  const response = await api.getWithMeta<HospitalListItem[]>('/hospitals', { params });
  return {
    hospitals: response.data,
    meta: response.meta!,
  };
}

/**
 * Get hospital details by ID
 */
export async function getHospital(id: string): Promise<HospitalDetail> {
  return api.get<HospitalDetail>(`/hospitals/${id}`);
}

/**
 * Update hospital details
 */
export async function updateHospital(
  id: string,
  data: UpdateHospitalInput
): Promise<Hospital> {
  return api.put<Hospital>(`/hospitals/${id}`, data);
}

/**
 * Get hospital statistics
 */
export async function getHospitalStats(id: string): Promise<HospitalStats> {
  return api.get<HospitalStats>(`/hospitals/${id}/stats`);
}

/**
 * Add doctor to hospital
 */
export async function addDoctorToHospital(
  hospitalId: string,
  data: {
    userId: string;
    specializationId: string;
    qualifications: string[];
    experience: number;
    consultationFee: number;
    bio?: string;
    languagesSpoken?: string[];
  }
): Promise<{ doctorId: string; message: string }> {
  return api.post<{ doctorId: string; message: string }>(
    `/hospitals/${hospitalId}/doctors`,
    data
  );
}

/**
 * Verify hospital (admin only)
 */
export async function verifyHospital(
  id: string,
  data: {
    status: VerificationStatus;
    remarks?: string;
  }
): Promise<Hospital> {
  return api.patch<Hospital>(`/hospitals/${id}/verify`, data);
}

/**
 * Get hospitals for dropdown/select
 */
export async function getHospitalOptions(
  filters: { search?: string; city?: string; limit?: number } = {}
): Promise<HospitalListItem[]> {
  const params = buildQueryParams({ ...filters, limit: filters.limit || 20 });
  return api.get<HospitalListItem[]>('/hospitals', { params });
}

/**
 * Get nearby hospitals
 */
export async function getNearbyHospitals(
  latitude: number,
  longitude: number,
  radiusKm: number = 10
): Promise<HospitalListItem[]> {
  return api.get<HospitalListItem[]>('/hospitals', {
    params: {
      latitude,
      longitude,
      radius: radiusKm,
    },
  });
}

/**
 * Hospital API namespace export
 */
export const hospitalApi = {
  list: listHospitals,
  get: getHospital,
  update: updateHospital,
  getStats: getHospitalStats,
  addDoctor: addDoctorToHospital,
  verify: verifyHospital,
  getOptions: getHospitalOptions,
  getNearby: getNearbyHospitals,
};
