/**
 * Health Records API Functions
 */
import { api } from '@/lib/api';
import type {
    HealthDocument,
    VitalRecord,
    VitalTrend,
    MedicationRecord,
    MedicationReminder,
    AllergyRecord,
    HealthFamilyMember,
    HealthSummary,
    CreateVitalInput,
    CreateMedicationInput,
    CreateAllergyInput,
    CreateHealthDocumentInput,
    CreateFamilyMemberInput,
} from '@/types';

const HR_BASE = '/health-records';

// ─── Summary ──────────────────────────────────────────────────────────────────

export async function getHealthSummary() {
    return api.get<HealthSummary>(`${HR_BASE}/summary`);
}

export async function getFamilyMemberSummary(memberId: string) {
    return api.get<HealthSummary>(`${HR_BASE}/family-summary/${memberId}`);
}

// ─── Documents ────────────────────────────────────────────────────────────────

export async function getDocuments(filters: Record<string, string | number | boolean | string[] | null | undefined> = {}) {
    const { data, meta } = await api.getWithMeta<HealthDocument[]>(
        `${HR_BASE}/documents`,
        { params: filters }
    );
    return { documents: data, pagination: meta };
}

export async function getDocument(id: string) {
    return api.get<HealthDocument>(`${HR_BASE}/documents/${id}`);
}

export async function uploadDocument(formData: FormData) {
    return api.upload<HealthDocument>(`${HR_BASE}/documents`, formData);
}

export async function updateDocument(id: string, input: Partial<CreateHealthDocumentInput>) {
    return api.patch<HealthDocument>(`${HR_BASE}/documents/${id}`, input);
}

export async function deleteDocument(id: string) {
    return api.delete(`${HR_BASE}/documents/${id}`);
}

// ─── Vitals ───────────────────────────────────────────────────────────────────

export async function getVitals(filters: Record<string, string | number | boolean | string[] | null | undefined> = {}) {
    const { data, meta } = await api.getWithMeta<VitalRecord[]>(
        `${HR_BASE}/vitals`,
        { params: filters }
    );
    return { vitals: data, pagination: meta };
}

export async function getVital(id: string) {
    return api.get<VitalRecord>(`${HR_BASE}/vitals/${id}`);
}

export async function createVital(input: CreateVitalInput) {
    return api.post<VitalRecord>(`${HR_BASE}/vitals`, input);
}

export async function deleteVital(id: string) {
    return api.delete(`${HR_BASE}/vitals/${id}`);
}

export async function getVitalTrends(params: { period?: string; familyMemberId?: string } = {}) {
    return api.get<VitalTrend[]>(`${HR_BASE}/vitals/trends`, {
        params: params as Record<string, string | number | boolean | string[] | null | undefined>,
    });
}

// ─── Medications ──────────────────────────────────────────────────────────────

export async function getMedications(filters: Record<string, string | number | boolean | string[] | null | undefined> = {}) {
    const { data, meta } = await api.getWithMeta<MedicationRecord[]>(
        `${HR_BASE}/medications`,
        { params: filters }
    );
    return { medications: data, pagination: meta };
}

export async function getMedication(id: string) {
    return api.get<MedicationRecord>(`${HR_BASE}/medications/${id}`);
}

export async function createMedication(input: CreateMedicationInput) {
    return api.post<MedicationRecord>(`${HR_BASE}/medications`, input);
}

export async function updateMedication(id: string, input: Partial<CreateMedicationInput>) {
    return api.patch<MedicationRecord>(`${HR_BASE}/medications/${id}`, input);
}

export async function deleteMedication(id: string) {
    return api.delete(`${HR_BASE}/medications/${id}`);
}

export async function getMedicationReminders() {
    return api.get<MedicationReminder[]>(`${HR_BASE}/medications/reminders`);
}

export async function takeMedicationAction(id: string, action: string) {
    return api.post<MedicationRecord>(`${HR_BASE}/medications/${id}/actions`, { action });
}

// ─── Allergies ────────────────────────────────────────────────────────────────

export async function getAllergies(filters: Record<string, string | number | boolean | string[] | null | undefined> = {}) {
    const { data, meta } = await api.getWithMeta<AllergyRecord[]>(
        `${HR_BASE}/allergies`,
        { params: filters }
    );
    return { allergies: data, pagination: meta };
}

export async function getAllergy(id: string) {
    return api.get<AllergyRecord>(`${HR_BASE}/allergies/${id}`);
}

export async function createAllergy(input: CreateAllergyInput) {
    return api.post<AllergyRecord>(`${HR_BASE}/allergies`, input);
}

export async function updateAllergy(id: string, input: Partial<CreateAllergyInput>) {
    return api.patch<AllergyRecord>(`${HR_BASE}/allergies/${id}`, input);
}

export async function deleteAllergy(id: string) {
    return api.delete(`${HR_BASE}/allergies/${id}`);
}

// ─── Family Members ───────────────────────────────────────────────────────────

export async function getHealthFamilyMembers() {
    return api.get<HealthFamilyMember[]>(`${HR_BASE}/family-members`);
}

export async function getHealthFamilyMember(id: string) {
    return api.get<HealthFamilyMember>(`${HR_BASE}/family-members/${id}`);
}

export async function createHealthFamilyMember(input: CreateFamilyMemberInput) {
    return api.post<HealthFamilyMember>(`${HR_BASE}/family-members`, input);
}

export async function updateHealthFamilyMember(id: string, input: Partial<CreateFamilyMemberInput>) {
    return api.patch<HealthFamilyMember>(`${HR_BASE}/family-members/${id}`, input);
}

export async function deleteHealthFamilyMember(id: string) {
    return api.delete(`${HR_BASE}/family-members/${id}`);
}
