/**
 * Doctor Patients Feature - Hook
 * Fetches patients that the doctor has consulted with based on their appointments
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { api, endpoints } from '@/lib/api';
import type { AppointmentListItem } from '@/types';

// =============================================================================
// Types
// =============================================================================

export interface DoctorPatient {
    id: string;
    name: string;
    phone: string | null;
    age: number | null;
    gender: string | null;
    avatar: string | null;
    totalVisits: number;
    lastVisitDate: string;
    lastVisitStatus: string;
}

export interface DoctorPatientsFilters {
    search?: string;
    page?: number;
    limit?: number;
}

// =============================================================================
// Query Keys
// =============================================================================

export const doctorPatientKeys = {
    all: ['doctor-patients'] as const,
    list: (filters: DoctorPatientsFilters) => [...doctorPatientKeys.all, 'list', filters] as const,
};

// =============================================================================
// Hooks
// =============================================================================

/**
 * Hook to fetch patients that the doctor has consulted with
 * Derives patient list from completed appointments
 */
export function useDoctorPatients(doctorId: string | null, filters: DoctorPatientsFilters = {}) {
    return useQuery({
        queryKey: doctorId ? doctorPatientKeys.list({ ...filters, doctorId } as any) : ['doctor-patients', 'disabled'],
        queryFn: async () => {
            // Fetch all appointments for this doctor to derive patient list
            const response = await api.getWithMeta<AppointmentListItem[]>(
                endpoints.appointments.list,
                {
                    params: {
                        doctorId,
                        status: 'completed',
                        limit: 100,
                        sortBy: 'appointmentDate',
                        sortOrder: 'desc',
                    },
                }
            );

            // Group by patient and calculate stats
            const patientMap = new Map<string, DoctorPatient>();

            response.data.forEach((appointment) => {
                const patientId = appointment.id; // Using appointment id as patient identifier
                const patientName = appointment.patientName || 'Unknown Patient';

                if (!patientMap.has(patientName)) {
                    patientMap.set(patientName, {
                        id: patientId,
                        name: patientName,
                        phone: null, // Will be available in detail view
                        age: null,
                        gender: null,
                        avatar: appointment.patientAvatar || null,
                        totalVisits: 1,
                        lastVisitDate: appointment.appointmentDate,
                        lastVisitStatus: appointment.status,
                    });
                } else {
                    const existing = patientMap.get(patientName)!;
                    existing.totalVisits += 1;
                    // Keep the most recent visit date
                    if (new Date(appointment.appointmentDate) > new Date(existing.lastVisitDate)) {
                        existing.lastVisitDate = appointment.appointmentDate;
                        existing.lastVisitStatus = appointment.status;
                    }
                }
            });

            let patients = Array.from(patientMap.values());

            // Apply search filter
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                patients = patients.filter((p) =>
                    p.name.toLowerCase().includes(searchLower)
                );
            }

            // Sort by last visit date (most recent first)
            patients.sort((a, b) => new Date(b.lastVisitDate).getTime() - new Date(a.lastVisitDate).getTime());

            // Apply pagination
            const page = filters.page || 1;
            const limit = filters.limit || 10;
            const startIndex = (page - 1) * limit;
            const paginatedPatients = patients.slice(startIndex, startIndex + limit);

            return {
                patients: paginatedPatients,
                total: patients.length,
                page,
                limit,
                totalPages: Math.ceil(patients.length / limit),
            };
        },
        enabled: !!doctorId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
