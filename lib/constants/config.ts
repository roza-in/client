/**
 * Rozx Healthcare Platform - Config Constants
 * 
 * Application configuration constants.
 */

// =============================================================================
// App Info
// =============================================================================

export const APP_NAME = 'Rozx Healthcare';
export const APP_SHORT_NAME = 'ROZX';
export const APP_DESCRIPTION = 'Book appointments with trusted doctors and hospitals across India';
export const APP_VERSION = '1.0.0';

// =============================================================================
// Pagination Defaults
// =============================================================================

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
export const MAX_PAGE_SIZE = 100;

// =============================================================================
// Time Defaults
// =============================================================================

export const DEFAULT_SLOT_DURATION = 30; // minutes
export const DEFAULT_SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
export const DEFAULT_TOKEN_REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes
export const APPOINTMENT_BUFFER_TIME = 15; // minutes before appointment

// =============================================================================
// File Limits
// =============================================================================

export const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB
export const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

// =============================================================================
// Form Limits
// =============================================================================

export const MAX_NAME_LENGTH = 100;
export const MAX_EMAIL_LENGTH = 255;
export const MAX_DESCRIPTION_LENGTH = 2000;
export const MAX_NOTES_LENGTH = 500;
export const MIN_PASSWORD_LENGTH = 8;
export const OTP_LENGTH = 6;

// =============================================================================
// Platform Fees
// =============================================================================

export const DEFAULT_PLATFORM_FEE_PERCENTAGE = 10;
export const GST_RATE = 18;

// =============================================================================
// Localization
// =============================================================================

export const DEFAULT_LOCALE = 'en-IN';
export const DEFAULT_CURRENCY = 'INR';
export const DEFAULT_TIMEZONE = 'Asia/Kolkata';

// =============================================================================
// API Config
// =============================================================================

export const API_TIMEOUT = 30000; // 30 seconds
export const API_RETRY_COUNT = 3;
export const API_RETRY_DELAY = 1000; // 1 second

// =============================================================================
// Feature Flags Defaults
// =============================================================================

export const DEFAULT_FEATURES = {
    videoConsultation: true,
    whatsappNotifications: true,
    googleAuth: true,
    razorpayPayments: true,
    darkMode: true,
    pharmacy: false,
    lab: false,
} as const;

export default {
    APP_NAME,
    APP_SHORT_NAME,
    APP_DESCRIPTION,
    APP_VERSION,
    DEFAULT_PAGE_SIZE,
    PAGE_SIZE_OPTIONS,
    MAX_PAGE_SIZE,
    DEFAULT_SLOT_DURATION,
    DEFAULT_SESSION_TIMEOUT,
    DEFAULT_TOKEN_REFRESH_INTERVAL,
    APPOINTMENT_BUFFER_TIME,
    MAX_AVATAR_SIZE,
    MAX_DOCUMENT_SIZE,
    MAX_IMAGE_SIZE,
    ALLOWED_IMAGE_TYPES,
    ALLOWED_DOCUMENT_TYPES,
    MAX_NAME_LENGTH,
    MAX_EMAIL_LENGTH,
    MAX_DESCRIPTION_LENGTH,
    MAX_NOTES_LENGTH,
    MIN_PASSWORD_LENGTH,
    OTP_LENGTH,
    DEFAULT_PLATFORM_FEE_PERCENTAGE,
    GST_RATE,
    DEFAULT_LOCALE,
    DEFAULT_CURRENCY,
    DEFAULT_TIMEZONE,
    API_TIMEOUT,
    API_RETRY_COUNT,
    API_RETRY_DELAY,
    DEFAULT_FEATURES,
};
