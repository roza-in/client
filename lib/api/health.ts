/**
 * Health Records API
 * Handles all health-related API calls (family members, documents, vitals, medications, allergies)
 */

import { api, buildQueryParams, type PaginationMeta } from '@/config/api';
import type {
  FamilyMember,
  FamilyMemberWithHealth,
  HealthDocument,
  VitalRecord,
  Medication,
  Allergy,
  Gender,
  BloodGroup,
  DocumentType,
  AllergySeverity,
  MedicationFrequency,
  MedicationTiming,
} from '@/lib/types';

/**
 * Health document list item type alias
 */
export type HealthDocumentListItem = HealthDocument;

/**
 * Allergy record type alias
 */
export type AllergyRecord = Allergy;

// =============================================================================
// FAMILY MEMBERS
// =============================================================================

/**
 * Family member input
 */
export interface CreateFamilyMemberInput {
  name: string;
  relationship: string;
  dateOfBirth: string;
  gender: Gender;
  bloodGroup?: BloodGroup;
  phone?: string;
  email?: string;
  emergencyContact?: boolean;
}

export type UpdateFamilyMemberInput = Partial<CreateFamilyMemberInput>;

/**
 * List family members
 */
export async function listFamilyMembers(): Promise<FamilyMember[]> {
  return api.get<FamilyMember[]>('/health/family');
}

/**
 * Get family member by ID
 */
export async function getFamilyMember(id: string): Promise<FamilyMember> {
  return api.get<FamilyMember>(`/health/family/${id}`);
}

/**
 * Get family member with health records
 */
export async function getFamilyMemberWithHealth(id: string): Promise<FamilyMemberWithHealth> {
  return api.get<FamilyMemberWithHealth>(`/health/family/${id}/health`);
}

/**
 * Create family member
 */
export async function createFamilyMember(data: CreateFamilyMemberInput): Promise<FamilyMember> {
  return api.post<FamilyMember>('/health/family', data);
}

/**
 * Update family member
 */
export async function updateFamilyMember(
  id: string,
  data: UpdateFamilyMemberInput
): Promise<FamilyMember> {
  return api.put<FamilyMember>(`/health/family/${id}`, data);
}

/**
 * Delete family member
 */
export async function deleteFamilyMember(id: string): Promise<void> {
  return api.delete<void>(`/health/family/${id}`);
}

// =============================================================================
// HEALTH DOCUMENTS
// =============================================================================

/**
 * Health document filters
 */
export interface HealthDocumentFilters {
  familyMemberId?: string;
  documentType?: DocumentType;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

/**
 * Upload document input
 */
export interface UploadDocumentInput {
  familyMemberId?: string;
  documentType: DocumentType;
  title: string;
  description?: string;
  documentDate?: string;
  tags?: string[];
}

/**
 * List health documents
 */
export async function listHealthDocuments(
  filters: HealthDocumentFilters = {}
): Promise<{ documents: HealthDocumentListItem[]; meta: PaginationMeta }> {
  const params = buildQueryParams(filters as Record<string, unknown>);
  const response = await api.getWithMeta<HealthDocumentListItem[]>('/health/documents', { params });
  return {
    documents: response.data,
    meta: response.meta!,
  };
}

/**
 * Get health document by ID
 */
export async function getHealthDocument(id: string): Promise<HealthDocument> {
  return api.get<HealthDocument>(`/health/documents/${id}`);
}

/**
 * Upload health document
 */
export async function uploadHealthDocument(
  file: File,
  data: UploadDocumentInput
): Promise<HealthDocument> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('documentType', data.documentType);
  formData.append('title', data.title);
  if (data.familyMemberId) formData.append('familyMemberId', data.familyMemberId);
  if (data.description) formData.append('description', data.description);
  if (data.documentDate) formData.append('documentDate', data.documentDate);
  if (data.tags) formData.append('tags', JSON.stringify(data.tags));

  return api.upload<HealthDocument>('/health/documents', formData);
}

/**
 * Update health document
 */
export async function updateHealthDocument(
  id: string,
  data: Partial<UploadDocumentInput>
): Promise<HealthDocument> {
  return api.patch<HealthDocument>(`/health/documents/${id}`, data);
}

/**
 * Delete health document
 */
export async function deleteHealthDocument(id: string): Promise<void> {
  return api.delete<void>(`/health/documents/${id}`);
}

/**
 * Get document download URL
 */
export async function getDocumentDownloadUrl(id: string): Promise<{ url: string; expiresAt: string }> {
  return api.get<{ url: string; expiresAt: string }>(`/health/documents/${id}/download`);
}

// =============================================================================
// VITAL RECORDS
// =============================================================================

/**
 * Vital record input
 */
export interface CreateVitalRecordInput {
  familyMemberId?: string;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  oxygenSaturation?: number;
  bloodSugar?: number;
  recordedAt?: string;
  notes?: string;
}

/**
 * Vital record filters
 */
export interface VitalRecordFilters {
  familyMemberId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

/**
 * List vital records
 */
export async function listVitalRecords(
  filters: VitalRecordFilters = {}
): Promise<{ vitals: VitalRecord[]; meta: PaginationMeta }> {
  const params = buildQueryParams(filters as Record<string, unknown>);
  const response = await api.getWithMeta<VitalRecord[]>('/health/vitals', { params });
  return {
    vitals: response.data,
    meta: response.meta!,
  };
}

/**
 * Get vital record by ID
 */
export async function getVitalRecord(id: string): Promise<VitalRecord> {
  return api.get<VitalRecord>(`/health/vitals/${id}`);
}

/**
 * Create vital record
 */
export async function createVitalRecord(data: CreateVitalRecordInput): Promise<VitalRecord> {
  return api.post<VitalRecord>('/health/vitals', data);
}

/**
 * Update vital record
 */
export async function updateVitalRecord(
  id: string,
  data: Partial<CreateVitalRecordInput>
): Promise<VitalRecord> {
  return api.put<VitalRecord>(`/health/vitals/${id}`, data);
}

/**
 * Delete vital record
 */
export async function deleteVitalRecord(id: string): Promise<void> {
  return api.delete<void>(`/health/vitals/${id}`);
}

/**
 * Get latest vital by type
 */
export async function getLatestVital(
  familyMemberId?: string
): Promise<VitalRecord | null> {
  const params = buildQueryParams({
    familyMemberId,
    limit: 1,
    sortBy: 'recordedAt',
    sortOrder: 'desc',
  });
  const response = await api.get<VitalRecord[]>('/health/vitals', { params });
  return response.length > 0 ? response[0] : null;
}

/**
 * Get vital trends (for charts)
 */
export async function getVitalTrends(
  options: {
    familyMemberId?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  } = {}
): Promise<VitalRecord[]> {
  const params = buildQueryParams({
    ...options,
    sortBy: 'recordedAt',
    sortOrder: 'asc',
    limit: options.limit || 30,
  });
  return api.get<VitalRecord[]>('/health/vitals', { params });
}

// =============================================================================
// MEDICATIONS
// =============================================================================

/**
 * Medication input
 */
export interface CreateMedicationInput {
  familyMemberId?: string;
  name: string;
  genericName?: string;
  dosage: string;
  dosageUnit: string;
  frequency: MedicationFrequency;
  timing: MedicationTiming[];
  durationDays?: number;
  startDate: string;
  endDate?: string;
  instructions?: string;
  prescribedBy?: string;
}

/**
 * Medication filters
 */
export interface MedicationFilters {
  familyMemberId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

/**
 * List medications
 */
export async function listMedications(
  filters: MedicationFilters = {}
): Promise<{ medications: Medication[]; meta: PaginationMeta }> {
  const params = buildQueryParams(filters as Record<string, unknown>);
  const response = await api.getWithMeta<Medication[]>('/health/medications', { params });
  return {
    medications: response.data,
    meta: response.meta!,
  };
}

/**
 * Get medication by ID
 */
export async function getMedication(id: string): Promise<Medication> {
  return api.get<Medication>(`/health/medications/${id}`);
}

/**
 * Create medication
 */
export async function createMedication(data: CreateMedicationInput): Promise<Medication> {
  return api.post<Medication>('/health/medications', data);
}

/**
 * Update medication
 */
export async function updateMedication(
  id: string,
  data: Partial<CreateMedicationInput>
): Promise<Medication> {
  return api.put<Medication>(`/health/medications/${id}`, data);
}

/**
 * Delete medication
 */
export async function deleteMedication(id: string): Promise<void> {
  return api.delete<void>(`/health/medications/${id}`);
}

/**
 * Get active medications
 */
export async function getActiveMedications(familyMemberId?: string): Promise<Medication[]> {
  const params = buildQueryParams({ familyMemberId, isActive: true });
  return api.get<Medication[]>('/health/medications', { params });
}

/**
 * Stop medication
 */
export async function stopMedication(
  id: string,
  endDate?: string
): Promise<Medication> {
  return api.patch<Medication>(`/health/medications/${id}`, {
    isActive: false,
    endDate: endDate || new Date().toISOString().split('T')[0],
  });
}

// =============================================================================
// ALLERGIES
// =============================================================================

/**
 * Allergy input
 */
export interface CreateAllergyInput {
  familyMemberId?: string;
  allergen: string;
  allergyType: string;
  severity: AllergySeverity;
  reactions?: string[];
  diagnosedDate?: string;
  diagnosedBy?: string;
  notes?: string;
  isActive?: boolean;
}

/**
 * Allergy filters
 */
export interface AllergyFilters {
  familyMemberId?: string;
  severity?: AllergySeverity;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

/**
 * List allergies
 */
export async function listAllergies(
  filters: AllergyFilters = {}
): Promise<{ allergies: AllergyRecord[]; meta: PaginationMeta }> {
  const params = buildQueryParams(filters as Record<string, unknown>);
  const response = await api.getWithMeta<AllergyRecord[]>('/health/allergies', { params });
  return {
    allergies: response.data,
    meta: response.meta!,
  };
}

/**
 * Get allergy by ID
 */
export async function getAllergy(id: string): Promise<AllergyRecord> {
  return api.get<AllergyRecord>(`/health/allergies/${id}`);
}

/**
 * Create allergy
 */
export async function createAllergy(data: CreateAllergyInput): Promise<AllergyRecord> {
  return api.post<AllergyRecord>('/health/allergies', data);
}

/**
 * Update allergy
 */
export async function updateAllergy(
  id: string,
  data: Partial<CreateAllergyInput>
): Promise<AllergyRecord> {
  return api.put<AllergyRecord>(`/health/allergies/${id}`, data);
}

/**
 * Delete allergy
 */
export async function deleteAllergy(id: string): Promise<void> {
  return api.delete<void>(`/health/allergies/${id}`);
}

/**
 * Get active allergies
 */
export async function getActiveAllergies(familyMemberId?: string): Promise<AllergyRecord[]> {
  const params = buildQueryParams({ familyMemberId, isActive: true });
  return api.get<AllergyRecord[]>('/health/allergies', { params });
}

/**
 * Get severe allergies (for alerts)
 */
export async function getSevereAllergies(familyMemberId?: string): Promise<AllergyRecord[]> {
  const params = buildQueryParams({
    familyMemberId,
    severity: 'severe',
    isActive: true,
  });
  return api.get<AllergyRecord[]>('/health/allergies', { params });
}

// =============================================================================
// HEALTH SUMMARY
// =============================================================================

/**
 * Health summary response
 */
export interface HealthSummary {
  familyMember?: FamilyMember;
  latestVitals: VitalRecord | null;
  activeMedications: Medication[];
  activeAllergies: AllergyRecord[];
  recentDocuments: HealthDocumentListItem[];
  upcomingAppointments?: unknown[];
}

/**
 * Get health summary
 */
export async function getHealthSummary(familyMemberId?: string): Promise<HealthSummary> {
  const endpoint = familyMemberId
    ? `/health/summary/${familyMemberId}`
    : '/health/summary';
  return api.get<HealthSummary>(endpoint);
}

/**
 * Get complete health record (for export/sharing)
 */
export async function getCompleteHealthRecord(
  familyMemberId?: string
): Promise<{
  summary: HealthSummary;
  allVitals: VitalRecord[];
  allMedications: Medication[];
  allAllergies: AllergyRecord[];
  allDocuments: HealthDocumentListItem[];
}> {
  const endpoint = familyMemberId
    ? `/health/complete/${familyMemberId}`
    : '/health/complete';
  return api.get(endpoint);
}

// =============================================================================
// API NAMESPACE EXPORTS
// =============================================================================

/**
 * Family Members API
 */
export const familyApi = {
  list: listFamilyMembers,
  get: getFamilyMember,
  getWithHealth: getFamilyMemberWithHealth,
  create: createFamilyMember,
  update: updateFamilyMember,
  delete: deleteFamilyMember,
};

/**
 * Health Documents API
 */
export const documentsApi = {
  list: listHealthDocuments,
  get: getHealthDocument,
  upload: uploadHealthDocument,
  update: updateHealthDocument,
  delete: deleteHealthDocument,
  getDownloadUrl: getDocumentDownloadUrl,
};

/**
 * Vital Records API
 */
export const vitalsApi = {
  list: listVitalRecords,
  get: getVitalRecord,
  create: createVitalRecord,
  update: updateVitalRecord,
  delete: deleteVitalRecord,
  getLatest: getLatestVital,
  getTrends: getVitalTrends,
};

/**
 * Medications API
 */
export const medicationsApi = {
  list: listMedications,
  get: getMedication,
  create: createMedication,
  update: updateMedication,
  delete: deleteMedication,
  getActive: getActiveMedications,
  stop: stopMedication,
};

/**
 * Allergies API
 */
export const allergiesApi = {
  list: listAllergies,
  get: getAllergy,
  create: createAllergy,
  update: updateAllergy,
  delete: deleteAllergy,
  getActive: getActiveAllergies,
  getSevere: getSevereAllergies,
};

/**
 * Combined Health API namespace
 */
export const healthApi = {
  family: familyApi,
  documents: documentsApi,
  vitals: vitalsApi,
  medications: medicationsApi,
  allergies: allergiesApi,
  getSummary: getHealthSummary,
  getCompleteRecord: getCompleteHealthRecord,
};
