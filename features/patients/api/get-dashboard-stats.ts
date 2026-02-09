/**
 * Patient Dashboard Stats API
 * Fetch dashboard data including appointments, prescriptions, and health records
 */

import { apiClient } from '@/lib/api/client';
import type { AppointmentListItem, Prescription } from '@/types';

// =============================================================================
// Types
// =============================================================================

export interface PatientDashboardStats {
    upcomingAppointments: number;
    completedAppointments: number;
    activePrescriptions: number;
    healthRecords: number;
    familyMembers: number;
    unreadNotifications: number;
}

export interface UpcomingAppointment {
    id: string;
    appointmentDate: string;
    startTime: string;
    endTime: string;
    consultationType: 'in_person' | 'online' | 'phone';
    status: string;
    doctor: {
        id: string;
        name: string;
        specialization: string;
        profilePictureUrl: string | null;
    };
    hospital: {
        id: string;
        name: string;
        city: string;
    };
}

export interface RecentPrescription {
    id: string;
    prescriptionNumber: string;
    diagnosis: string;
    medicationCount: number;
    doctorName: string;
    hospitalName: string;
    createdAt: string;
    pdfUrl: string | null;
}

export interface HealthRecordSummary {
    id: string;
    type: 'lab_report' | 'imaging' | 'vaccination' | 'other';
    title: string;
    date: string;
    source: string;
}

export interface PatientDashboardData {
    stats: PatientDashboardStats;
    upcomingAppointments: UpcomingAppointment[];
    recentPrescriptions: RecentPrescription[];
    healthRecords: HealthRecordSummary[];
    quickActions: {
        canBookAppointment: boolean;
        hasPendingPayments: boolean;
        hasActiveConsultation: boolean;
    };
}

// =============================================================================
// API Functions
// =============================================================================

/**
 * Get patient dashboard statistics
 */
export async function getPatientDashboardStats(): Promise<PatientDashboardStats> {
    return apiClient.get<PatientDashboardStats>('/users/me/dashboard/stats');
}

/**
 * Get upcoming appointments for patient
 */
export async function getUpcomingAppointments(limit: number = 5): Promise<UpcomingAppointment[]> {
    const response = await apiClient.get<{ appointments: UpcomingAppointment[] }>(
        '/appointments',
        {
            params: {
                status: 'confirmed,checked_in,waiting',
                startDate: new Date().toISOString(),
                sortBy: 'appointmentDate',
                sortOrder: 'asc',
                limit,
            },
        }
    );
    return response.appointments || [];
}

/**
 * Get recent prescriptions
 */
export async function getRecentPrescriptions(limit: number = 5): Promise<RecentPrescription[]> {
    const response = await apiClient.get<{ prescriptions: RecentPrescription[] }>(
        '/prescriptions/my',
        {
            params: {
                sortBy: 'createdAt',
                sortOrder: 'desc',
                limit,
            },
        }
    );
    return response.prescriptions || [];
}

/**
 * Get health records summary
 */
export async function getHealthRecordsSummary(limit: number = 5): Promise<HealthRecordSummary[]> {
    const response = await apiClient.get<{ records: HealthRecordSummary[] }>(
        '/health-records/documents',
        {
            params: {
                sortBy: 'date',
                sortOrder: 'desc',
                limit,
            },
        }
    );
    return response.records || [];
}

/**
 * Get complete patient dashboard data
 * Fetches all dashboard sections in parallel
 */
export async function getPatientDashboardData(): Promise<PatientDashboardData> {
    const [stats, upcomingAppointments, recentPrescriptions, healthRecords] = await Promise.all([
        getPatientDashboardStats().catch(() => ({
            upcomingAppointments: 0,
            completedAppointments: 0,
            activePrescriptions: 0,
            healthRecords: 0,
            familyMembers: 0,
            unreadNotifications: 0,
        })),
        getUpcomingAppointments(5).catch(() => []),
        getRecentPrescriptions(5).catch(() => []),
        getHealthRecordsSummary(5).catch(() => []),
    ]);

    return {
        stats,
        upcomingAppointments,
        recentPrescriptions,
        healthRecords,
        quickActions: {
            canBookAppointment: true,
            hasPendingPayments: false, // TODO: Check pending payments
            hasActiveConsultation: false, // TODO: Check active consultations
        },
    };
}

// =============================================================================
// Server-Side Fetch (for SSR)
// =============================================================================

/**
 * Fetch dashboard data on server side
 * Used for SSR in Next.js Server Components
 */
export async function fetchDashboardDataSSR(
    authToken: string
): Promise<PatientDashboardData | null> {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
        };

        // Fetch all data in parallel
        const [statsRes, appointmentsRes, prescriptionsRes] = await Promise.all([
            fetch(`${API_URL}/users/me/dashboard/stats`, { headers, cache: 'no-store' }),
            fetch(`${API_URL}/appointments?status=confirmed&limit=5&sortBy=appointmentDate&sortOrder=asc`, { headers, cache: 'no-store' }),
            fetch(`${API_URL}/prescriptions/my?limit=5&sortBy=createdAt&sortOrder=desc`, { headers, cache: 'no-store' }),
        ]);

        const stats = statsRes.ok ? (await statsRes.json()).data : null;
        const appointments = appointmentsRes.ok ? (await appointmentsRes.json()).data?.appointments || [] : [];
        const prescriptions = prescriptionsRes.ok ? (await prescriptionsRes.json()).data?.prescriptions || [] : [];

        return {
            stats: stats || {
                upcomingAppointments: appointments.length,
                completedAppointments: 0,
                activePrescriptions: prescriptions.length,
                healthRecords: 0,
                familyMembers: 0,
                unreadNotifications: 0,
            },
            upcomingAppointments: appointments,
            recentPrescriptions: prescriptions,
            healthRecords: [],
            quickActions: {
                canBookAppointment: true,
                hasPendingPayments: false,
                hasActiveConsultation: false,
            },
        };
    } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        return null;
    }
}

// =============================================================================
// Exports
// =============================================================================

export const patientDashboardApi = {
    getStats: getPatientDashboardStats,
    getUpcomingAppointments,
    getRecentPrescriptions,
    getHealthRecordsSummary,
    getDashboardData: getPatientDashboardData,
    fetchSSR: fetchDashboardDataSSR,
};
