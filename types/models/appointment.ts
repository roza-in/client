/**
 * ROZX Healthcare Platform - Appointment Model Types
 */

import type {
    AppointmentStatus,
    ConsultationType,
    ConsultationStatus,
    BookingSource,
    Gender
} from '../enums';
import type { DoctorProfile, HospitalProfile, PatientProfile } from '../api';

// =============================================================================
// Appointment Entity (Full)
// =============================================================================

export interface Appointment {
    id: string;
    bookingId: string;
    patientId: string;
    doctorId: string;
    hospitalId: string;
    familyMemberId: string | null;

    // Scheduling
    appointmentDate: string;
    startTime: string;
    endTime: string;
    consultationType: ConsultationType;
    status: AppointmentStatus;

    // Patient Info (snapshot at booking)
    patientName: string;
    patientPhone: string;
    patientAge: number | null;
    patientGender: Gender | null;

    // Clinical
    chiefComplaint: string | null;
    symptoms: string[] | null;
    vitals: AppointmentVitals | null;
    consultationNotes: string | null;
    diagnosis: string | null;
    icdCodes: string[] | null;

    // Follow-up
    isFollowup: boolean;
    parentAppointmentId: string | null;
    followupDate: string | null;

    // Booking Info
    bookingSource: BookingSource;
    bookedBy: string | null;
    tokenNumber: number | null;
    estimatedWaitTime: number | null;

    // Actual Times
    actualStartTime: string | null;
    actualEndTime: string | null;

    // Video Consultation
    videoRoomId: string | null;
    videoStartedAt: string | null;
    videoEndedAt: string | null;
    videoDurationMinutes: number | null;

    // Cancellation
    cancelledAt: string | null;
    cancelledBy: string | null;
    cancellationReason: string | null;
    noShowMarkedAt: string | null;

    // Notifications
    reminderSentCount: number;

    // Fees
    consultationFee: number;
    platformFee: number;
    totalAmount: number;

    // Timestamps
    createdAt: string;
    updatedAt: string;
    completedAt: string | null;
}

// =============================================================================
// Appointment Vitals
// =============================================================================

export interface AppointmentVitals {
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    heartRate?: number;
    temperature?: number;
    weight?: number;
    height?: number;
    spo2?: number;
    respiratoryRate?: number;
}

// =============================================================================
// Appointment List Item
// =============================================================================

export interface AppointmentListItem {
    id: string;
    bookingId: string;
    appointmentDate: string;
    startTime: string;
    endTime: string;
    consultationType: ConsultationType;
    status: AppointmentStatus;
    patientName: string | null;
    patientAvatar?: string | null;
    doctorName: string | null;
    doctorAvatar?: string | null;
    doctorSpecialization: string | null;
    hospitalName: string | null;
    hospitalAddress?: string | null;
    hospitalCity?: string | null;
    hospitalState?: string | null;
    totalAmount: number;
    paymentStatus: string;
    isFollowup: boolean;
    symptoms?: string[] | null;
}

// =============================================================================
// Appointment with Full Details
// =============================================================================

export interface AppointmentWithDetails extends Appointment {
    doctors: any;
    patient: PatientProfile;
    doctor: DoctorListItem;
    hospital: HospitalListItem;
    prescription?: Prescription | null;
    payment?: PaymentSummary | null;
    consultation?: Consultation | null;
    rating?: Rating | null;
}

// Import needed for reference
import type { Prescription } from './prescription';
import type { DoctorListItem } from './doctor';
import type { HospitalListItem } from './hospital';

// =============================================================================
// Consultation (Video/Audio Call)
// =============================================================================

export interface Consultation {
    id: string;
    appointmentId: string;
    patientId: string;
    doctorId: string;
    roomId: string;
    roomToken: string | null;
    status: ConsultationStatus;
    patientJoinedAt: string | null;
    doctorJoinedAt: string | null;
    startedAt: string | null;
    endedAt: string | null;
    doctorNotes: string | null;
    vitals: any | null;
    durationMinutes: number | null;
    recordingUrl: string | null;
    chatLog: ChatMessage[] | null;
    technicalIssues: string[] | null;
    createdAt: string;
}

export interface ChatMessage {
    sender: 'patient' | 'doctor';
    message: string;
    timestamp: string;
    type: 'text' | 'file' | 'image';
    fileUrl?: string;
}

// =============================================================================
// Payment Summary (embedded in appointment details)
// =============================================================================

export interface PaymentSummary {
    id: string;
    consultationFee: number;
    platformFee: number;
    gatewayFee: number;
    gstAmount: number;
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    status: string;
    paidAt: string | null;
}

// =============================================================================
// Rating
// =============================================================================

export interface Rating {
    id: string;
    appointmentId: string;
    patientId: string;
    doctorId: string;
    hospitalId: string;
    overallRating: number;
    doctorRating: number;
    hospitalRating: number | null;
    waitTimeRating: number | null;
    communicationRating: number | null;
    review: string | null;
    tags: string[] | null;
    isAnonymous: boolean;
    doctorResponse: string | null;
    doctorRespondedAt: string | null;
    isVisible: boolean;
    helpfulCount: number;
    createdAt: string;
}

// =============================================================================
// Time Slot Types
// =============================================================================

export interface TimeSlot {
    time: string;
    endTime: string;
    available: boolean;
    isLocked?: boolean;
    lockedUntil?: string;
}

export interface DayAvailability {
    date: string;
    dayOfWeek: string;
    isAvailable: boolean;
    slots: TimeSlot[];
}

// =============================================================================
// Waitlist
// =============================================================================

export interface AppointmentWaitlist {
    id: string;
    patientId: string;
    doctorId: string;
    preferredDate: string;
    preferredTimeStart: string | null;
    preferredTimeEnd: string | null;
    consultationType: ConsultationType;
    isNotified: boolean;
    notifiedAt: string | null;
    expiresAt: string;
    createdAt: string;
}

// =============================================================================
// Input Types
// =============================================================================

export interface BookAppointmentInput {
    doctorId: string;
    hospitalId: string;
    appointmentDate: string;
    startTime: string;
    consultationType: ConsultationType;
    familyMemberId?: string;
    patientName: string;
    patientPhone: string;
    patientAge?: number;
    patientGender?: Gender;
    chiefComplaint?: string;
    symptoms?: string[];
}

export interface RescheduleAppointmentInput {
    newDate: string;
    newStartTime: string;
    reason?: string;
}

export interface CancelAppointmentInput {
    reason: string;
}

export interface CreateRatingInput {
    overallRating: number;
    doctorRating: number;
    hospitalRating?: number;
    waitTimeRating?: number;
    communicationRating?: number;
    review?: string;
    tags?: string[];
    isAnonymous?: boolean;
}

export interface UpdateVitalsInput {
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    heartRate?: number;
    temperature?: number;
    weight?: number;
    height?: number;
    spo2?: number;
    respiratoryRate?: number;
}

export interface JoinWaitlistInput {
    doctorId: string;
    preferredDate: string;
    preferredTimeStart?: string;
    preferredTimeEnd?: string;
    consultationType: ConsultationType;
}

// =============================================================================
// Filter Types
// =============================================================================

export interface AppointmentFilters {
    patientId?: string;
    doctorId?: string;
    hospitalId?: string;
    status?: AppointmentStatus | AppointmentStatus[];
    consultationType?: ConsultationType;
    startDate?: string;
    endDate?: string;
    paymentStatus?: string;
    isFollowup?: boolean;
    page?: number;
    limit?: number;
    sortBy?: 'appointmentDate' | 'createdAt' | 'status';
    sortOrder?: 'asc' | 'desc';
}

// =============================================================================
// Stats Types
// =============================================================================

export interface AppointmentStats {
    total: number;
    completed: number;
    cancelled: number;
    noShow: number;
    upcoming: number;
    todayCount: number;
    completionRate: number;
    noShowRate: number;
    averageWaitTime: number;
    averageConsultationTime: number;
}
