/**
 * Rozx Healthcare Platform — Rating Model Types
 */

// =============================================================================
// Rating Entity
// =============================================================================

export interface Rating {
    id: string;
    appointmentId: string;
    patientId: string;
    doctorId: string;
    hospitalId: string | null;
    overallRating: number;
    doctorRating: number;
    hospitalRating: number | null;
    waitTimeRating: number | null;
    review: string | null;
    isAnonymous: boolean;
    isVerified: boolean;
    status: RatingStatus;
    moderatedBy: string | null;
    moderatedAt: string | null;
    moderationNotes: string | null;
    createdAt: string;
    updatedAt: string;
}

export type RatingStatus = 'pending' | 'approved' | 'rejected' | 'flagged';

// =============================================================================
// Rating List Item
// =============================================================================

export interface RatingListItem {
    id: string;
    patientName: string;
    doctorName: string;
    overallRating: number;
    review: string | null;
    status: RatingStatus;
    isAnonymous: boolean;
    createdAt: string;
}

// =============================================================================
// Rating with Details
// =============================================================================

export interface RatingWithDetails extends Rating {
    patient: {
        id: string;
        name: string;
    };
    doctor: {
        id: string;
        name: string;
        specialization: string | null;
    };
    hospital?: {
        id: string;
        name: string;
    } | null;
}

// =============================================================================
// Doctor Rating Stats
// =============================================================================

export interface DoctorRatingStats {
    averageRating: number;
    totalRatings: number;
    ratingDistribution: Record<number, number>;
    averageDoctorRating: number;
    averageHospitalRating: number | null;
    averageWaitTimeRating: number | null;
}

// =============================================================================
// Input Types
// =============================================================================

export interface CreateRatingInput {
    appointmentId: string;
    overallRating: number;
    doctorRating: number;
    hospitalRating?: number;
    waitTimeRating?: number;
    review?: string;
    isAnonymous?: boolean;
}

export interface ModerateRatingInput {
    status: RatingStatus;
    moderationNotes?: string;
}

// =============================================================================
// Filter Types
// =============================================================================

export interface RatingFilters {
    [key: string]: string | number | boolean | string[] | null | undefined;
    doctorId?: string;
    hospitalId?: string;
    patientId?: string;
    status?: RatingStatus | RatingStatus[];
    minRating?: number;
    maxRating?: number;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'overallRating';
    sortOrder?: 'asc' | 'desc';
}
