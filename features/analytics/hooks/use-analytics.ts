/**
 * Analytics Feature - Hooks
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import {
    getDashboardStats,
    getRevenueAnalytics,
    getAppointmentTrends,
    getTopDoctors,
    getPatientDemographics,
    type AnalyticsParams,
} from '../api/analytics';

// =============================================================================
// Query Keys
// =============================================================================

export const analyticsKeys = {
    all: ['analytics'] as const,
    dashboard: (params: AnalyticsParams) => [...analyticsKeys.all, 'dashboard', params] as const,
    revenue: (params: AnalyticsParams) => [...analyticsKeys.all, 'revenue', params] as const,
    trends: (params: AnalyticsParams) => [...analyticsKeys.all, 'trends', params] as const,
    topDoctors: (params: AnalyticsParams) => [...analyticsKeys.all, 'top-doctors', params] as const,
    demographics: () => [...analyticsKeys.all, 'demographics'] as const,
};

// =============================================================================
// Hooks
// =============================================================================

/**
 * Hook to fetch dashboard stats
 */
export function useDashboardStats(params?: AnalyticsParams) {
    return useQuery({
        queryKey: analyticsKeys.dashboard(params || {}),
        queryFn: () => getDashboardStats(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook to fetch revenue analytics
 */
export function useRevenueAnalytics(params?: AnalyticsParams) {
    return useQuery({
        queryKey: analyticsKeys.revenue(params || {}),
        queryFn: () => getRevenueAnalytics(params),
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Hook to fetch appointment trends
 */
export function useAppointmentTrends(params?: AnalyticsParams) {
    return useQuery({
        queryKey: analyticsKeys.trends(params || {}),
        queryFn: () => getAppointmentTrends(params),
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Hook to fetch top doctors
 */
export function useTopDoctors(params?: AnalyticsParams & { limit?: number }) {
    return useQuery({
        queryKey: analyticsKeys.topDoctors(params || {}),
        queryFn: () => getTopDoctors(params),
        staleTime: 10 * 60 * 1000,
    });
}

/**
 * Hook to fetch patient demographics
 */
export function usePatientDemographics() {
    return useQuery({
        queryKey: analyticsKeys.demographics(),
        queryFn: getPatientDemographics,
        staleTime: 30 * 60 * 1000, // 30 minutes
    });
}
