/**
 * Rozx Healthcare Platform - Auth Validation Schemas
 */

import { z } from 'zod';
import { emailSchema, passwordSchema, phoneSchema, otpSchema } from './common';

// =============================================================================
// Login Schemas
// =============================================================================

export const loginWithEmailSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional().default(false),
});

export const loginWithPhoneSchema = z.object({
    phone: phoneSchema,
});

export const verifyOTPSchema = z.object({
    phone: phoneSchema,
    otp: otpSchema,
});

// =============================================================================
// Registration Schemas
// =============================================================================

export const registerPatientSchema = z.object({
    name: z.string().min(2, 'First name is required').max(50),
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    dateOfBirth: z.string().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    acceptTerms: z.literal(true, {
        message: 'You must accept the terms and conditions',
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export const registerDoctorSchema = z.object({
    name: z.string().min(2, 'First name is required').max(50),
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    registrationNumber: z.string().min(1, 'Registration number is required'),
    specialization: z.string().min(1, 'Specialization is required'),
    qualification: z.string().min(1, 'Qualification is required'),
    experience: z.coerce.number().min(0, 'Experience must be positive'),
    acceptTerms: z.literal(true),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export const registerHospitalSchema = z.object({
    name: z.string().min(2, 'Hospital name is required').max(200),
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    registrationNumber: z.string().min(1, 'Registration number is required'),
    type: z.enum(['hospital', 'clinic', 'diagnostic_center', 'nursing_home']),
    address: z.object({
        address: z.string().min(1, 'Address is required'),
        city: z.string().min(1, 'City is required'),
        state: z.string().min(1, 'State is required'),
        pincode: z.string().length(6, 'Invalid pincode'),
    }),
    acceptTerms: z.literal(true),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

// =============================================================================
// Password Reset Schemas
// =============================================================================

export const forgotPasswordSchema = z.object({
    email: emailSchema,
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Token is required'),
    password: passwordSchema,
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
});

// =============================================================================
// Type Exports
// =============================================================================

export type LoginWithEmailInput = z.infer<typeof loginWithEmailSchema>;
export type LoginWithPhoneInput = z.infer<typeof loginWithPhoneSchema>;
export type VerifyOTPInput = z.infer<typeof verifyOTPSchema>;
export type RegisterPatientInput = z.infer<typeof registerPatientSchema>;
export type RegisterDoctorInput = z.infer<typeof registerDoctorSchema>;
export type RegisterHospitalInput = z.infer<typeof registerHospitalSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
