/**
 * Auth API Functions
 * Login-related API calls for the auth feature
 */

import { api, endpoints } from '@/lib/api';
import type { UserProfile, AuthTokens, AuthResponse, DoctorProfile, HospitalProfile } from '@/types';

// =============================================================================
// Types
// =============================================================================

export interface LoginWithPasswordInput {
    email: string;
    password: string;
}

export interface LoginWithOTPInput {
    phone?: string;
    email?: string;
    otp: string;
    purpose?: 'login' | 'registration';
}

export interface SendOTPInput {
    phone?: string;
    email?: string;
    purpose: 'login' | 'registration' | 'password_reset' | 'phone_verification' | 'email_verification';
    sessionId: string;
}

export interface OTPResponse {
    message: string;
    phone?: string;
    email?: string;
    expiresIn: number;
}

// =============================================================================
// Helper: Normalize Server Response
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
        doctor: (data.doctor as DoctorProfile) ?? null,
        hospital: (data.hospital as HospitalProfile) ?? null,
    };
}

function normalizeAuthResponse(response: Record<string, unknown>): AuthResponse {
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
        isNewUser: Boolean(response.isNewUser),
    };
}

// =============================================================================
// API Functions
// =============================================================================

/**
 * Login with email and password
 */
export async function loginWithPassword(input: LoginWithPasswordInput): Promise<AuthResponse> {
    const response = await api.post<Record<string, unknown>>(
        endpoints.auth.login,
        input,
        { skipErrorToast: true } as any
    );
    return normalizeAuthResponse(response);
}

/**
 * Send OTP to phone or email
 * Returns sessionId for tracking the OTP flow
 */
export async function sendOTP(input: SendOTPInput): Promise<OTPResponse> {
    const response = await api.post<OTPResponse>(endpoints.auth.sendOTP, {
        phone: input.phone,
        email: input.email,
        purpose: input.purpose,
        sessionId: input.sessionId,
    });
    return response;
}

/**
 * Verify OTP and login (for existing users)
 */
export async function loginWithOTP(input: LoginWithOTPInput): Promise<AuthResponse> {
    const response = await api.post<Record<string, unknown>>(
        endpoints.auth.loginOTP,
        {
            phone: input.phone,
            email: input.email,
            otp: input.otp,
            purpose: input.purpose || 'login'
        },
        { skipErrorToast: true } as any
    );
    return normalizeAuthResponse(response);
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<AuthResponse> {
    const response = await api.get<Record<string, unknown>>(
        endpoints.auth.me,
        { skipErrorToast: true, skipAuthRedirect: true } as any
    );
    return normalizeAuthResponse(response);
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
    await api.post<void>(endpoints.auth.logout, {}, { skipAuth: true });
}

/**
 * Refresh access token
 */
export async function refreshToken(): Promise<AuthTokens> {
    const response = await api.post<AuthTokens>(endpoints.auth.refresh, {});
    return response;
}

/**
 * Get Google OAuth URL
 */
export async function getGoogleOAuthUrl(redirectUrl?: string): Promise<{ url: string }> {
    const params = redirectUrl ? `?redirectUrl=${encodeURIComponent(redirectUrl)}` : '';
    return api.get<{ url: string }>(`${endpoints.auth.googleUrl}${params}`);
}

// =============================================================================
// Exports
// =============================================================================

export const loginApi = {
    loginWithPassword,
    loginWithOTP,
    sendOTP,
    getCurrentUser,
    logout,
    refreshToken,
    getGoogleOAuthUrl,
};

export { ApiError } from '@/lib/api/error-handler';
export type { AuthResponse };
