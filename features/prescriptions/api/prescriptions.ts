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
 * Get prescription for an appointment
 */
export async function getPrescriptionByAppointment(appointmentId: string): Promise<Prescription | null> {
    try {
        return await api.get<Prescription>(endpoints.prescriptions.forAppointment(appointmentId));
    } catch {
        return null;
    }
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

/**
 * Download prescription PDF
 */
export async function downloadPrescriptionPdf(id: string): Promise<Blob> {
    const response = await fetch(`/api${endpoints.prescriptions.pdf(id)}`, {
        credentials: 'include',
    });
    return response.blob();
}

/**
 * Send prescription via WhatsApp/Email
 */
export async function sendPrescription(
    id: string,
    via: 'whatsapp' | 'email' | 'both'
): Promise<{ sent: boolean }> {
    return api.post<{ sent: boolean }>(endpoints.prescriptions.send(id), { via });
}
