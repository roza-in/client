/**
 * Analytics Feature - API
 */

import { api, endpoints } from '@/lib/api';

// =============================================================================
// Types
// =============================================================================

export interface DashboardStats {
    totalAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    noShowAppointments: number;
    totalRevenue: number;
    pendingPayments: number;
    averageRating: number;
    totalPatients: number;
}

export interface RevenueData {
    date: string;
    revenue: number;
    consultations: number;
    platformFee: number;
}

export interface AppointmentTrend {
    date: string;
    scheduled: number;
    completed: number;
    cancelled: number;
    noShow: number;
}

export interface TopDoctor {
    id: string;
    name: string;
    specialization: string;
    appointments: number;
    revenue: number;
    rating: number;
}

export interface AnalyticsParams {
    startDate?: string;
    endDate?: string;
    groupBy?: 'day' | 'week' | 'month';
}

// =============================================================================
// API Functions
// =============================================================================

/**
 * Get dashboard stats
 */
export async function getDashboardStats(params?: AnalyticsParams): Promise<DashboardStats> {
    return api.get<DashboardStats>('/analytics/dashboard', { params });
}

/**
 * Get revenue analytics
 */
export async function getRevenueAnalytics(params?: AnalyticsParams): Promise<RevenueData[]> {
    return api.get<RevenueData[]>('/analytics/revenue', { params });
}

/**
 * Get appointment trends
 */
export async function getAppointmentTrends(params?: AnalyticsParams): Promise<AppointmentTrend[]> {
    return api.get<AppointmentTrend[]>('/analytics/appointments', { params });
}

/**
 * Get top performing doctors (hospital/admin only)
 */
export async function getTopDoctors(params?: AnalyticsParams & { limit?: number }): Promise<TopDoctor[]> {
    return api.get<TopDoctor[]>('/analytics/top-doctors', { params });
}

/**
 * Get patient demographics (hospital/admin only)
 */
export async function getPatientDemographics(): Promise<{
    byGender: { gender: string; count: number }[];
    byAge: { range: string; count: number }[];
    byLocation: { city: string; count: number }[];
}> {
    return api.get('/analytics/demographics');
}
