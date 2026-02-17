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
    [key: string]: string | number | boolean | string[] | null | undefined;
}

// =============================================================================
// API Functions
// =============================================================================

/**
 * Get analytics overview (admin only)
 */
export async function getAnalyticsOverview(params?: AnalyticsParams): Promise<DashboardStats> {
    return api.get<DashboardStats>(endpoints.admin.analytics, { params });
}

/**
 * Get appointment trends (admin only)
 */
export async function getAppointmentTrends(params?: AnalyticsParams): Promise<AppointmentTrend[]> {
    return api.get<AppointmentTrend[]>(endpoints.admin.appointmentTrends, { params });
}

/**
 * Get revenue trends (admin only)
 */
export async function getRevenueTrends(params?: AnalyticsParams): Promise<RevenueData[]> {
    return api.get<RevenueData[]>(endpoints.admin.revenueTrends, { params });
}

/**
 * Get user trends (admin only)
 */
export async function getUserTrends(params?: AnalyticsParams): Promise<{
    date: string;
    newUsers: number;
    activeUsers: number;
}[]> {
    return api.get(endpoints.admin.userTrends, { params });
}
