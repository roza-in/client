/**
 * Rozx Healthcare Platform - User Model Types
 */

import type {
    UserRole,
    Gender,
    BloodGroup,
    RelationshipType,
    UserStatus
} from '../enums';

// =============================================================================
// User Entity (Full)
// =============================================================================

export interface User {
    id: string;
    email: string | null;
    phone: string | null;
    phoneVerified: boolean;
    emailVerified: boolean;
    name: string | null;
    role: UserRole;
    gender: Gender | null;
    dateOfBirth: string | null;
    bloodGroup: BloodGroup | null;
    profilePictureUrl: string | null;

    // Address
    address: string | null;
    city: string | null;
    state: string | null;
    pincode: string | null;
    landmark: string | null;
    country: string | null;

    // Emergency Contact
    emergencyContactName: string | null;
    emergencyContactPhone: string | null;

    // Health Info (for patients)
    allergies: string | null;
    chronicConditions: string | null;
    currentMedications: string | null;
    medicalHistory: string | null;
    heightCm: number | null;
    weightKg: number | null;

    // Account Status
    isActive: boolean;
    isBlocked: boolean;
    blockedReason: string | null;
    blockedAt: string | null;
    blockedBy: string | null;

    // Login Info
    lastLoginAt: string | null;
    loginCount: number;
    failedLoginAttempts: number | null;
    lockedUntil: string | null;

    // OAuth
    googleId: string | null;

    // Timestamps
    createdAt: string;
    updatedAt: string;
}

// =============================================================================
// User List Item (for tables)
// =============================================================================

export interface UserListItem {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    role: UserRole;
    profilePictureUrl: string | null;
    isActive: boolean;
    isBlocked: boolean;
    lastLoginAt: string | null;
    createdAt: string;
}

// =============================================================================
// Family Member
// =============================================================================

export interface FamilyMember {
    id: string;
    userId: string;
    name: string;
    relationship: RelationshipType;
    gender: Gender | null;
    dateOfBirth: string | null;
    bloodGroup: BloodGroup | null;
    phone: string | null;
    allergies: string | null;
    chronicConditions: string | null;
    currentMedications: string | null;
    profilePictureUrl: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface FamilyMemberWithHealth extends FamilyMember {
    latestVitals?: PatientVitals | null;
    activeAllergies?: string[];
    activeMedications?: string[];
}

// =============================================================================
// Patient Vitals
// =============================================================================

export interface PatientVitals {
    id: string;
    userId: string;
    familyMemberId: string | null;
    bloodPressureSystolic: number | null;
    bloodPressureDiastolic: number | null;
    heartRate: number | null;
    temperature: number | null;
    weight: number | null;
    height: number | null;
    spo2: number | null;
    respiratoryRate: number | null;
    bloodSugar: number | null;
    notes: string | null;
    recordedAt: string;
    recordedBy: string | null;
    createdAt: string;
}

// =============================================================================
// User Session
// =============================================================================

export interface UserSession {
    id: string;
    userId: string;
    deviceInfo: string | null;
    ipAddress: string | null;
    userAgent: string | null;
    isActive: boolean;
    lastActivityAt: string;
    expiresAt: string;
    createdAt: string;
}

// =============================================================================
// Login History
// =============================================================================

export interface LoginHistory {
    id: string;
    userId: string;
    loginMethod: string;
    ipAddress: string | null;
    userAgent: string | null;
    deviceInfo: string | null;
    location: string | null;
    status: 'success' | 'failed';
    failureReason: string | null;
    createdAt: string;
}

// =============================================================================
// Input Types
// =============================================================================

export interface CreateUserInput {
    email?: string;
    phone: string;
    name: string;
    password?: string;
    role?: UserRole;
}

export interface UpdateUserInput {
    name?: string;
    email?: string;
    gender?: Gender;
    dateOfBirth?: string;
    bloodGroup?: BloodGroup;
    address?: string;
    landmark?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    profilePictureUrl?: string;
}

export interface CreateFamilyMemberInput {
    name: string;
    relationship: RelationshipType;
    gender?: Gender;
    dateOfBirth?: string;
    bloodGroup?: BloodGroup;
    phone?: string;
    allergies?: string;
    chronicConditions?: string;
}

export interface UpdateFamilyMemberInput extends Partial<CreateFamilyMemberInput> { }

export interface CreateVitalsInput {
    familyMemberId?: string;
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    heartRate?: number;
    temperature?: number;
    weight?: number;
    height?: number;
    spo2?: number;
    respiratoryRate?: number;
    bloodSugar?: number;
    notes?: string;
}

// =============================================================================
// Filter Types
// =============================================================================

export interface UserFilters {
    role?: UserRole | UserRole[];
    status?: UserStatus;
    isBlocked?: boolean;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'name' | 'lastLoginAt';
    sortOrder?: 'asc' | 'desc';
}
