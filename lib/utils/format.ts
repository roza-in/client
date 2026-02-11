/**
 * Rozx Healthcare Platform - General Formatters
 * 
 * Common formatting utilities.
 */

// =============================================================================
// String Formatters
// =============================================================================

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Title case (capitalize each word)
 */
export function titleCase(str: string): string {
    if (!str) return '';
    return str
        .toLowerCase()
        .split(' ')
        .map((word) => capitalize(word))
        .join(' ');
}

/**
 * Truncate text with ellipsis
 */
export function truncate(str: string, maxLength: number, suffix: string = '...'): string {
    if (!str || str.length <= maxLength) return str;
    return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Convert to slug
 */
export function slugify(str: string): string {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Convert snake_case to Title Case
 */
export function snakeToTitle(str: string): string {
    return str
        .split('_')
        .map((word) => capitalize(word))
        .join(' ');
}

/**
 * Convert camelCase to Title Case
 */
export function camelToTitle(str: string): string {
    return str
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (match) => match.toUpperCase())
        .trim();
}

// =============================================================================
// Name Formatters
// =============================================================================

/**
 * Format full name
 */
export function formatName(
    name?: string | null,
): string {
    const parts = [name,].filter(Boolean);
    return parts.map((p) => capitalize(p!)).join(' ') || 'Unknown';
}

/**
 * Get initials from name
 */
export function getInitials(name: string, maxChars: number = 2): string {
    if (!name) return '';

    return name
        .split(' ')
        .filter(Boolean)
        .map((word) => word[0])
        .slice(0, maxChars)
        .join('')
        .toUpperCase();
}

/**
 * Format doctor name with title
 */
export function formatDoctorName(name: string, qualification?: string): string {
    const formattedName = `Dr. ${titleCase(name)}`;
    if (qualification) {
        return `${formattedName}, ${qualification}`;
    }
    return formattedName;
}

// =============================================================================
// Number Formatters
// =============================================================================

/**
 * Format number with Indian numbering system
 */
export function formatNumber(num: number): string {
    return new Intl.NumberFormat('en-IN').format(num);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
    return `${value.toFixed(decimals)}%`;
}

/**
 * Format ordinal (1st, 2nd, 3rd, etc.)
 */
export function formatOrdinal(num: number): string {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = num % 100;
    return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

/**
 * Pluralize word based on count
 */
export function pluralize(count: number, singular: string, plural?: string): string {
    const word = count === 1 ? singular : (plural || `${singular}s`);
    return `${count} ${word}`;
}

// =============================================================================
// Address Formatters
// =============================================================================

/**
 * Format address
 */
export function formatAddress(address: {
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
}): string {
    const parts = [
        address.address,
        address.city,
        address.state,
        address.pincode,
    ].filter(Boolean);

    return parts.join(', ');
}

/**
 * Format short address (city, state)
 */
export function formatShortAddress(city?: string, state?: string): string {
    const parts = [city, state].filter(Boolean);
    return parts.join(', ') || 'Location not specified';
}

// =============================================================================
// Status Formatters
// =============================================================================

/**
 * Format enum value to display text
 */
export function formatEnumValue(value: string): string {
    return value
        .split('_')
        .map((word) => capitalize(word))
        .join(' ');
}

/**
 * Format boolean as Yes/No
 */
export function formatBoolean(value: boolean, options?: { yes?: string; no?: string }): string {
    const { yes = 'Yes', no = 'No' } = options || {};
    return value ? yes : no;
}

// =============================================================================
// Medical Formatters
// =============================================================================

/**
 * Format age from birth date
 */
export function formatAge(birthDate: Date | string): string {
    const birth = new Date(birthDate);
    const today = new Date();

    let years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();

    if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
        years--;
    }

    if (years < 1) {
        const monthsDiff = (today.getFullYear() - birth.getFullYear()) * 12 + months;
        return monthsDiff <= 0 ? 'Infant' : `${monthsDiff} months`;
    }

    return `${years} years`;
}

/**
 * Format blood group
 */
export function formatBloodGroup(bloodGroup: string): string {
    return bloodGroup.toUpperCase().replace('POSITIVE', '+').replace('NEGATIVE', '-');
}

/**
 * Format height (cm to feet/inches)
 */
export function formatHeight(cm: number): string {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}'${inches}"`;
}

/**
 * Format weight
 */
export function formatWeight(kg: number): string {
    return `${kg} kg`;
}

export default {
    capitalize,
    titleCase,
    truncate,
    slugify,
    snakeToTitle,
    camelToTitle,
    formatName,
    getInitials,
    formatDoctorName,
    formatNumber,
    formatPercentage,
    formatOrdinal,
    pluralize,
    formatAddress,
    formatShortAddress,
    formatEnumValue,
    formatBoolean,
    formatAge,
    formatBloodGroup,
    formatHeight,
    formatWeight,
};
