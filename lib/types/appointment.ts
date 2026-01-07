/**
 * ROZX Healthcare Platform - Appointment Types
 */

import type {
  AppointmentStatus,
  ConsultationType,
  ConsultationStatus,
  BookingSource,
  Gender,
} from './enums';

// ============================================================================
// Appointment Types
// ============================================================================

export interface Appointment {
  id: string;
  bookingId: string;
  patientId: string;
  doctorId: string;
  hospitalId: string;
  familyMemberId: string | null;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  consultationType: ConsultationType;
  status: AppointmentStatus;
  patientName: string;
  patientPhone: string;
  patientAge: number | null;
  patientGender: Gender | null;
  chiefComplaint: string | null;
  symptoms: string[] | null;
  vitals: AppointmentVitals | null;
  consultationNotes: string | null;
  diagnosis: string | null;
  icdCodes: string[] | null;
  isFollowup: boolean;
  parentAppointmentId: string | null;
  followupDate: string | null;
  bookingSource: BookingSource;
  bookedBy: string | null;
  tokenNumber: number | null;
  estimatedWaitTime: number | null;
  actualStartTime: string | null;
  actualEndTime: string | null;
  videoRoomId: string | null;
  videoStartedAt: string | null;
  videoEndedAt: string | null;
  videoDurationMinutes: number | null;
  cancelledAt: string | null;
  cancelledBy: string | null;
  cancellationReason: string | null;
  noShowMarkedAt: string | null;
  reminderSentCount: number;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

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

// ============================================================================
// Appointment List & Card Types
// ============================================================================

export interface AppointmentListItem {
  id: string;
  bookingId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  consultationType: ConsultationType;
  status: AppointmentStatus;
  patientName: string;
  doctorName: string;
  doctorSpecialization: string;
  hospitalName: string;
  totalAmount: number;
  paymentStatus: string;
  isFollowup: boolean;
}

export interface AppointmentWithDetails extends Appointment {
  patient: {
    id: string;
    fullName: string;
    phone: string;
    email: string | null;
    profilePictureUrl: string | null;
    gender: Gender | null;
    dateOfBirth: string | null;
  };
  doctor: {
    id: string;
    fullName: string;
    specialization: string;
    qualification: string;
    profilePictureUrl: string | null;
    phone: string;
  };
  hospital: {
    id: string;
    name: string;
    slug: string;
    city: string;
    addressLine1: string;
    phone: string;
  };
  prescription?: Prescription | null;
  payment?: PaymentSummary | null;
  consultation?: Consultation | null;
  rating?: Rating | null;
}

export interface AppointmentCard {
  id: string;
  appointmentDate: string;
  startTime: string;
  status: AppointmentStatus;
  consultationType: ConsultationType;
  doctorName: string;
  doctorSpecialization: string;
  hospitalName: string;
}

// ============================================================================
// Prescription Types
// ============================================================================

export interface Prescription {
  id: string;
  appointmentId: string;
  doctorId: string;
  prescriptionNumber: string;
  diagnosis: string;
  icdCodes: string[] | null;
  medications: PrescriptionMedication[];
  labTests: LabTest[];
  lifestyleAdvice: string | null;
  dietaryAdvice: string | null;
  followUpInstructions: string | null;
  followUpAfterDays: number | null;
  followUpDate: string | null;
  additionalNotes: string | null;
  pdfUrl: string | null;
  signedAt: string;
  createdAt: string;
}

export interface PrescriptionMedication {
  name: string;
  genericName?: string;
  dosage: string;
  frequency: string;
  duration: string;
  timing: string;
  instructions: string | null;
  beforeFood: boolean;
  quantity?: number;
}

export interface LabTest {
  name: string;
  instructions: string | null;
  isUrgent: boolean;
}

// ============================================================================
// Payment Summary Types
// ============================================================================

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

// ============================================================================
// Consultation Types (Video/Audio Call)
// ============================================================================

export interface Consultation {
  id: string;
  appointmentId: string;
  roomId: string;
  roomToken: string | null;
  status: ConsultationStatus;
  patientJoinedAt: string | null;
  doctorJoinedAt: string | null;
  startedAt: string | null;
  endedAt: string | null;
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

// ============================================================================
// Rating Types
// ============================================================================

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

// ============================================================================
// Appointment Filters & Input Types
// ============================================================================

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

export interface CreatePrescriptionInput {
  diagnosis: string;
  icdCodes?: string[];
  medications: PrescriptionMedication[];
  labTests?: LabTest[];
  lifestyleAdvice?: string;
  dietaryAdvice?: string;
  followUpInstructions?: string;
  followUpAfterDays?: number;
  additionalNotes?: string;
}

export interface UpdateAppointmentVitalsInput {
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  spo2?: number;
  respiratoryRate?: number;
}

// ============================================================================
// Appointment Stats Types
// ============================================================================

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

// ============================================================================
// Waitlist Types
// ============================================================================

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

export interface JoinWaitlistInput {
  doctorId: string;
  preferredDate: string;
  preferredTimeStart?: string;
  preferredTimeEnd?: string;
  consultationType: ConsultationType;
}
