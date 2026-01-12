/**
 * Authentication API
 * Handles all authentication-related API calls
 */

import { api, setAuthTokens, clearAuthTokens } from '@/config/api';
import type {
  User,
  UserProfile,
  AuthTokens,
  OTPSendInput,
  OTPResponse,
  OTPVerifyInput,
  GoogleAuthInput,
  RegisterInput,
  PasswordLoginInput,
  HospitalType,
} from '@/lib/types';

/**
 * Auth response type - matches server LoginResponse
 */
export interface AuthResponse {
  user: UserProfile;
  tokens: AuthTokens;
  isNewUser: boolean;
}

/**
 * Normalize snake_case server user to camelCase UserProfile for frontend
 */
function normalizeUserProfile(data: any): UserProfile {
  return {
    id: data.id,
    phone: data.phone,
    email: data.email,
    phoneVerified: data.phone_verified || data.phoneVerified || false,
    emailVerified: data.email_verified || data.emailVerified || false,
    fullName: data.full_name || data.fullName,
    role: data.role,
    profilePictureUrl: data.profile_picture_url || data.profilePictureUrl,
    doctor: data.doctor || null,
    hospital: data.hospital || null,
  };
}

/**
 * Login with email + password
 */
export async function loginWithPassword(data: PasswordLoginInput): Promise<AuthResponse> {
  const response = await api.post<any>('/auth/login/password', data);

  const normalizedUser = normalizeUserProfile(response.user || response);
  const tokens = {
    accessToken: response.tokens?.accessToken || response.accessToken,
    refreshToken: response.tokens?.refreshToken || response.refreshToken,
    expiresIn: response.tokens?.expiresIn || response.expiresIn || 3600,
    expiresAt: response.tokens?.expiresAt || response.expiresAt || Date.now() + 3600000,
  };

  if (tokens.accessToken && tokens.refreshToken) {
    setAuthTokens(tokens.accessToken, tokens.refreshToken);
  }

  return {
    user: normalizedUser,
    tokens,
    isNewUser: response.isNewUser || false,
  };
}

/**
 * Send OTP to phone number
 */
export async function sendOTP(data: OTPSendInput): Promise<OTPResponse> {
  return api.post<OTPResponse>('/auth/otp/send', data);
}

/**
 * Verify OTP and get tokens (login only)
 */
export async function verifyOTP(data: OTPVerifyInput): Promise<AuthResponse> {
  const response = await api.post<any>('/auth/otp/verify', data);

  // Normalize and validate response
  const normalizedUser = normalizeUserProfile(response.user || response);
  const tokens = {
    accessToken: response.tokens?.accessToken || response.accessToken,
    refreshToken: response.tokens?.refreshToken || response.refreshToken,
    expiresIn: response.tokens?.expiresIn || response.expiresIn || 3600,
    expiresAt: response.tokens?.expiresAt || response.expiresAt || Date.now() + 3600000,
  };

  // Store tokens if login was successful
  if (tokens.accessToken && tokens.refreshToken) {
    setAuthTokens(tokens.accessToken, tokens.refreshToken);
  }

  return {
    user: normalizedUser,
    tokens,
    isNewUser: response.isNewUser || false,
  };
}

/**
 * Get Google OAuth redirect URL (Supabase Auth flow)
 * Step 1 of OAuth: Get the redirect URL to send user to Google
 */
export async function getGoogleOAuthUrl(redirectUrl: string): Promise<{ url: string; state: string }> {
  const response = await api.get<any>('/auth/google/url', {
    params: { redirectUrl },
  });

  return {
    url: response.url,
    state: response.state,
  };
}

/**
 * Handle Google OAuth callback (Supabase Auth flow)
 * Step 2 of OAuth: Exchange Supabase session for ROZX tokens
 */
export async function handleGoogleCallback(
  accessToken: string,
  userId: string
): Promise<AuthResponse> {
  const response = await api.post<any>('/auth/google/callback', {
    accessToken,
    userId,
  });

  // Normalize user data
  const normalizedUser = normalizeUserProfile(response.user || response);
  const tokens = {
    accessToken: response.tokens?.accessToken || response.accessToken,
    refreshToken: response.tokens?.refreshToken || response.refreshToken,
    expiresIn: response.tokens?.expiresIn || response.expiresIn || 3600,
    expiresAt: response.tokens?.expiresAt || response.expiresAt || Date.now() + 3600000,
  };

  // Store tokens if login was successful
  if (tokens.accessToken && tokens.refreshToken) {
    setAuthTokens(tokens.accessToken, tokens.refreshToken);
  }

  return {
    user: normalizedUser,
    tokens,
    isNewUser: response.isNewUser || false,
  };
}

/**
 * Google OAuth authentication (DEPRECATED - use getGoogleOAuthUrl + handleGoogleCallback instead)
 * @deprecated Use getGoogleOAuthUrl() -> handleGoogleCallback() for Supabase Auth flow
 */
export async function googleOAuth(data: GoogleAuthInput): Promise<AuthResponse> {
  const response = await api.post<any>('/auth/google', data);

  // Normalize user data
  const normalizedUser = normalizeUserProfile(response.user || response);
  const tokens = {
    accessToken: response.tokens?.accessToken || response.accessToken,
    refreshToken: response.tokens?.refreshToken || response.refreshToken,
    expiresIn: response.tokens?.expiresIn || response.expiresIn || 3600,
    expiresAt: response.tokens?.expiresAt || response.expiresAt || Date.now() + 3600000,
  };

  // Store tokens if login was successful
  if (tokens.accessToken && tokens.refreshToken) {
    setAuthTokens(tokens.accessToken, tokens.refreshToken);
  }

  return {
    user: normalizedUser,
    tokens,
    isNewUser: response.isNewUser || false,
  };
}

/**
 * Register a new patient
 */
export async function registerPatient(
  data: RegisterInput
): Promise<AuthResponse> {
  const response = await api.post<any>('/auth/register/patient', data);

  // Normalize user data
  const normalizedUser = normalizeUserProfile(response.user || response);
  const tokens = {
    accessToken: response.tokens?.accessToken || response.accessToken,
    refreshToken: response.tokens?.refreshToken || response.refreshToken,
    expiresIn: response.tokens?.expiresIn || response.expiresIn || 3600,
    expiresAt: response.tokens?.expiresAt || response.expiresAt || Date.now() + 3600000,
  };

  // Store tokens after successful registration
  if (tokens.accessToken && tokens.refreshToken) {
    setAuthTokens(tokens.accessToken, tokens.refreshToken);
  }

  return {
    user: normalizedUser,
    tokens,
    isNewUser: response.isNewUser || true,
  };
}

/**
 * Hospital registration input - matches server RegisterHospitalInput shape
 */
export interface HospitalRegisterInput {
  phone: string;
  otp: string;
  password?: string;
  fullName: string;
  email?: string;
  hospital: {
    name: string;
    type?: HospitalType;
    registrationNumber?: string;
    phone: string;
    email?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    latitude?: number;
    longitude?: number;
    about?: string;
    specialties?: string[];
    facilities?: string[];
  };
}

/**
 * Register a new hospital
 */
export async function registerHospital(
  data: HospitalRegisterInput
): Promise<AuthResponse> {
  const response = await api.post<any>('/auth/register/hospital', data);

  // Normalize user data
  const normalizedUser = normalizeUserProfile(response.user || response);
  const tokens = {
    accessToken: response.tokens?.accessToken || response.accessToken,
    refreshToken: response.tokens?.refreshToken || response.refreshToken,
    expiresIn: response.tokens?.expiresIn || response.expiresIn || 3600,
    expiresAt: response.tokens?.expiresAt || response.expiresAt || Date.now() + 3600000,
  };

  // Store tokens after successful registration
  if (tokens.accessToken && tokens.refreshToken) {
    setAuthTokens(tokens.accessToken, tokens.refreshToken);
  }

  return {
    user: normalizedUser,
    tokens,
    isNewUser: response.isNewUser || true,
  };
}

/**
 * Refresh access token
 */
export async function refreshToken(refreshToken: string): Promise<AuthTokens> {
  const response = await api.post<AuthTokens>('/auth/refresh', { refreshToken });

  // Update stored tokens
  if (response.accessToken && response.refreshToken) {
    setAuthTokens(response.accessToken, response.refreshToken);
  }

  return response;
}

/**
 * Get current authenticated user
 */
export async function getMe(): Promise<AuthResponse> {
  const response = await api.get<any>('/auth/me');
  
  // Normalize response to UserProfile
  if (response && 'user' in response) {
    return {
      user: normalizeUserProfile(response.user || response),
      tokens: {} as AuthTokens,
      isNewUser: false,
    };
  }
  
  return {
    user: normalizeUserProfile(response),
    tokens: {} as AuthTokens,
    isNewUser: false,
  };
}

/**
 * Logout - clear tokens and invalidate session
 */
export async function logout(): Promise<void> {
  try {
    await api.post<void>('/auth/logout');
  } finally {
    // Always clear tokens, even if the API call fails
    clearAuthTokens();
  }
}

/**
 * Check if user is authenticated (has valid tokens)
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('accessToken');
}

/**
 * Auth API namespace export
 */
export const authApi = {
  sendOTP,
  verifyOTP,
  loginWithPassword,
  getGoogleOAuthUrl,
  handleGoogleCallback,
  googleOAuth, // deprecated
};
