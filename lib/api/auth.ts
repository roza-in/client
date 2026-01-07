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
} from '@/lib/types';

/**
 * Auth response type
 */
export interface AuthResponse {
  user: UserProfile;
  tokens: AuthTokens;
  isNewUser: boolean;
}

/**
 * Send OTP to phone number
 */
export async function sendOTP(data: OTPSendInput): Promise<OTPResponse> {
  return api.post<OTPResponse>('/auth/otp/send', data);
}

/**
 * Verify OTP and get tokens
 */
export async function verifyOTP(data: OTPVerifyInput): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/otp/verify', data);

  // Store tokens if login was successful
  if (response.tokens?.accessToken && response.tokens?.refreshToken) {
    setAuthTokens(response.tokens.accessToken, response.tokens.refreshToken);
  }

  return response;
}

/**
 * Google OAuth authentication
 */
export async function googleOAuth(data: GoogleAuthInput): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/google', data);

  // Store tokens if login was successful
  if (response.tokens?.accessToken && response.tokens?.refreshToken) {
    setAuthTokens(response.tokens.accessToken, response.tokens.refreshToken);
  }

  return response;
}

/**
 * Register a new patient
 */
export async function registerPatient(
  data: RegisterInput
): Promise<{ user: User; profile: UserProfile; tokens: AuthTokens }> {
  const response = await api.post<{ user: User; profile: UserProfile; tokens: AuthTokens }>(
    '/auth/register/patient',
    data
  );

  // Store tokens after successful registration
  if (response.tokens) {
    setAuthTokens(response.tokens.accessToken, response.tokens.refreshToken);
  }

  return response;
}

/**
 * Hospital registration input
 */
export interface HospitalRegisterInput {
  phone: string;
  email?: string;
  fullName: string;
  hospitalName: string;
  hospitalType: string;
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
}

/**
 * Register a new hospital
 */
export async function registerHospital(
  data: HospitalRegisterInput
): Promise<{ user: User; profile: UserProfile; hospital: unknown; tokens: AuthTokens }> {
  const response = await api.post<{
    user: User;
    profile: UserProfile;
    hospital: unknown;
    tokens: AuthTokens;
  }>('/auth/register/hospital', data);

  // Store tokens after successful registration
  if (response.tokens) {
    setAuthTokens(response.tokens.accessToken, response.tokens.refreshToken);
  }

  return response;
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
export async function getMe(): Promise<{ user: User; profile: UserProfile }> {
  return api.get<{ user: User; profile: UserProfile }>('/auth/me');
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
  googleOAuth,
  registerPatient,
  registerHospital,
  refreshToken,
  getMe,
  logout,
  isAuthenticated,
};
