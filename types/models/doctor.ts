/**
 * Rozx Healthcare Platform - Doctor Model Types
 */

import type {
    VerificationStatus,
    ConsultationType,
    Gender,
    DayOfWeek
} from '../enums';

// =============================================================================
// Doctor Entity (Full)
// =============================================================================

export interface Doctor {
    id: string;
    userId: string;
    hospitalId: string;

    // Professional Info
    name: string;
    specializationId: string;
    specialization: string;
    qualification: string;
    registrationNumber: string;
    registrationCouncil: string;
    experienceYears: number;
    bio: string | null;

    // Consultation Settings
    consultationTypes: ConsultationType[];
    consultationFeeOnline: number;
    consultationFeeInPerson: number;
    consultationFeeWalkIn: number;
    slotDurationMinutes: number;
    followUpFee: number | null;
    followUpValidityDays: number | null;

    // Availability
    isAvailableForOnline: boolean;
    isAvailableForInPerson: boolean;
    maxPatientsPerSlot: number;
    bufferTimeMinutes: number;
    advanceBookingDays: number;

    // Profile
    profilePictureUrl: string | null;
    signatureUrl: string | null;
    gender: Gender | null;
    languages: string[] | null;

    // Status
    isActive: boolean;
    isAcceptingAppointments: boolean;
    verificationStatus: VerificationStatus;
    verifiedAt: string | null;
    verifiedBy: string | null;
    rejectionReason: string | null;

    // Statistics
    rating: number;
    totalRatings: number;
    totalConsultations: number;

    // Timestamps
    createdAt: string;
    updatedAt: string;
}

// =============================================================================
// Doctor List Item
// =============================================================================

export interface DoctorListItem {
    id: string;
    userId: string;
    name: string;
    specialization: string;
    qualification: string;
    experienceYears: number;
    profilePictureUrl: string | null;
    consultationFeeOnline: number;
    consultationFeeInPerson: number;
    rating: number;
    totalRatings: number;
    isAvailableForOnline: boolean;
    isAvailableForInPerson: boolean;
    isAcceptingAppointments: boolean;
    hospitalName?: string;
    hospitalCity?: string;
    nextAvailableSlot?: string | null;
}

// =============================================================================
// Doctor Card (for public display)
// =============================================================================

export interface DoctorCard {
    id: string;
    name: string;
    specialization: string;
    qualification: string;
    experienceYears: number;
    profilePictureUrl: string | null;
    rating: number;
    totalRatings: number;
    consultationFee: number;
    hospital: {
        id: string;
        name: string;
        city: string;
    };
    availableToday: boolean;
    nextAvailableSlot: string | null;
}

// =============================================================================
// Doctor with Hospital Details
// =============================================================================

export interface DoctorWithHospital extends Doctor {
    hospital: {
        id: string;
        name: string;
        slug: string;
        city: string;
        state: string;
        pincode: string;
        address: string;
        landmark: string | null;
        country: string;
        phone: string;
        logoUrl: string | null;
    };
    specializationDetails: {
        id: string;
        name: string;
        description: string | null;
        iconUrl: string | null;
    };
}

// =============================================================================
// Specialization
// =============================================================================

export interface Specialization {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    iconUrl: string | null;
    isActive: boolean;
    doctorCount?: number;
    createdAt: string;
}

// =============================================================================
// Doctor Schedule
// =============================================================================

export interface DoctorSchedule {
    id: string;
    doctorId: string;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    slotDurationMinutes: number;
    maxAppointments: number | null;
    consultationType: ConsultationType;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ScheduleOverride {
    id: string;
    doctorId: string;
    date: string;
    isAvailable: boolean;
    startTime: string | null;
    endTime: string | null;
    reason: string | null;
    createdAt: string;
    updatedAt: string;
}

// =============================================================================
// Doctor Stats
// =============================================================================

export interface DoctorStats {
    totalAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    totalEarnings: number;
    averageRating: number;
    totalReviews: number;
    todayAppointments: number;
    upcomingAppointments: number;
    patientsServed: number;
    completionRate: number;
}

// =============================================================================
// Input Types
// =============================================================================

export interface CreateDoctorInput {
    userId?: string;
    hospitalId: string;
    name: string;
    specializationId: string;
    qualification: string;
    registrationNumber: string;
    registrationCouncil: string;
    experienceYears: number;
    bio?: string;
    consultationFeeOnline: number;
    consultationFeeInPerson: number;
    consultationDurationMinutes?: number;
    gender?: Gender;
    languages?: string[];
    profilePictureUrl?: string;
}

export interface UpdateDoctorInput {
    name?: string;
    bio?: string;
    consultationFeeOnline?: number;
    consultationFeeInPerson?: number;
    consultationDurationMinutes?: number;
    followupFee?: number;
    followupValidDays?: number;
    isAvailableForOnline?: boolean;
    isAvailableForInPerson?: boolean;
    isAcceptingAppointments?: boolean;
    maxDailyAppointments?: number;
    bufferTimeMinutes?: number;
    advanceBookingDays?: number;
    languages?: string[];
    profilePictureUrl?: string;
    signatureUrl?: string;
}

export interface CreateScheduleInput {
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    slotDurationMinutes?: number;
    maxAppointments?: number;
    consultationType: ConsultationType;
}

export interface CreateOverrideInput {
    date: string;
    isAvailable: boolean;
    startTime?: string;
    endTime?: string;
    reason?: string;
}

// =============================================================================
// Filter Types
// =============================================================================

export interface DoctorFilters {
    hospitalId?: string;
    specializationId?: string;
    specialization?: string;
    city?: string;
    minExperience?: number;
    maxFee?: number;
    consultationType?: ConsultationType;
    isAvailableToday?: boolean;
    isAcceptingAppointments?: boolean;
    verificationStatus?: VerificationStatus;
    rating?: number;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: 'rating' | 'experience' | 'fee' | 'name';
    sortOrder?: 'asc' | 'desc';
}
