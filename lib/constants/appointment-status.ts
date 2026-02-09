/**
 * ROZX Healthcare Platform - Appointment Status Constants
 */

// =============================================================================
// Status Enum (Must match database appointment_status enum exactly)
// =============================================================================

export const AppointmentStatus = {
    PENDING_PAYMENT: 'pending_payment',
    CONFIRMED: 'confirmed',
    CHECKED_IN: 'checked_in',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    NO_SHOW: 'no_show',
    RESCHEDULED: 'rescheduled',
} as const;

export type AppointmentStatusType = (typeof AppointmentStatus)[keyof typeof AppointmentStatus];

// =============================================================================
// Status Labels
// =============================================================================

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatusType, string> = {
    pending_payment: 'Payment Pending',
    confirmed: 'Confirmed',
    checked_in: 'Checked In',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    no_show: 'No Show',
    rescheduled: 'Rescheduled',
};

// =============================================================================
// Status Colors
// =============================================================================

export const APPOINTMENT_STATUS_COLORS: Record<AppointmentStatusType, {
    bg: string;
    text: string;
    border: string;
}> = {
    pending_payment: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    confirmed: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    checked_in: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
    in_progress: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    cancelled: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    no_show: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
    rescheduled: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
};

// =============================================================================
// Consultation Types
// =============================================================================

export const ConsultationType = {
    IN_PERSON: 'in_person',
    VIDEO: 'video',
    AUDIO: 'audio',
} as const;

export type ConsultationTypeValue = (typeof ConsultationType)[keyof typeof ConsultationType];

export const CONSULTATION_TYPE_LABELS: Record<ConsultationTypeValue, string> = {
    in_person: 'In-Person',
    video: 'Video Call',
    audio: 'Audio Call',
};

export const CONSULTATION_TYPE_ICONS: Record<ConsultationTypeValue, string> = {
    in_person: 'Building2',
    video: 'Video',
    audio: 'Phone',
};

// =============================================================================
// Utility Functions
// =============================================================================

export function getAppointmentStatusLabel(status: string): string {
    return APPOINTMENT_STATUS_LABELS[status as AppointmentStatusType] || status;
}

export function getAppointmentStatusColors(status: string): { bg: string; text: string; border: string } {
    return APPOINTMENT_STATUS_COLORS[status as AppointmentStatusType] || {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
    };
}

export function isActiveAppointment(status: string): boolean {
    return ['confirmed', 'checked_in', 'in_progress'].includes(status);
}

export function isCompletedAppointment(status: string): boolean {
    return ['completed', 'cancelled', 'no_show'].includes(status);
}

export function canCancelAppointment(status: string): boolean {
    return ['pending_payment', 'confirmed'].includes(status);
}

export function canRescheduleAppointment(status: string): boolean {
    return ['pending_payment', 'confirmed'].includes(status);
}

export default AppointmentStatus;
