/**
 * Schedule API - Hospital Dashboard
 * CRUD operations for doctor schedules (hospital admin only)
 */

import { api } from '@/lib/api/client';

// =============================================================================
// Types
// =============================================================================

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type ConsultationType = 'online' | 'in_person' | 'walk_in';
export type OverrideType = 'holiday' | 'leave' | 'emergency' | 'special_hours';

// Schedule types are inherited from doctor.consultation_types (global setting)
// No per-schedule consultation type needed

export interface DoctorSchedule {
    id: string;
    doctorId: string;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    breakStart: string | null;
    breakEnd: string | null;
    slotDurationMinutes: number | null;
    maxPatientsPerSlot: number | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ScheduleOverride {
    id: string;
    doctorId: string;
    overrideDate: string;
    overrideType: OverrideType;
    startTime: string | null;
    endTime: string | null;
    reason: string | null;
    createdAt: string;
}

export interface WeeklySchedule {
    [day: string]: {
        dayName: string;
        schedules: {
            id: string;
            startTime: string;
            endTime: string;
            breakStart: string | null;
            breakEnd: string | null;
            slotDurationMinutes: number;
            isActive: boolean;
        }[];
    };
}

export interface CreateScheduleInput {
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    breakStart?: string;
    breakEnd?: string;
    slotDurationMinutes?: number;
    maxPatientsPerSlot?: number;
}

export interface UpdateScheduleInput {
    startTime?: string;
    endTime?: string;
    breakStart?: string | null;
    breakEnd?: string | null;
    slotDurationMinutes?: number;
    maxPatientsPerSlot?: number;
    isActive?: boolean;
}

export interface BulkScheduleInput {
    schedules: CreateScheduleInput[];
}

export interface CreateOverrideInput {
    overrideDate: string;
    overrideType: OverrideType;
    startTime?: string;
    endTime?: string;
    reason?: string;
}

// =============================================================================
// API Functions
// =============================================================================

/**
 * Get doctor's weekly schedule (public)
 */
export async function getDoctorSchedule(doctorId: string): Promise<WeeklySchedule> {
    return api.get<WeeklySchedule>(`/schedules/doctor/${doctorId}`);
}

/**
 * Create a single schedule (hospital admin)
 */
export async function createSchedule(doctorId: string, data: CreateScheduleInput): Promise<DoctorSchedule> {
    return api.post<DoctorSchedule>(`/schedules/doctors/${doctorId}/schedules`, data);
}

/**
 * Bulk create/replace schedules (hospital admin)
 */
export async function bulkCreateSchedules(doctorId: string, data: BulkScheduleInput): Promise<DoctorSchedule[]> {
    return api.put<DoctorSchedule[]>(`/schedules/doctors/${doctorId}/schedules`, data);
}

/**
 * Update a schedule (hospital admin)
 */
export async function updateSchedule(scheduleId: string, data: UpdateScheduleInput): Promise<DoctorSchedule> {
    return api.patch<DoctorSchedule>(`/schedules/${scheduleId}`, data);
}

/**
 * Delete a schedule (hospital admin)
 */
export async function deleteSchedule(scheduleId: string): Promise<void> {
    return api.delete<void>(`/schedules/${scheduleId}`);
}

/**
 * Create schedule override (hospital admin)
 */
export async function createOverride(doctorId: string, data: CreateOverrideInput): Promise<ScheduleOverride> {
    return api.post<ScheduleOverride>(`/schedules/doctors/${doctorId}/overrides`, data);
}

/**
 * Get schedule overrides (hospital admin)
 */
export async function getOverrides(doctorId: string, startDate?: string, endDate?: string): Promise<ScheduleOverride[]> {
    return api.get<ScheduleOverride[]>(`/schedules/doctors/${doctorId}/overrides`, {
        params: { startDate, endDate },
    });
}

/**
 * Delete schedule override (hospital admin)
 */
export async function deleteOverride(overrideId: string): Promise<void> {
    return api.delete<void>(`/schedules/overrides/${overrideId}`);
}
