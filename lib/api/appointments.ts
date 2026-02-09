import { apiClient, RequestOptions } from './client';
import type {
    AppointmentListItem,
    AppointmentWithDetails,
    AppointmentFilters,
    BookAppointmentInput,
    RescheduleAppointmentInput,
    CancelAppointmentInput,
    AppointmentStats
} from '@/types';

export interface AppointmentListResponse {
    appointments: AppointmentListItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
}

export interface CheckAvailabilityResponse {
    doctorId: string;
    date: string;
    slots: TimeSlot[];
}

export interface TimeSlot {
    date: string;
    time: string;
    startTime: string;
    endTime: string;
    available: boolean;
    isAvailable: boolean;
    fee: number;
    remaining_capacity: number;
}

/**
 * Fetch appointments with detailed filtering and pagination
 */
export async function listAppointments(filters: AppointmentFilters = {}, options?: RequestOptions): Promise<AppointmentListResponse> {
    // Clean up filters to remove undefined values
    const params = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            acc[key] = value;
        }
        return acc;
    }, {} as Record<string, any>);

    const response = await apiClient.getWithMeta<AppointmentListItem[]>('/appointments', { ...options, params });

    return {
        appointments: response.data || [],
        total: response.meta?.total || 0,
        page: response.meta?.page || 1,
        limit: response.meta?.limit || 10,
        totalPages: response.meta?.totalPages || 1,
        hasMore: (response.meta?.page || 1) < (response.meta?.totalPages || 1)
    };
}

/**
 * Get appointment details by ID
 */
export async function getAppointment(id: string, options?: RequestOptions): Promise<AppointmentWithDetails> {
    return apiClient.get<AppointmentWithDetails>(`/appointments/${id}`, options);
}

/**
 * Book a new appointment
 */
export async function bookAppointment(data: BookAppointmentInput, options?: RequestOptions): Promise<{
    appointment: AppointmentWithDetails;
    paymentRequired: boolean;
    amount: number;
    paymentOrder?: any;
}> {
    return apiClient.post('/appointments', data, options);
}

/**
 * Cancel an appointment
 */
export async function cancelAppointment(id: string, data: CancelAppointmentInput, options?: RequestOptions): Promise<AppointmentWithDetails> {
    return apiClient.patch<AppointmentWithDetails>(`/appointments/${id}/cancel`, data, options);
}

/**
 * Reschedule an appointment
 */
export async function rescheduleAppointment(id: string, data: RescheduleAppointmentInput, options?: RequestOptions): Promise<AppointmentWithDetails> {
    return apiClient.patch<AppointmentWithDetails>(`/appointments/${id}/reschedule`, data, options);
}

/**
 * Check doctor availability
 */
export async function checkAvailability(
    doctorId: string,
    date: string,
    consultationType?: string,
    hospitalId?: string,
    options?: RequestOptions
): Promise<CheckAvailabilityResponse> {
    return apiClient.get<CheckAvailabilityResponse>('/appointments/check-availability', {
        ...options,
        params: { doctorId, date, consultationType, hospitalId }
    });
}

/**
 * Get appointment stats
 */
export async function getStats(options?: RequestOptions): Promise<AppointmentStats> {
    return apiClient.get<AppointmentStats>('/appointments/stats', options);
}

export const appointmentsApi = {
    listAppointments,
    getAppointment,
    bookAppointment,
    cancelAppointment,
    rescheduleAppointment,
    checkAvailability,
    getStats,
};
