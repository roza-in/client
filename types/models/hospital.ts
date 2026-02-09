/**
 * ROZX Healthcare Platform - Hospital Model Types
 */

import type {
    HospitalType,
    VerificationStatus,
    SubscriptionTier,
    HospitalStaffRole
} from '../enums';

// =============================================================================
// Hospital Entity (Full)
// =============================================================================

export interface Hospital {
    id: string;
    ownerId: string;

    // Basic Info
    name: string;
    slug: string;
    type: HospitalType;
    registrationNumber: string | null;

    // Contact
    phone: string;
    email: string | null;
    website: string | null;

    // Address
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark: string | null;
    country: string;
    latitude: number | null;
    longitude: number | null;

    // Details
    about: string | null;
    specialties: string[] | null;
    facilities: string[] | null;
    accreditations: string[] | null;
    yearEstablished: number | null;
    bedCount: number | null;

    // Media
    logoUrl: string | null;
    coverImageUrl: string | null;
    galleryImages: string[] | null;

    // Operating Hours
    workingHours: Record<string, { open: string; close: string; closed?: boolean }> | null;
    is24x7: boolean;
    emergencyServices: boolean;

    // Financial
    platformFeePercent: number;
    minimumPlatformFee: number;
    subscriptionTier: SubscriptionTier;
    subscriptionExpiresAt: string | null;

    // Status
    isActive: boolean;
    verificationStatus: VerificationStatus;
    verifiedAt: string | null;
    verifiedBy: string | null;
    rejectionReason: string | null;

    // Statistics
    rating: number;
    totalRatings: number;
    totalDoctors: number;
    totalAppointments: number;

    // Timestamps
    createdAt: string;
    updatedAt: string;
}

// =============================================================================
// Hospital List Item
// =============================================================================

export interface HospitalListItem {
    id: string;
    name: string;
    slug: string;
    type: HospitalType;
    city: string;
    state: string;
    address: string | null;
    logoUrl: string | null;
    rating: number;
    totalRatings: number;
    totalDoctors: number;
    verificationStatus: VerificationStatus;
    isActive: boolean;
}

// =============================================================================
// Hospital Card (for public display)
// =============================================================================

export interface HospitalCard {
    id: string;
    name: string;
    slug: string;
    type: HospitalType;
    city: string;
    address: string;
    logoUrl: string | null;
    coverImageUrl: string | null;
    rating: number;
    totalRatings: number;
    totalDoctors: number;
    specialties: string[] | null;
    facilities: string[] | null;
    is24x7: boolean;
    emergencyServices: boolean;
}

// =============================================================================
// Hospital with Details
// =============================================================================

export interface HospitalWithDoctors extends Hospital {
    doctors: {
        id: string;
        name: string;
        specialization: string;
        profilePictureUrl: string | null;
        rating: number;
    }[];
}

// =============================================================================
// Hospital Staff
// =============================================================================

export interface HospitalStaff {
    id: string;
    hospitalId: string;
    userId: string;
    staffRole: HospitalStaffRole;
    canBookAppointments: boolean;
    canViewPatientRecords: boolean;
    canManageSchedules: boolean;
    canProcessPayments: boolean;
    canManageInventory: boolean;
    isActive: boolean;
    joinedAt: string;
    createdAt: string;
    updatedAt: string;

    // Populated fields
    user?: {
        id: string;
        name: string;
        email: string | null;
        phone: string;
        profilePictureUrl: string | null;
    };
}

// =============================================================================
// Hospital Settlement
// =============================================================================

export interface HospitalSettlement {
    id: string;
    hospitalId: string;
    settlementPeriodStart: string;
    settlementPeriodEnd: string;
    totalAppointments: number;
    totalConsultationFees: number;
    totalPlatformFees: number;
    totalGatewayFees: number;
    totalRefunds: number;
    netSettlement: number;
    bankReference: string | null;
    transferId: string | null;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    invoiceNumber: string | null;
    invoiceUrl: string | null;
    calculatedAt: string;
    initiatedAt: string | null;
    completedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

// =============================================================================
// Hospital Announcement
// =============================================================================

export interface HospitalAnnouncement {
    id: string;
    hospitalId: string;
    title: string;
    content: string;
    type: 'info' | 'warning' | 'success' | 'error';
    isActive: boolean;
    startDate: string | null;
    endDate: string | null;
    createdAt: string;
    updatedAt: string;
}

// =============================================================================
// Hospital Stats
// =============================================================================

export interface HospitalStats {
    totalDoctors: number;
    activeDoctors: number;
    totalAppointments: number;
    todayAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    totalRevenue: number;
    monthlyRevenue: number;
    totalPatients: number;
    averageRating: number;
    totalReviews: number;
    pendingSettlement: number;
}

// =============================================================================
// Input Types
// =============================================================================

export interface CreateHospitalInput {
    name: string;
    type?: HospitalType;
    registrationNumber?: string;
    phone: string;
    email?: string;
    website?: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    about?: string;
    specialties?: string[];
    facilities?: string[];
    yearEstablished?: number;
    bedCount?: number;
    is24x7?: boolean;
    emergencyServices?: boolean;
}

export interface UpdateHospitalInput extends Partial<CreateHospitalInput> {
    logoUrl?: string;
    coverImageUrl?: string;
    galleryImages?: string[];
    accreditations?: string[];
    workingHours?: Record<string, { open: string; close: string; closed?: boolean }>;
}

export interface AddStaffInput {
    userId?: string;
    email?: string;
    phone?: string;
    name?: string;
    staffRole: HospitalStaffRole;
    canBookAppointments?: boolean;
    canViewPatientRecords?: boolean;
    canManageSchedules?: boolean;
    canProcessPayments?: boolean;
    canManageInventory?: boolean;
}

// =============================================================================
// Filter Types
// =============================================================================

export interface HospitalFilters {
    type?: HospitalType | HospitalType[];
    city?: string;
    state?: string;
    specialties?: string[];
    facilities?: string[];
    is24x7?: boolean;
    emergencyServices?: boolean;
    verificationStatus?: VerificationStatus;
    minRating?: number;
    search?: string;
    nearbyLat?: number;
    nearbyLng?: number;
    radiusKm?: number;
    page?: number;
    limit?: number;
    sortBy?: 'rating' | 'name' | 'distance';
    sortOrder?: 'asc' | 'desc';
}
