/**
 * Admin Feature - Types
 */

import { PaginationMeta } from '@/lib/api/client';

export interface AdminDashboardStats {
    totalUsers: number;
    totalHospitals: number;
    totalDoctors: number;
    totalAppointments: number;
}

export interface VerificationItem {
    id: string;
    name: string;
    type: 'hospital' | 'doctor';
    email?: string;
    phone?: string;
    submittedAt: string;
    status: 'pending' | 'verified' | 'rejected' | 'under_review';
}

export interface TrendSeriesItem {
    date: string;
    count?: number;
    amount?: number;
    total?: number;
}

export interface PlatformAnalytics {
    patients: {
        total: number;
        newThisMonth: number;
    };
    doctors: {
        total: number;
    };
    hospitals: {
        total: number;
    };
    appointments: {
        total: number;
        thisWeek: number;
    };
    revenue: {
        total: number;
    };
    period?: string; // Client side additions for context
    trends?: {
        appointments: TrendSeriesItem[];
        revenue: TrendSeriesItem[];
        users: TrendSeriesItem[];
    };
}


export interface AdminSettings {
    key: string;
    value: any;
    updated_at: string;
}
