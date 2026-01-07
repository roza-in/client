/**
 * Schedule API
 * Handles all schedule-related API calls (doctor schedules and overrides)
 */

import { api, buildQueryParams } from '@/config/api';
import type {
  DoctorSchedule,
  ScheduleOverride,
  DayOfWeek,
} from '@/lib/types';

/**
 * Schedule slot type
 */
export interface ScheduleSlot {
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  slotDuration: number; // in minutes
  breakBetweenSlots: number; // in minutes
}

/**
 * Create schedule input
 */
export interface CreateScheduleInput {
  doctorId: string;
  dayOfWeek: DayOfWeek;
  slots: ScheduleSlot[];
  consultationType: 'video' | 'in_person' | 'both';
  isActive?: boolean;
}

/**
 * Update schedule input
 */
export interface UpdateScheduleInput {
  slots?: ScheduleSlot[];
  consultationType?: 'video' | 'in_person' | 'both';
  isActive?: boolean;
}

/**
 * Create schedule override input
 */
export interface CreateOverrideInput {
  doctorId: string;
  date: string; // YYYY-MM-DD format
  type: 'blocked' | 'available';
  reason?: string;
  slots?: ScheduleSlot[];
}

/**
 * Get doctor schedules
 */
export async function getDoctorSchedules(doctorId: string): Promise<DoctorSchedule[]> {
  return api.get<DoctorSchedule[]>(`/schedules/doctor/${doctorId}`);
}

/**
 * Get schedule by ID
 */
export async function getSchedule(id: string): Promise<DoctorSchedule> {
  return api.get<DoctorSchedule>(`/schedules/${id}`);
}

/**
 * Create a new schedule
 */
export async function createSchedule(data: CreateScheduleInput): Promise<DoctorSchedule> {
  return api.post<DoctorSchedule>('/schedules', data);
}

/**
 * Update a schedule
 */
export async function updateSchedule(
  id: string,
  data: UpdateScheduleInput
): Promise<DoctorSchedule> {
  return api.put<DoctorSchedule>(`/schedules/${id}`, data);
}

/**
 * Delete a schedule
 */
export async function deleteSchedule(id: string): Promise<void> {
  return api.delete<void>(`/schedules/${id}`);
}

/**
 * Get schedule overrides
 */
export async function getScheduleOverrides(
  doctorId: string,
  filters: {
    startDate?: string;
    endDate?: string;
    type?: 'blocked' | 'available';
  } = {}
): Promise<ScheduleOverride[]> {
  const params = buildQueryParams(filters);
  return api.get<ScheduleOverride[]>(`/schedules/doctor/${doctorId}/overrides`, { params });
}

/**
 * Create a schedule override
 */
export async function createScheduleOverride(data: CreateOverrideInput): Promise<ScheduleOverride> {
  return api.post<ScheduleOverride>('/schedules/overrides', data);
}

/**
 * Update a schedule override
 */
export async function updateScheduleOverride(
  id: string,
  data: Partial<CreateOverrideInput>
): Promise<ScheduleOverride> {
  return api.put<ScheduleOverride>(`/schedules/overrides/${id}`, data);
}

/**
 * Delete a schedule override
 */
export async function deleteScheduleOverride(id: string): Promise<void> {
  return api.delete<void>(`/schedules/overrides/${id}`);
}

/**
 * Bulk create schedules for a doctor (weekly schedule)
 */
export async function createWeeklySchedule(
  doctorId: string,
  schedules: Array<Omit<CreateScheduleInput, 'doctorId'>>
): Promise<DoctorSchedule[]> {
  return api.post<DoctorSchedule[]>('/schedules/weekly', {
    doctorId,
    schedules,
  });
}

/**
 * Copy schedule from another doctor
 */
export async function copyDoctorSchedule(
  fromDoctorId: string,
  toDoctorId: string
): Promise<DoctorSchedule[]> {
  return api.post<DoctorSchedule[]>('/schedules/copy', {
    fromDoctorId,
    toDoctorId,
  });
}

/**
 * Toggle schedule active status
 */
export async function toggleScheduleStatus(
  id: string,
  isActive: boolean
): Promise<DoctorSchedule> {
  return api.patch<DoctorSchedule>(`/schedules/${id}/status`, { isActive });
}

/**
 * Block time range (create blocked override)
 */
export async function blockTimeRange(
  doctorId: string,
  date: string,
  reason?: string
): Promise<ScheduleOverride> {
  return createScheduleOverride({
    doctorId,
    date,
    type: 'blocked',
    reason,
  });
}

/**
 * Get available dates for a doctor within a range
 */
export async function getAvailableDates(
  doctorId: string,
  startDate: string,
  endDate: string
): Promise<string[]> {
  return api.get<string[]>(`/schedules/doctor/${doctorId}/available-dates`, {
    params: { startDate, endDate },
  });
}

/**
 * Schedule API namespace export
 */
export const scheduleApi = {
  getDoctorSchedules,
  get: getSchedule,
  create: createSchedule,
  update: updateSchedule,
  delete: deleteSchedule,
  getOverrides: getScheduleOverrides,
  createOverride: createScheduleOverride,
  updateOverride: updateScheduleOverride,
  deleteOverride: deleteScheduleOverride,
  createWeeklySchedule,
  copyDoctorSchedule,
  toggleStatus: toggleScheduleStatus,
  blockTimeRange,
  getAvailableDates,
};
