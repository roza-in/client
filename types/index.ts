/**
 * ROZX Healthcare Platform - Types Index
 * Centralized exports for all types used in the application
 * 
 * This is the main entry point for importing types.
 * Import from '@/types' for clean, organized type imports.
 * 
 * @example
 * import type { User, Appointment, PaymentStatus } from '@/types';
 */

// =============================================================================
// Enums - All enum types and label constants
// =============================================================================
export * from './enums';

// =============================================================================
// API Types - Request/Response patterns, pagination, auth
// =============================================================================
export * from './api';

// =============================================================================
// Model Types - All entity types organized by domain
// =============================================================================
export * from './models';

// =============================================================================
// Re-export Common Types (for convenience)
// =============================================================================

// User-related
export type {
    User,
    UserListItem,
    FamilyMember,
    PatientVitals,
    UserSession,
    LoginHistory,
    UserFilters,
    CreateUserInput,
    UpdateUserInput,
} from './models/user';

// Appointment-related
export type {
    Appointment,
    AppointmentListItem,
    AppointmentWithDetails,
    AppointmentVitals,
    Consultation,
    TimeSlot,
    DayAvailability,
    Rating,
    AppointmentWaitlist,
    AppointmentFilters,
    AppointmentStats,
    BookAppointmentInput,
    RescheduleAppointmentInput,
    CancelAppointmentInput,
    CreateRatingInput,
} from './models/appointment';

// Doctor-related
export type {
    Doctor,
    DoctorListItem,
    DoctorCard,
    DoctorWithHospital,
    Specialization,
    DoctorSchedule,
    ScheduleOverride,
    DoctorStats,
    DoctorFilters,
    CreateDoctorInput,
    UpdateDoctorInput,
} from './models/doctor';

// Hospital-related
export type {
    Hospital,
    HospitalListItem,
    HospitalCard,
    HospitalWithDoctors,
    HospitalStaff,
    HospitalSettlement,
    HospitalAnnouncement,
    HospitalStats,
    HospitalFilters,
    CreateHospitalInput,
    UpdateHospitalInput,
} from './models/hospital';

// Prescription-related
export type {
    Prescription,
    PrescriptionListItem,
    PrescriptionWithDetails,
    PrescriptionMedication,
    LabTest,
    HealthDocument,
    MedicationReminder,
    MedicationLog,
    PrescriptionFilters,
    HealthDocumentFilters,
    CreatePrescriptionInput,
    UpdatePrescriptionInput,
} from './models/prescription';

// Payment-related
export type {
    Payment,
    PaymentListItem,
    PaymentWithDetails,
    Refund,
    PaymentOrder,
    PaymentVerification,
    PaymentVerificationResult,
    Invoice,
    PatientCredit,
    CreditTransaction,
    PaymentStats,
    PaymentFilters,
    RefundFilters,
    CreatePaymentOrderInput,
    RequestRefundInput,
} from './models/payment';
