/**
 * Rozx Healthcare Platform — Waitlist Model Types
 */

import type { WaitlistStatus } from '../enums';

// =============================================================================
// Waitlist Entry
// =============================================================================

export interface WaitlistEntry {
    id: string;
    patientId: string;
    doctorId: string;
    hospitalId: string | null;
    preferredDate: string;
    preferredTimeSlot: string | null;
    consultationType: string;
    reason: string | null;
    status: WaitlistStatus;
    notifiedAt: string | null;
    bookedAppointmentId: string | null;
    expiresAt: string | null;
    createdAt: string;
    updatedAt: string;
}

// =============================================================================
// Waitlist List Item
// =============================================================================

export interface WaitlistListItem {
    id: string;
    patientName: string;
    doctorName: string;
    preferredDate: string;
    consultationType: string;
    status: WaitlistStatus;
    createdAt: string;
}

// =============================================================================
// Input Types
// =============================================================================

export interface JoinWaitlistInput {
    doctorId: string;
    hospitalId?: string;
    preferredDate: string;
    preferredTimeSlot?: string;
    consultationType: string;
    reason?: string;
}
