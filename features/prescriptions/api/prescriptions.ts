/**
 * Prescriptions Feature - API
 */

import { api, endpoints } from '@/lib/api';
import type { Prescription, PrescriptionMedication, LabTest, CreatePrescriptionInput, UpdatePrescriptionInput, PrescriptionFilters } from '@/types';

// =============================================================================
// API Functions
// =============================================================================

/**
 * Get prescriptions list for current user (patient or doctor)
 */
export async function getPrescriptions(params?: PrescriptionFilters): Promise<{
    prescriptions: Prescription[];
    total: number;
    page: number;
}> {
    const { data, meta } = await api.getWithMeta<Prescription[]>(endpoints.prescriptions.my, { params });
    return {
        prescriptions: data,
        total: meta?.total || 0,
        page: meta?.page || 1,
    };
}

/**
 * Get prescription by ID
 */
export async function getPrescription(id: string): Promise<Prescription> {
    return api.get<Prescription>(endpoints.prescriptions.get(id));
}

/**
 * Create a new prescription (doctor only)
 */
export async function createPrescription(input: CreatePrescriptionInput): Promise<Prescription> {
    return api.post<Prescription>(endpoints.prescriptions.create, input);
}

/**
 * Update a prescription (doctor only)
 */
export async function updatePrescription(
    id: string,
    input: UpdatePrescriptionInput
): Promise<Prescription> {
    return api.patch<Prescription>(endpoints.prescriptions.update(id), input);
}

