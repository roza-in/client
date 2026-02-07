/**
 * Auth Feature - Types
 */

// Re-export from shared types
export type {
    UserProfile,
    AuthTokens,
    AuthResponse,
} from '@/types';

// Re-export from API
export type {
    RegisterPatientInput,
    RegisterDoctorInput,
    RegisterHospitalInput,
    RegisterResponse,
} from './api/register';

export type {
    LoginWithPasswordInput,
    LoginWithOTPInput,
    SendOTPInput,
    OTPResponse,
} from './api/login';
