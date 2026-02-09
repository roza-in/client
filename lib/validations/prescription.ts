/**
 * ROZX Healthcare Platform - Prescription Validation Schemas
 */

import { z } from 'zod';
import { uuidSchema } from './common';

// =============================================================================
// Medication Schema
// =============================================================================

export const medicationSchema = z.object({
    medicineName: z.string().min(1, 'Medicine name is required').max(200),
    dosage: z.string().min(1, 'Dosage is required').max(100),
    frequency: z.string().min(1, 'Frequency is required').max(100),
    duration: z.string().min(1, 'Duration is required').max(100),
    instructions: z.string().max(500).optional(),
    quantity: z.number().int().min(1).optional(),
    refillable: z.boolean().default(false),
    beforeAfterFood: z.enum(['before', 'after', 'with', 'any']).default('any'),
    timing: z.object({
        morning: z.boolean().default(false),
        afternoon: z.boolean().default(false),
        evening: z.boolean().default(false),
        night: z.boolean().default(false),
    }).optional(),
});

// =============================================================================
// Lab Test Schema
// =============================================================================

export const labTestSchema = z.object({
    testName: z.string().min(1, 'Test name is required').max(200),
    testCode: z.string().max(50).optional(),
    instructions: z.string().max(500).optional(),
    urgency: z.enum(['routine', 'urgent', 'emergency']).default('routine'),
    fasting: z.boolean().default(false),
});

// =============================================================================
// Prescription Schemas
// =============================================================================

export const createPrescriptionSchema = z.object({
    appointmentId: uuidSchema,
    diagnosis: z.string().min(1, 'Diagnosis is required').max(1000),
    symptoms: z.array(z.string()).min(1, 'At least one symptom is required').max(20),
    medications: z.array(medicationSchema).min(1, 'At least one medication is required').max(20),
    labTests: z.array(labTestSchema).max(20).optional(),
    advice: z.string().max(2000).optional(),
    followUpDays: z.number().int().min(1).max(365).optional(),
    validityDays: z.number().int().min(1).max(30).default(7),
});

export const updatePrescriptionSchema = z.object({
    prescriptionId: uuidSchema,
    diagnosis: z.string().min(1).max(1000).optional(),
    symptoms: z.array(z.string()).max(20).optional(),
    medications: z.array(medicationSchema).max(20).optional(),
    labTests: z.array(labTestSchema).max(20).optional(),
    advice: z.string().max(2000).optional(),
    followUpDays: z.number().int().min(1).max(365).optional(),
});

// =============================================================================
// Prescription Filter Schema
// =============================================================================

export const prescriptionFilterSchema = z.object({
    patientId: uuidSchema.optional(),
    doctorId: uuidSchema.optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
});

// =============================================================================
// Type Exports
// =============================================================================

export type MedicationData = z.infer<typeof medicationSchema>;
export type LabTestData = z.infer<typeof labTestSchema>;
export type CreatePrescriptionData = z.infer<typeof createPrescriptionSchema>;
export type UpdatePrescriptionData = z.infer<typeof updatePrescriptionSchema>;
export type PrescriptionFilterData = z.infer<typeof prescriptionFilterSchema>;
