/**
 * Rozx Healthcare Platform - Phone Number Utilities
 * 
 * Indian phone number validation and formatting.
 */

// =============================================================================
// Constants
// =============================================================================

const INDIA_COUNTRY_CODE = '+91';
const PHONE_LENGTH = 10;
const PHONE_REGEX = /^[6-9]\d{9}$/;

// =============================================================================
// Validation
// =============================================================================

/**
 * Validate Indian phone number
 * Valid: 10 digits starting with 6, 7, 8, or 9
 */
export function isValidPhone(phone: string): boolean {
    const cleaned = cleanPhone(phone);
    return PHONE_REGEX.test(cleaned);
}

/**
 * Clean phone number (remove country code, spaces, dashes)
 */
export function cleanPhone(phone: string): string {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');

    // Remove country code if present
    if (cleaned.startsWith('91') && cleaned.length === 12) {
        cleaned = cleaned.substring(2);
    }

    return cleaned;
}

// =============================================================================
// Formatting
// =============================================================================

/**
 * Format phone number for display
 * 
 * @example
 * formatPhone('9876543210') // '+91 98765 43210'
 * formatPhone('9876543210', { withCode: false }) // '98765 43210'
 */
export function formatPhone(
    phone: string,
    options: { withCode?: boolean; separator?: string } = {}
): string {
    const { withCode = true, separator = ' ' } = options;
    const cleaned = cleanPhone(phone);

    if (cleaned.length !== 10) {
        return phone; // Return original if invalid
    }

    const formatted = `${cleaned.slice(0, 5)}${separator}${cleaned.slice(5)}`;

    return withCode ? `${INDIA_COUNTRY_CODE} ${formatted}` : formatted;
}

/**
 * Format phone for API submission (with country code, no spaces)
 */
export function formatPhoneForAPI(phone: string): string {
    const cleaned = cleanPhone(phone);
    return `${INDIA_COUNTRY_CODE}${cleaned}`;
}

/**
 * Mask phone number for privacy
 * 
 * @example
 * maskPhone('9876543210') // '98****3210'
 */
export function maskPhone(phone: string): string {
    const cleaned = cleanPhone(phone);
    if (cleaned.length !== 10) return phone;

    return `${cleaned.slice(0, 2)}****${cleaned.slice(-4)}`;
}

/**
 * Get last 4 digits of phone
 */
export function getPhoneLast4(phone: string): string {
    const cleaned = cleanPhone(phone);
    return cleaned.slice(-4);
}

// =============================================================================
// Type Helpers
// =============================================================================

/**
 * Detect mobile operator from phone number
 */
export function detectOperator(phone: string): string {
    const cleaned = cleanPhone(phone);
    if (cleaned.length !== 10) return 'Unknown';

    const prefix = parseInt(cleaned.substring(0, 4), 10);

    // This is a simplified version - actual detection is more complex
    // Jio: 7000-7999, 8000-8999 (some ranges)
    // Airtel: 7000-7999, 8000-8999, 9000-9999 (some ranges)
    // Vi (Vodafone-Idea): 7000-7999, 8000-8999, 9000-9999 (some ranges)
    // BSNL: 9400-9499

    if (prefix >= 9400 && prefix <= 9499) return 'BSNL';

    // Default - we can't reliably detect without a full database
    return 'Mobile';
}

// =============================================================================
// Input Helpers
// =============================================================================

/**
 * Format phone number as user types (for input fields)
 */
export function formatPhoneInput(value: string): string {
    // Only allow digits and limit to 10
    const digits = value.replace(/\D/g, '').slice(0, 10);

    if (digits.length <= 5) {
        return digits;
    }

    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}

/**
 * Get phone input value for form
 */
export function getPhoneInputValue(formatted: string): string {
    return cleanPhone(formatted);
}

export default {
    isValidPhone,
    cleanPhone,
    formatPhone,
    formatPhoneForAPI,
    maskPhone,
    getPhoneLast4,
    detectOperator,
    formatPhoneInput,
    getPhoneInputValue,
    INDIA_COUNTRY_CODE,
    PHONE_LENGTH,
};
