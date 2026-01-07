/**
 * Auth Types
 */

export type UserRole = 'patient' | 'doctor' | 'hospital_admin' | 'admin';

export interface User {
  id: string;
  email: string | null;
  phone: string | null;
  fullName: string;
  role: UserRole;
  profilePictureUrl: string | null;
  hospitalId?: string;
  doctorId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email?: string;
  phone?: string;
  password?: string;
}

export interface OTPVerification {
  phone: string;
  otp: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
  isNewUser: boolean;
}

export interface Session {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface OTPSendResponse {
  success: boolean;
  message: string;
}
