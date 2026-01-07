/**
 * ROZX Healthcare Platform - Auth Types
 * Authentication, User, and Session types
 */

import type { UserRole, Gender, BloodGroup, UserStatus } from './enums';

// ============================================================================
// User Types
// ============================================================================

export interface User {
  id: string;
  email: string | null;
  phone: string | null;
  phone_verified: boolean;
  email_verified: boolean;
  full_name: string | null;
  role: UserRole;
  status: UserStatus;
  gender: Gender | null;
  date_of_birth: string | null;
  blood_group: BloodGroup | null;
  profile_picture_url: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  last_login_at: string | null;
  login_count: number;
  created_at: string;
  updated_at: string;
}

/** Camel case version for frontend components */
export interface UserProfile {
  id: string;
  email: string | null;
  phone: string | null;
  phoneVerified: boolean;
  emailVerified: boolean;
  fullName: string | null;
  role: UserRole;
  status: UserStatus;
  gender: Gender | null;
  dateOfBirth: string | null;
  bloodGroup: BloodGroup | null;
  profilePictureUrl: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  lastLoginAt: string | null;
  loginCount: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Auth State Types
// ============================================================================

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  expiresAt: number;
}

export interface Session {
  user: UserProfile;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

// ============================================================================
// Login & Registration Types
// ============================================================================

export interface LoginCredentials {
  email?: string;
  phone?: string;
  password?: string;
}

export interface RegisterInput {
  phone: string;
  email?: string;
  fullName: string;
  password?: string;
  role?: UserRole;
}

export interface GoogleAuthInput {
  credential: string;
  role?: UserRole;
}

export interface LoginResponse {
  user: UserProfile;
  tokens: AuthTokens;
  isNewUser: boolean;
}

// ============================================================================
// OTP Types
// ============================================================================

export interface OTPSendInput {
  phone?: string;
  email?: string;
  purpose: 'registration' | 'login' | 'password_reset' | 'phone_verification' | 'email_verification';
  channel?: 'sms' | 'whatsapp' | 'email';
}

export interface OTPVerifyInput {
  phone?: string;
  email?: string;
  otp: string;
  purpose: 'registration' | 'login' | 'password_reset' | 'phone_verification' | 'email_verification';
}

export interface OTPResponse {
  success: boolean;
  message: string;
  expiresAt?: string;
  attemptsRemaining?: number;
}

// ============================================================================
// Password Types
// ============================================================================

export interface PasswordResetRequestInput {
  email?: string;
  phone?: string;
}

export interface PasswordResetInput {
  token: string;
  newPassword: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

// ============================================================================
// Session Types
// ============================================================================

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

// ============================================================================
// Update Types
// ============================================================================

export interface UpdateProfileInput {
  fullName?: string;
  email?: string;
  gender?: Gender;
  dateOfBirth?: string;
  bloodGroup?: BloodGroup;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}
