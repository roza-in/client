/**
 * Appointment API
 * Handles all appointment-related API calls
 */

import { api, buildQueryParams, type PaginationMeta } from '@/config/api';
import type {
  Appointment,
  AppointmentListItem,
  AppointmentWithDetails,
  AppointmentFilters,
  RescheduleAppointmentInput,
  Rating,
  AppointmentStatus,
  ConsultationType,
} from '@/lib/types';

/**
 * Appointment detail type alias
 */
export type AppointmentDetail = AppointmentWithDetails;

/**
 * Create appointment input
 */
export interface CreateAppointmentInput {
  doctorId: string;
  familyMemberId?: string;
  appointmentDate: string;
  startTime: string;
  consultationType: ConsultationType;
  chiefComplaint?: string;
  symptoms?: string[];
}

/**
 * List appointments with filters and pagination
 */
export async function listAppointments(
  filters: AppointmentFilters = {}
): Promise<{ appointments: AppointmentListItem[]; meta: PaginationMeta }> {
  const params = buildQueryParams(filters as Record<string, unknown>);
  const response = await api.getWithMeta<AppointmentListItem[]>('/appointments', { params });
  return {
    appointments: response.data,
    meta: response.meta!,
  };
}

/**
 * Get appointment details by ID
 */
export async function getAppointment(id: string): Promise<AppointmentDetail> {
  return api.get<AppointmentDetail>(`/appointments/${id}`);
}

/**
 * Create a new appointment
 */
export async function createAppointment(
  data: CreateAppointmentInput
): Promise<{ appointment: Appointment; paymentOrderId?: string }> {
  return api.post<{ appointment: Appointment; paymentOrderId?: string }>('/appointments', data);
}

/**
 * Cancel an appointment
 */
export async function cancelAppointment(
  id: string,
  reason: string
): Promise<{ appointment: Appointment; refundStatus?: string }> {
  return api.patch<{ appointment: Appointment; refundStatus?: string }>(
    `/appointments/${id}/cancel`,
    { reason }
  );
}

/**
 * Reschedule an appointment
 */
export async function rescheduleAppointment(
  id: string,
  data: RescheduleAppointmentInput
): Promise<Appointment> {
  return api.patch<Appointment>(`/appointments/${id}/reschedule`, data);
}

/**
 * Rate an appointment
 */
export async function rateAppointment(
  id: string,
  data: {
    rating: number;
    review?: string;
  }
): Promise<Rating> {
  return api.post<Rating>(`/appointments/${id}/rate`, data);
}

/**
 * Get appointment rating
 */
export async function getAppointmentRating(id: string): Promise<Rating | null> {
  try {
    return await api.get<Rating>(`/appointments/${id}/rating`);
  } catch {
    return null;
  }
}

/**
 * Update appointment rating
 */
export async function updateAppointmentRating(
  id: string,
  data: {
    rating: number;
    review?: string;
  }
): Promise<Rating> {
  return api.patch<Rating>(`/appointments/${id}/rating`, data);
}

/**
 * Get upcoming appointments
 */
export async function getUpcomingAppointments(
  options: {
    limit?: number;
  } = {}
): Promise<AppointmentListItem[]> {
  const params = buildQueryParams({
    status: ['scheduled', 'confirmed'] as unknown as string,
    startDate: new Date().toISOString(),
    sortBy: 'scheduledAt',
    sortOrder: 'asc',
    limit: options.limit || 5,
  });
  const response = await api.get<AppointmentListItem[]>('/appointments', { params });
  return response;
}

/**
 * Get past appointments
 */
export async function getPastAppointments(
  options: {
    page?: number;
    limit?: number;
  } = {}
): Promise<{ appointments: AppointmentListItem[]; meta: PaginationMeta }> {
  return listAppointments({
    status: ['completed', 'cancelled'] as AppointmentStatus[],
    endDate: new Date().toISOString(),
    sortBy: 'appointmentDate',
    sortOrder: 'desc',
    ...options,
  });
}

/**
 * Get appointments for a specific doctor
 */
export async function getDoctorAppointments(
  doctorId: string,
  filters: Omit<AppointmentFilters, 'doctorId'> = {}
): Promise<{ appointments: AppointmentListItem[]; meta: PaginationMeta }> {
  return listAppointments({ ...filters, doctorId });
}

/**
 * Get appointments for a specific patient
 */
export async function getPatientAppointments(
  patientId: string,
  filters: Omit<AppointmentFilters, 'patientId'> = {}
): Promise<{ appointments: AppointmentListItem[]; meta: PaginationMeta }> {
  return listAppointments({ ...filters, patientId });
}

/**
 * Check if slot is available
 */
export async function checkSlotAvailability(
  doctorId: string,
  scheduledAt: string,
  consultationType: 'video' | 'in_person'
): Promise<{ available: boolean; reason?: string }> {
  return api.post<{ available: boolean; reason?: string }>('/appointments/check-availability', {
    doctorId,
    scheduledAt,
    consultationType,
  });
}

/**
 * Appointment API namespace export
 */
export const appointmentApi = {
  list: listAppointments,
  get: getAppointment,
  create: createAppointment,
  cancel: cancelAppointment,
  reschedule: rescheduleAppointment,
  rate: rateAppointment,
  getRating: getAppointmentRating,
  updateRating: updateAppointmentRating,
  getUpcoming: getUpcomingAppointments,
  getPast: getPastAppointments,
  getDoctorAppointments,
  getPatientAppointments,
  checkSlotAvailability,
};
