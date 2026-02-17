/**
 * Analytics Feature - Hooks
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import {
    getAnalyticsOverview,
    getRevenueTrends,
    getAppointmentTrends,
    getUserTrends,
    type AnalyticsParams,
} from '../api/analytics';

// =============================================================================
// Query Keys
// =============================================================================

export const analyticsKeys = {
    all: ['analytics'] as const,
    overview: (params: AnalyticsParams) => [...analyticsKeys.all, 'overview', params] as const,
    revenue: (params: AnalyticsParams) => [...analyticsKeys.all, 'revenue', params] as const,
    appointments: (params: AnalyticsParams) => [...analyticsKeys.all, 'appointments', params] as const,
    users: (params: AnalyticsParams) => [...analyticsKeys.all, 'users', params] as const,
};

// =============================================================================
// Hooks
// =============================================================================

/**
 * Hook to fetch analytics overview
 */
export function useAnalyticsOverview(params?: AnalyticsParams) {
    return useQuery({
        queryKey: analyticsKeys.overview(params || {}),
        queryFn: () => getAnalyticsOverview(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook to fetch revenue trends
 */
export function useRevenueTrends(params?: AnalyticsParams) {
    return useQuery({
        queryKey: analyticsKeys.revenue(params || {}),
        queryFn: () => getRevenueTrends(params),
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Hook to fetch appointment trends
 */
export function useAppointmentTrends(params?: AnalyticsParams) {
    return useQuery({
        queryKey: analyticsKeys.appointments(params || {}),
        queryFn: () => getAppointmentTrends(params),
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Hook to fetch user trends
 */
export function useUserTrends(params?: AnalyticsParams) {
    return useQuery({
        queryKey: analyticsKeys.users(params || {}),
        queryFn: () => getUserTrends(params),
        staleTime: 5 * 60 * 1000,
    });
}
