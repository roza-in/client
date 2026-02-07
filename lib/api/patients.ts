import { apiClient } from './client';
import type { AppointmentListItem } from '@/types';

export interface PatientDashboardStats {
    upcomingAppointments: number;
    completedConsultations: number;
    prescriptions: number;
    healthRecords: number;
}

export type ActivityType = 'appointment' | 'prescription' | 'payment' | 'record';

export interface ActivityTimelineItem {
    id: string;
    type: ActivityType;
    title: string;
    description: string;
    timestamp: string;
    metadata?: Record<string, any>;
}

export interface PatientDashboardData {
    user: {
        id: string;
        name: string;
        email?: string;
        phone: string;
        avatar_url?: string | null;
    };
    stats: PatientDashboardStats;
    upcomingAppointments: AppointmentListItem[];
    activityTimeline: ActivityTimelineItem[];
}

/**
 * Fetch patient dashboard data
 */
export async function fetchPatientDashboard(): Promise<PatientDashboardData> {
    return apiClient.get<PatientDashboardData>('/patients/dashboard');
}

export const patientsApi = {
    fetchPatientDashboard,
};
