/**
 * ROZX Healthcare Platform - Prescription Model Types
 */

import type { DocumentType } from '../enums';

// =============================================================================
// Prescription Entity (Full)
// =============================================================================

export interface Prescription {
    id: string;
    appointmentId: string;
    doctorId: string;
    patientId: string;
    hospitalId: string;

    // Prescription Info
    prescriptionNumber: string;
    diagnosis: string;
    icdCodes: string[] | null;

    // Medications
    medications: PrescriptionMedication[];

    // Lab Tests
    labTests: LabTest[] | null;

    // Advice
    lifestyleAdvice: string | null;
    dietaryAdvice: string | null;
    followUpInstructions: string | null;

    // Follow-up
    followUpAfterDays: number | null;
    followUpDate: string | null;

    // Additional
    additionalNotes: string | null;
    pdfUrl: string | null;

    // Signature
    signedAt: string | null;
    signatureUrl: string | null;

    // Status
    isActive: boolean;
    expiresAt: string | null;

    // Timestamps
    createdAt: string;
    updatedAt: string;
}

// =============================================================================
// Prescription Medication
// =============================================================================

export interface PrescriptionMedication {
    name: string;
    genericName?: string;
    brand?: string;
    dosage: string;
    frequency: string;
    duration: string;
    timing: string;
    instructions: string | null;
    beforeFood: boolean;
    quantity?: number;
    route?: 'oral' | 'topical' | 'injection' | 'inhalation' | 'other';
}

// =============================================================================
// Lab Test
// =============================================================================

export interface LabTest {
    name: string;
    instructions: string | null;
    isUrgent: boolean;
    category?: string;
}

// =============================================================================
// Prescription List Item
// =============================================================================

export interface PrescriptionListItem {
    id: string;
    prescriptionNumber: string;
    diagnosis: string;
    medicationCount: number;
    doctorName: string;
    hospitalName: string;
    appointmentDate: string;
    pdfUrl: string | null;
    createdAt: string;
}

// =============================================================================
// Prescription with Details
// =============================================================================

export interface PrescriptionWithDetails extends Prescription {
    doctor: {
        id: string;
        name: string;
        specialization: string;
        qualification: string;
        registrationNumber: string;
        signatureUrl: string | null;
    };
    hospital: {
        id: string;
        name: string;
        addressLine1: string;
        city: string;
        phone: string;
        logoUrl: string | null;
    };
    patient: {
        id: string;
        name: string;
        phone: string;
        gender: string | null;
        dateOfBirth: string | null;
    };
    appointment: {
        id: string;
        appointmentDate: string;
        consultationType: string;
        chiefComplaint: string | null;
        vitals: Record<string, number> | null;
    };
}

// =============================================================================
// Health Document
// =============================================================================

export interface HealthDocument {
    id: string;
    userId: string;
    familyMemberId: string | null;

    // Document Info
    title: string;
    type: DocumentType;
    description: string | null;

    // File
    fileUrl: string;
    fileName: string;
    fileSize: number;
    mimeType: string;

    // Metadata
    documentDate: string;
    source: string | null;
    tags: string[] | null;

    // Medical Details
    doctorId: string | null;
    hospitalId: string | null;
    appointmentId: string | null;
    prescriptionId: string | null;

    // Status
    isVerified: boolean;
    verifiedAt: string | null;
    verifiedBy: string | null;

    // Timestamps
    createdAt: string;
    updatedAt: string;
}

// =============================================================================
// Medication Reminder
// =============================================================================

export interface MedicationReminder {
    id: string;
    userId: string;
    familyMemberId: string | null;
    prescriptionId: string | null;

    // Medication Details
    medicineName: string;
    dosage: string;
    frequency: string;
    timing: string[];
    instructions: string | null;

    // Schedule
    startDate: string;
    endDate: string | null;
    reminderTimes: string[];

    // Status
    isActive: boolean;
    isPaused: boolean;
    pausedAt: string | null;

    // Stats
    totalDoses: number;
    takenDoses: number;
    missedDoses: number;

    // Timestamps
    createdAt: string;
    updatedAt: string;
}

export interface MedicationLog {
    id: string;
    reminderId: string;
    scheduledTime: string;
    scheduledDate: string;
    status: 'taken' | 'missed' | 'skipped' | 'late';
    takenAt: string | null;
    notes: string | null;
    createdAt: string;
}

// =============================================================================
// Input Types
// =============================================================================

export interface CreatePrescriptionInput {
    appointmentId: string;
    consultationId?: string;
    diagnosis: string;
    symptoms?: string[];
    medications: (Omit<PrescriptionMedication, 'id' | 'prescriptionId'> | PrescriptionMedication)[];
    labTests?: (Omit<LabTest, 'id' | 'prescriptionId' | 'status' | 'resultDate'> | LabTest)[];
    icdCodes?: string[];
    advice?: string;
    lifestyleAdvice?: string;
    dietaryAdvice?: string;
    followUpInstructions?: string;
    followUpDays?: number;
    followUpAfterDays?: number;
    validityDays?: number;
    additionalNotes?: string;
}

export interface UpdatePrescriptionInput {
    diagnosis?: string;
    symptoms?: string[];
    medications?: (Omit<PrescriptionMedication, 'id' | 'prescriptionId'> | PrescriptionMedication)[];
    labTests?: (Omit<LabTest, 'id' | 'prescriptionId' | 'status' | 'resultDate'> | LabTest)[];
    icdCodes?: string[];
    advice?: string;
    lifestyleAdvice?: string;
    dietaryAdvice?: string;
    followUpInstructions?: string;
    followUpDays?: number;
    followUpAfterDays?: number;
    additionalNotes?: string;
}

export interface UploadDocumentInput {
    title: string;
    type: DocumentType;
    description?: string;
    documentDate: string;
    source?: string;
    tags?: string[];
    familyMemberId?: string;
    appointmentId?: string;
}

export interface CreateMedicationReminderInput {
    medicineName: string;
    dosage: string;
    frequency: string;
    timing: string[];
    instructions?: string;
    startDate: string;
    endDate?: string;
    reminderTimes: string[];
    familyMemberId?: string;
    prescriptionId?: string;
}

// =============================================================================
// Filter Types
// =============================================================================

export interface PrescriptionFilters {
    [key: string]: any;
    patientId?: string;
    doctorId?: string;
    hospitalId?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'appointmentDate';
    sortOrder?: 'asc' | 'desc';
}

export interface HealthDocumentFilters {
    type?: DocumentType | DocumentType[];
    familyMemberId?: string;
    startDate?: string;
    endDate?: string;
    tags?: string[];
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: 'documentDate' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}
