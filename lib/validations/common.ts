/**
 * Rozx Healthcare Platform - Common Validation Schemas
 * 
 * Shared Zod validation schemas.
 */

import { z } from 'zod';

// =============================================================================
// Primitive Schemas
// =============================================================================

/**
 * UUID validation
 */
export const uuidSchema = z.string().uuid('Invalid ID format');

/**
 * Email validation
 */
export const emailSchema = z
    .string()
    .email('Invalid email address')
    .min(1, 'Email is required')
    .max(255, 'Email is too long');

/**
 * Indian phone number validation
 */
export const phoneSchema = z
    .string()
    .min(10, 'Phone number must be 10 digits')
    .max(13, 'Phone number is too long')
    .regex(/^(\+91)?[6-9]\d{9}$/, 'Invalid phone number');

/**
 * Password validation
 */
export const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number');

/**
 * OTP validation
 */
export const otpSchema = z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only numbers');

/**
 * URL validation
 */
export const urlSchema = z.string().url('Invalid URL');

/**
 * Indian pincode validation
 */
export const pincodeSchema = z
    .string()
    .length(6, 'Pincode must be 6 digits')
    .regex(/^\d{6}$/, 'Invalid pincode');

// =============================================================================
// Date Schemas
// =============================================================================

/**
 * Date string (ISO format)
 */
export const dateStringSchema = z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format');

/**
 * Future date validation
 */
export const futureDateSchema = z
    .string()
    .refine((val) => new Date(val) > new Date(), 'Date must be in the future');

/**
 * Past date validation
 */
export const pastDateSchema = z
    .string()
    .refine((val) => new Date(val) < new Date(), 'Date must be in the past');

/**
 * Date of birth (must be in past, reasonable age)
 */
export const dateOfBirthSchema = z
    .string()
    .refine((val) => {
        const date = new Date(val);
        const now = new Date();
        const age = now.getFullYear() - date.getFullYear();
        return date < now && age >= 0 && age <= 120;
    }, 'Invalid date of birth');

// =============================================================================
// Object Schemas
// =============================================================================

/**
 * Pagination params
 */
export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
});

/**
 * Sort params
 */
export const sortSchema = z.object({
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * Date range
 */
export const dateRangeSchema = z.object({
    startDate: dateStringSchema.optional(),
    endDate: dateStringSchema.optional(),
}).refine(
    (data) => {
        if (data.startDate && data.endDate) {
            return new Date(data.startDate) <= new Date(data.endDate);
        }
        return true;
    },
    { message: 'End date must be after start date' }
);

/**
 * Address
 */
export const addressSchema = z.object({
    line1: z.string().min(1, 'Address line 1 is required').max(255),
    line2: z.string().max(255).optional(),
    city: z.string().min(1, 'City is required').max(100),
    state: z.string().min(1, 'State is required').max(100),
    pincode: pincodeSchema,
    country: z.string().default('India'),
});

/**
 * Coordinates
 */
export const coordinatesSchema = z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
});

// =============================================================================
// File Schemas
// =============================================================================

/**
 * Image file validation
 */
export const imageFileSchema = z.object({
    name: z.string(),
    type: z.enum(['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
    size: z.number().max(5 * 1024 * 1024, 'Image must be less than 5MB'),
});

/**
 * Document file validation
 */
export const documentFileSchema = z.object({
    name: z.string(),
    type: z.enum(['application/pdf', 'image/jpeg', 'image/png']),
    size: z.number().max(10 * 1024 * 1024, 'Document must be less than 10MB'),
});

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Create optional version of schema
 */
export function optional<T extends z.ZodTypeAny>(schema: T) {
    return schema.optional().nullable();
}

/**
 * Create array schema with min/max
 */
export function arrayOf<T extends z.ZodTypeAny>(
    schema: T,
    options: { min?: number; max?: number } = {}
) {
    let arraySchema = z.array(schema);
    if (options.min !== undefined) {
        arraySchema = arraySchema.min(options.min);
    }
    if (options.max !== undefined) {
        arraySchema = arraySchema.max(options.max);
    }
    return arraySchema;
}

export default {
    uuidSchema,
    emailSchema,
    phoneSchema,
    passwordSchema,
    otpSchema,
    urlSchema,
    pincodeSchema,
    dateStringSchema,
    futureDateSchema,
    pastDateSchema,
    dateOfBirthSchema,
    paginationSchema,
    sortSchema,
    dateRangeSchema,
    addressSchema,
    coordinatesSchema,
    imageFileSchema,
    documentFileSchema,
    optional,
    arrayOf,
};
