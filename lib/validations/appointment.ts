/**
 * ROZX Healthcare Platform - Appointment Validation Schemas
 */

import { z } from 'zod';
import { uuidSchema, dateStringSchema, futureDateSchema, phoneSchema } from './common';

// =============================================================================
// Booking Schemas
// =============================================================================

export const bookAppointmentSchema = z.object({
    doctorId: uuidSchema,
    patientId: uuidSchema.optional(), // Optional for family member booking
    familyMemberId: uuidSchema.optional(),
    hospitalId: uuidSchema.optional(),
    appointmentDate: futureDateSchema,
    timeSlot: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
    consultationType: z.enum(['in_person', 'video', 'audio']),
    symptoms: z.string().max(1000).optional(),
    notes: z.string().max(500).optional(),
    isFollowUp: z.boolean().default(false),
    previousAppointmentId: uuidSchema.optional(),
});

export const rescheduleAppointmentSchema = z.object({
    appointmentId: uuidSchema,
    newDate: futureDateSchema,
    newTimeSlot: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
    reason: z.string().min(5, 'Please provide a reason').max(500),
});

export const cancelAppointmentSchema = z.object({
    appointmentId: uuidSchema,
    reason: z.string().min(5, 'Please provide a reason').max(500),
    cancelledBy: z.enum(['patient', 'doctor', 'hospital', 'system']),
});

// =============================================================================
// Appointment Action Schemas
// =============================================================================

export const checkInAppointmentSchema = z.object({
    appointmentId: uuidSchema,
    queueNumber: z.number().int().positive().optional(),
});

export const addVitalsSchema = z.object({
    appointmentId: uuidSchema,
    vitals: z.object({
        bloodPressureSystolic: z.number().int().min(60).max(250).optional(),
        bloodPressureDiastolic: z.number().int().min(40).max(150).optional(),
        heartRate: z.number().int().min(30).max(220).optional(),
        temperature: z.number().min(90).max(110).optional(), // Fahrenheit
        weight: z.number().min(0.5).max(500).optional(), // kg
        height: z.number().min(30).max(300).optional(), // cm
        oxygenSaturation: z.number().int().min(50).max(100).optional(),
        bloodSugar: z.number().int().min(20).max(600).optional(),
    }),
});

export const completeAppointmentSchema = z.object({
    appointmentId: uuidSchema,
    notes: z.string().max(2000).optional(),
    followUpRecommended: z.boolean().default(false),
    followUpDays: z.number().int().min(1).max(365).optional(),
});

// =============================================================================
// Filter & Search Schemas
// =============================================================================

export const appointmentFilterSchema = z.object({
    status: z.enum(['pending_payment', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show', 'rescheduled']).optional(),
    consultationType: z.enum(['in_person', 'video', 'audio']).optional(),
    doctorId: uuidSchema.optional(),
    patientId: uuidSchema.optional(),
    hospitalId: uuidSchema.optional(),
    startDate: dateStringSchema.optional(),
    endDate: dateStringSchema.optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const availabilityCheckSchema = z.object({
    doctorId: uuidSchema,
    date: dateStringSchema,
    hospitalId: uuidSchema.optional(),
});

export const lockSlotSchema = z.object({
    doctorId: uuidSchema,
    date: dateStringSchema,
    timeSlot: z.string(),
    consultationType: z.enum(['in_person', 'video', 'audio']),
});

// =============================================================================
// Type Exports
// =============================================================================

export type BookAppointmentInput = z.infer<typeof bookAppointmentSchema>;
export type RescheduleAppointmentInput = z.infer<typeof rescheduleAppointmentSchema>;
export type CancelAppointmentInput = z.infer<typeof cancelAppointmentSchema>;
export type CheckInAppointmentInput = z.infer<typeof checkInAppointmentSchema>;
export type AddVitalsInput = z.infer<typeof addVitalsSchema>;
export type CompleteAppointmentInput = z.infer<typeof completeAppointmentSchema>;
export type AppointmentFilterInput = z.infer<typeof appointmentFilterSchema>;
export type AvailabilityCheckInput = z.infer<typeof availabilityCheckSchema>;
export type LockSlotInput = z.infer<typeof lockSlotSchema>;
