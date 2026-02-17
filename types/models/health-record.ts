/**
 * Rozx Healthcare Platform — Health Record Model Types
 */

// =============================================================================
// Health Record Document
// =============================================================================

export interface HealthDocument {
    id: string;
    patientId: string;
    familyMemberId: string | null;
    title: string;
    description: string | null;
    documentType: string;
    fileUrl: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    uploadedBy: string;
    tags: string[] | null;
    createdAt: string;
    updatedAt: string;
}

// =============================================================================
// Vitals
// =============================================================================

export interface VitalRecord {
    id: string;
    patientId: string;
    familyMemberId: string | null;
    bloodPressureSystolic: number | null;
    bloodPressureDiastolic: number | null;
    heartRate: number | null;
    temperature: number | null;
    weight: number | null;
    height: number | null;
    spo2: number | null;
    bloodSugar: number | null;
    respiratoryRate: number | null;
    notes: string | null;
    recordedAt: string;
    recordedBy: string | null;
    createdAt: string;
}

export interface VitalTrend {
    date: string;
    bloodPressureSystolic: number | null;
    bloodPressureDiastolic: number | null;
    heartRate: number | null;
    weight: number | null;
    bloodSugar: number | null;
    spo2: number | null;
}

// =============================================================================
// Medications
// =============================================================================

export interface MedicationRecord {
    id: string;
    patientId: string;
    familyMemberId: string | null;
    medicineName: string;
    genericName: string | null;
    dosage: string;
    frequency: string;
    route: string | null;
    startDate: string;
    endDate: string | null;
    prescribedBy: string | null;
    prescriptionId: string | null;
    isActive: boolean;
    notes: string | null;
    sideEffects: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface MedicationReminder {
    id: string;
    medicationId: string;
    medicineName: string;
    dosage: string;
    scheduledTime: string;
    taken: boolean;
}

// =============================================================================
// Allergies
// =============================================================================

export interface AllergyRecord {
    id: string;
    patientId: string;
    familyMemberId: string | null;
    allergen: string;
    allergenType: string;
    severity: 'mild' | 'moderate' | 'severe' | 'life_threatening';
    reaction: string | null;
    diagnosedDate: string | null;
    notes: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// =============================================================================
// Family Members (health context)
// =============================================================================

export interface HealthFamilyMember {
    id: string;
    patientId: string;
    name: string;
    relationship: string;
    dateOfBirth: string | null;
    gender: string | null;
    bloodGroup: string | null;
    createdAt: string;
    updatedAt: string;
}

// =============================================================================
// Health Summary
// =============================================================================

export interface HealthSummary {
    vitals: VitalRecord | null;
    activeMedications: number;
    allergies: number;
    documents: number;
    familyMembers: number;
    recentAppointments: number;
}

// =============================================================================
// Input Types
// =============================================================================

export interface CreateVitalInput {
    familyMemberId?: string;
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    heartRate?: number;
    temperature?: number;
    weight?: number;
    height?: number;
    spo2?: number;
    bloodSugar?: number;
    respiratoryRate?: number;
    notes?: string;
    recordedAt?: string;
}

export interface CreateMedicationInput {
    familyMemberId?: string;
    medicineName: string;
    genericName?: string;
    dosage: string;
    frequency: string;
    route?: string;
    startDate: string;
    endDate?: string;
    prescribedBy?: string;
    prescriptionId?: string;
    notes?: string;
}

export interface CreateAllergyInput {
    familyMemberId?: string;
    allergen: string;
    allergenType: string;
    severity: 'mild' | 'moderate' | 'severe' | 'life_threatening';
    reaction?: string;
    diagnosedDate?: string;
    notes?: string;
}

export interface CreateHealthDocumentInput {
    familyMemberId?: string;
    title: string;
    description?: string;
    documentType: string;
    tags?: string[];
}

export interface CreateFamilyMemberInput {
    name: string;
    relationship: string;
    dateOfBirth?: string;
    gender?: string;
    bloodGroup?: string;
}
