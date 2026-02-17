/**
 * Rozx Healthcare Platform - Model Types Index
 * Centralized exports for all model types
 */

// User & Auth
export * from './user';

// Appointments
export * from './appointment';

// Doctors
export * from './doctor';

// Hospitals
export * from './hospital';

// Prescriptions & Health Records
export * from './prescription';

// Payments
export * from './payment';

// Pharmacy
export * from './pharmacy';

// Support Tickets
export * from './support';

// Settlements & Payouts
export * from './settlement';

// Audit Logs
export * from './audit';

// Ratings (explicit — Rating, CreateRatingInput already in ./appointment)
export type {
    RatingListItem,
    RatingWithDetails,
    DoctorRatingStats,
    RatingStatus,
    ModerateRatingInput,
    RatingFilters,
} from './rating';

// Health Records (explicit — HealthDocument, MedicationReminder in ./prescription, CreateFamilyMemberInput in ./user)
export type {
    VitalRecord,
    VitalTrend,
    MedicationRecord,
    AllergyRecord,
    HealthFamilyMember,
    HealthSummary,
    CreateVitalInput,
    CreateMedicationInput,
    CreateAllergyInput,
    CreateHealthDocumentInput,
} from './health-record';

// Announcements
export * from './announcement';

// Waitlist (explicit — JoinWaitlistInput already in ./appointment)
export type {
    WaitlistEntry,
    WaitlistListItem,
} from './waitlist';
