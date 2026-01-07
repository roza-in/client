/**
 * Consultation API
 * Handles all consultation-related API calls (video calls, prescriptions, etc.)
 */

import { api, buildQueryParams, type PaginationMeta } from '@/config/api';
import type {
  Consultation,
  Prescription,
  PrescriptionMedication,
  ConsultationStatus,
} from '@/lib/types';

/**
 * Consultation detail type alias
 */
export type ConsultationDetail = Consultation;

/**
 * Consultation filters
 */
export interface ConsultationFilters {
  appointmentId?: string;
  doctorId?: string;
  patientId?: string;
  status?: ConsultationStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

/**
 * Start consultation input
 */
export interface StartConsultationInput {
  appointmentId: string;
  notes?: string;
}

/**
 * End consultation input
 */
export interface EndConsultationInput {
  diagnosis?: string;
  notes?: string;
  followUpDate?: string;
  followUpNotes?: string;
}

/**
 * Create prescription input
 */
export interface CreatePrescriptionInput {
  consultationId: string;
  diagnosis: string;
  medicines: PrescriptionMedication[];
  advice?: string;
  followUpDate?: string;
  followUpNotes?: string;
  validUntil?: string;
}

/**
 * Start a consultation
 */
export async function startConsultation(data: StartConsultationInput): Promise<Consultation> {
  return api.post<Consultation>('/consultations/start', data);
}

/**
 * End a consultation
 */
export async function endConsultation(
  id: string,
  data: EndConsultationInput
): Promise<Consultation> {
  return api.post<Consultation>(`/consultations/${id}/end`, data);
}

/**
 * Get consultation by ID
 */
export async function getConsultation(id: string): Promise<ConsultationDetail> {
  return api.get<ConsultationDetail>(`/consultations/${id}`);
}

/**
 * List consultations
 */
export async function listConsultations(
  filters: ConsultationFilters = {}
): Promise<{ consultations: Consultation[]; meta: PaginationMeta }> {
  const params = buildQueryParams(filters as Record<string, unknown>);
  const response = await api.getWithMeta<Consultation[]>('/consultations', { params });
  return {
    consultations: response.data,
    meta: response.meta!,
  };
}

/**
 * Get video token for consultation
 */
export async function getVideoToken(consultationId: string): Promise<{
  token: string;
  channelName: string;
  uid: number;
  expiresAt: string;
}> {
  return api.get(`/consultations/${consultationId}/video-token`);
}

/**
 * Join video consultation (for patient)
 */
export async function joinVideoConsultation(consultationId: string): Promise<{
  token: string;
  channelName: string;
  uid: number;
  expiresAt: string;
  consultation: Consultation;
}> {
  return api.post(`/consultations/${consultationId}/join`);
}

/**
 * Leave video consultation
 */
export async function leaveVideoConsultation(consultationId: string): Promise<void> {
  return api.post(`/consultations/${consultationId}/leave`);
}

/**
 * Update consultation notes
 */
export async function updateConsultationNotes(
  id: string,
  notes: string
): Promise<Consultation> {
  return api.patch<Consultation>(`/consultations/${id}/notes`, { notes });
}

// =============================================================================
// PRESCRIPTIONS
// =============================================================================

/**
 * Create prescription
 */
export async function createPrescription(data: CreatePrescriptionInput): Promise<Prescription> {
  return api.post<Prescription>('/consultations/prescriptions', data);
}

/**
 * Get prescription by ID
 */
export async function getPrescription(id: string): Promise<Prescription> {
  return api.get<Prescription>(`/consultations/prescriptions/${id}`);
}

/**
 * Update prescription
 */
export async function updatePrescription(
  id: string,
  data: Partial<CreatePrescriptionInput>
): Promise<Prescription> {
  return api.put<Prescription>(`/consultations/prescriptions/${id}`, data);
}

/**
 * Get prescriptions for a consultation
 */
export async function getConsultationPrescriptions(
  consultationId: string
): Promise<Prescription[]> {
  return api.get<Prescription[]>(`/consultations/${consultationId}/prescriptions`);
}

/**
 * Get patient prescriptions
 */
export async function getPatientPrescriptions(
  patientId: string,
  options: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  } = {}
): Promise<{ prescriptions: Prescription[]; meta: PaginationMeta }> {
  const params = buildQueryParams({ patientId, ...options });
  const response = await api.getWithMeta<Prescription[]>('/consultations/prescriptions', {
    params,
  });
  return {
    prescriptions: response.data,
    meta: response.meta!,
  };
}

/**
 * Download prescription as PDF
 */
export async function downloadPrescription(id: string): Promise<{ url: string; expiresAt: string }> {
  return api.get<{ url: string; expiresAt: string }>(
    `/consultations/prescriptions/${id}/download`
  );
}

/**
 * Send prescription to email
 */
export async function sendPrescriptionToEmail(
  id: string,
  email: string
): Promise<{ sent: boolean }> {
  return api.post<{ sent: boolean }>(`/consultations/prescriptions/${id}/send`, { email });
}

/**
 * Verify prescription (for pharmacies)
 */
export async function verifyPrescription(prescriptionNumber: string): Promise<{
  valid: boolean;
  prescription?: Prescription;
  message?: string;
}> {
  return api.get(`/consultations/prescriptions/verify/${prescriptionNumber}`);
}

// =============================================================================
// CONSULTATION HELPERS
// =============================================================================

/**
 * Get active consultation for an appointment
 */
export async function getActiveConsultation(appointmentId: string): Promise<Consultation | null> {
  try {
    const { consultations } = await listConsultations({
      appointmentId,
      status: 'in_progress',
    });
    return consultations.length > 0 ? consultations[0] : null;
  } catch {
    return null;
  }
}

/**
 * Check if consultation is joinable
 */
export async function isConsultationJoinable(consultationId: string): Promise<{
  joinable: boolean;
  reason?: string;
  startsIn?: number;
}> {
  return api.get(`/consultations/${consultationId}/can-join`);
}

/**
 * Get consultation duration
 */
export function getConsultationDuration(
  startTime: string,
  endTime?: string
): { minutes: number; formatted: string } {
  const start = new Date(startTime).getTime();
  const end = endTime ? new Date(endTime).getTime() : Date.now();
  const diffMs = end - start;
  const minutes = Math.floor(diffMs / 60000);
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  return {
    minutes,
    formatted: hours > 0 ? `${hours}h ${mins}m` : `${mins}m`,
  };
}

// =============================================================================
// API NAMESPACE EXPORTS
// =============================================================================

/**
 * Prescriptions API
 */
export const prescriptionApi = {
  create: createPrescription,
  get: getPrescription,
  update: updatePrescription,
  getForConsultation: getConsultationPrescriptions,
  getPatientPrescriptions,
  download: downloadPrescription,
  sendToEmail: sendPrescriptionToEmail,
  verify: verifyPrescription,
};

/**
 * Consultation API namespace export
 */
export const consultationApi = {
  start: startConsultation,
  end: endConsultation,
  get: getConsultation,
  list: listConsultations,
  getVideoToken,
  join: joinVideoConsultation,
  leave: leaveVideoConsultation,
  updateNotes: updateConsultationNotes,
  getActive: getActiveConsultation,
  isJoinable: isConsultationJoinable,
  getDuration: getConsultationDuration,
  prescriptions: prescriptionApi,
};
