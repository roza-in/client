/**
 * ROZX Healthcare Platform - API Types
 * API response and request types
 */

// =============================================================================
// Base API Response Types
// =============================================================================

export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    error?: IApiError;
    meta?: PaginationMeta;
    timestamp: string;
}

export interface IApiError {
    code: string;
    message: string;
    details?: Record<string, string[]>;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}

// =============================================================================
// Request Types
// =============================================================================

export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface DateRangeParams {
    startDate?: string;
    endDate?: string;
}

export interface SearchParams {
    query?: string;
    search?: string;
}

// =============================================================================
// Auth Response Types
// =============================================================================

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    expiresAt: number;
}

export interface AuthResponse<T = UserProfile> {
    user: T;
    tokens: AuthTokens;
    isNewUser: boolean;
}

export interface OTPSendResponse {
    success: boolean;
    message: string;
    expiresAt?: string;
    attemptsRemaining?: number;
}

// =============================================================================
// User Profile (Normalized for frontend)
// =============================================================================

import type { UserRole, Gender, BloodGroup } from './enums';

export interface UserProfile {
    id: string;
    email: string | null;
    phone: string | null;
    phoneVerified: boolean;
    emailVerified: boolean;
    name: string | null;
    role: UserRole;
    gender?: Gender | null;
    dateOfBirth?: string | null;
    bloodGroup?: BloodGroup | null;
    profilePictureUrl: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    pincode?: string | null;
    landmark?: string | null;
    country?: string | null;
    doctor?: DoctorProfile | null;
    hospital?: HospitalProfile | null;
}

// =============================================================================
// Lightweight Profile Types (for nested references)
// =============================================================================

export interface DoctorProfile {
    id: string;
    name: string;
    specialization: string;
    qualification: string;
    experienceYears?: number;
    consultationFee?: number;
    profilePictureUrl?: string | null;
    verification_status?: string;
    is_active?: boolean;
    isActive?: boolean; // Frontend normalized property
}

export interface HospitalProfile {
    id: string;
    name: string;
    slug?: string;
    city: string;
    state?: string;
    logoUrl?: string | null;
    verification_status?: string;
    is_active?: boolean;
    isActive?: boolean; // Frontend normalized property
}

export interface PatientProfile {
    id: string;
    name: string;
    phone: string;
    email?: string | null;
    profilePictureUrl?: string | null;
    gender?: Gender | null;
    dateOfBirth?: string | null;
    age?: number;
}

// =============================================================================
// List Item Types (for tables and cards)
// =============================================================================

export interface ListItem {
    id: string;
    createdAt: string;
    updatedAt?: string;
}

// =============================================================================
// Filter Input Types
// =============================================================================

export interface BaseFilters extends PaginationParams, SearchParams {
    status?: string | string[];
}

// =============================================================================
// Stats & Analytics Types
// =============================================================================

export interface StatValue {
    value: number;
    change?: number;
    changeType?: 'increase' | 'decrease' | 'neutral';
    period?: string;
}

export interface ChartDataPoint {
    label: string;
    value: number;
    date?: string;
}

export interface TimeSeriesData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        color?: string;
    }[];
}

// =============================================================================
// File Upload Types
// =============================================================================

export interface UploadResponse {
    url: string;
    key: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
}

export interface UploadProgress {
    loaded: number;
    total: number;
    percentage: number;
}
