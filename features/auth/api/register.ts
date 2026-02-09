/**
 * Auth Feature - Registration API
 * OTP-first registration flow aligned with server
 */

import { api, endpoints } from '@/lib/api';
import type { UserProfile, AuthTokens } from '@/types';

// =============================================================================
// Types (aligned with server auth.validator.ts)
// =============================================================================

export interface RegisterPatientInput {
    phone: string;
    otp: string;
    name: string;
    email: string;
    password?: string;
    gender?: 'male' | 'female' | 'other';
    dateOfBirth?: string;
}

export interface RegisterDoctorInput {
    phone: string;
    otp: string;
    name: string;
    email: string;
    password?: string;
    registrationNumber: string;
    specialization: string;
    qualification: string;
    experience?: number;
}

export interface RegisterHospitalInput {
    phone: string;
    otp: string;
    name: string;
    email: string;
    password?: string;
}

export interface CompleteUserRegistrationInput {
    phone: string;
    otp: string;
    password: string;
    name: string;
    email: string;
    role: 'patient' | 'hospital' | 'doctor';
}

export interface RegisterHospitalProfileInput {
    name: string;
    type: string;
    description?: string | null;
    phone: string;
    email: string;
}

export interface RegisterHospitalComplianceInput {
    registrationNumber: string;
    gstin?: string | null;
    pan: string;
}

export interface RegisterHospitalAddressInput {
    address: string;
    landmark?: string | null;
    city: string;
    state: string;
    pincode: string;
}

export interface RegisterResponse {
    user: UserProfile;
    tokens: AuthTokens;
    isNewUser: boolean;
}

// =============================================================================
// Helpers
// =============================================================================

function normalizeUserProfile(data: Record<string, unknown>): UserProfile {
    return {
        id: data.id as string,
        phone: (data.phone as string) || null,
        email: (data.email as string) || null,
        phoneVerified: Boolean(data.phone_verified ?? data.phoneVerified),
        emailVerified: Boolean(data.email_verified ?? data.emailVerified),
        name: (data.name as string) || null,
        role: (data.role as UserProfile['role']) || 'patient',
        profilePictureUrl: (data.profile_picture_url ?? data.profilePictureUrl ?? data.avatar_url ?? data.avatarUrl) as string || null,
        gender: (data.gender as UserProfile['gender']) || null,
        dateOfBirth: (data.date_of_birth ?? data.dateOfBirth) as string || null,
        doctor: null,
        hospital: null,
    };
}

function normalizeRegisterResponse(response: Record<string, unknown>): RegisterResponse {
    const userData = (response.user || response) as Record<string, unknown>;
    const tokensData = (response.tokens || {}) as Record<string, unknown>;

    return {
        user: normalizeUserProfile(userData),
        tokens: {
            accessToken: (tokensData.accessToken ?? response.accessToken) as string || '',
            refreshToken: (tokensData.refreshToken ?? response.refreshToken) as string || '',
            expiresIn: (tokensData.expiresIn ?? response.expiresIn) as number || 3600,
            expiresAt: (tokensData.expiresAt ?? response.expiresAt) as number || Date.now() + 3600000,
        },
        isNewUser: true,
    };
}

// =============================================================================
// API Functions
// =============================================================================

/**
 * Register a new patient account (OTP-first flow)
 */
export async function registerPatient(input: RegisterPatientInput): Promise<RegisterResponse> {
    const response = await api.post<Record<string, unknown>>(
        endpoints.auth.registerPatient,
        input,
        { skipErrorToast: true } as any
    );
    return normalizeRegisterResponse(response);
}

/**
 * Register a new hospital account (OTP-first flow)
 */
export async function registerHospital(input: RegisterHospitalInput): Promise<RegisterResponse> {
    const response = await api.post<Record<string, unknown>>(
        endpoints.auth.registerHospital,
        input,
        { skipErrorToast: true } as any
    );
    return normalizeRegisterResponse(response);
}

/**
 * Complete user registration (Step 2)
 */
export async function completeUserRegistration(input: CompleteUserRegistrationInput): Promise<RegisterResponse> {
    const response = await api.post<Record<string, unknown>>(
        endpoints.auth.registerCompleteUser,
        input,
        { skipErrorToast: true } as any
    );
    return normalizeRegisterResponse(response);
}

/**
 * Register hospital profile (Step 3)
 */
export async function registerHospitalProfile(input: RegisterHospitalProfileInput): Promise<any> {
    return api.post(endpoints.auth.registerHospitalProfile, input);
}

/**
 * Register hospital compliance (Step 4)
 */
export async function registerHospitalCompliance(input: RegisterHospitalComplianceInput): Promise<any> {
    return api.post(endpoints.auth.registerHospitalCompliance, input);
}

/**
 * Register hospital address (Step 5)
 */
export async function registerHospitalAddress(input: RegisterHospitalAddressInput): Promise<any> {
    return api.post(endpoints.auth.registerHospitalAddress, input);
}

/**
 * Verify email with token
 */
export async function verifyEmail(token: string): Promise<{ verified: boolean }> {
    return api.post<{ verified: boolean }>(endpoints.auth.verifyEmail, { token });
}

/**
 * Request password reset email
 */
export async function forgotPassword(email: string): Promise<{ sent: boolean }> {
    return api.post<{ sent: boolean }>(endpoints.auth.forgotPassword, { email });
}

/**
 * Reset password with token
 */
export async function resetPassword(
    token: string,
    password: string
): Promise<{ success: boolean }> {
    return api.post<{ success: boolean }>(endpoints.auth.resetPassword, { token, password });
}
