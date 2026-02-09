/**
 * ROZX Healthcare Platform - Currency Utilities
 * 
 * Indian Rupee (₹) formatting and calculations.
 */

// =============================================================================
// Constants
// =============================================================================

const CURRENCY_SYMBOL = '₹';
const CURRENCY_CODE = 'INR';
const LOCALE = 'en-IN';

// =============================================================================
// Formatting Functions
// =============================================================================

/**
 * Format amount as Indian Rupees
 * 
 * @example
 * formatCurrency(1234.56) // '₹1,234.56'
 * formatCurrency(10000) // '₹10,000'
 */
export function formatCurrency(
    amount: number,
    options: {
        showSymbol?: boolean;
        showDecimals?: boolean;
        compact?: boolean;
    } = {}
): string {
    const { showSymbol = true, showDecimals = true, compact = false } = options;

    if (compact) {
        return formatCompactCurrency(amount, showSymbol);
    }

    const formatter = new Intl.NumberFormat(LOCALE, {
        style: showSymbol ? 'currency' : 'decimal',
        currency: CURRENCY_CODE,
        minimumFractionDigits: showDecimals ? 2 : 0,
        maximumFractionDigits: showDecimals ? 2 : 0,
    });

    return formatter.format(amount);
}

/**
 * Format currency in compact notation (₹10K, ₹1.5L, ₹2Cr)
 */
export function formatCompactCurrency(amount: number, showSymbol: boolean = true): string {
    const prefix = showSymbol ? CURRENCY_SYMBOL : '';

    if (amount >= 10000000) {
        // Crores
        const crores = amount / 10000000;
        return `${prefix}${crores.toFixed(crores % 1 === 0 ? 0 : 1)}Cr`;
    }

    if (amount >= 100000) {
        // Lakhs
        const lakhs = amount / 100000;
        return `${prefix}${lakhs.toFixed(lakhs % 1 === 0 ? 0 : 1)}L`;
    }

    if (amount >= 1000) {
        // Thousands
        const thousands = amount / 1000;
        return `${prefix}${thousands.toFixed(thousands % 1 === 0 ? 0 : 1)}K`;
    }

    return `${prefix}${amount}`;
}

/**
 * Parse currency string to number
 * 
 * @example
 * parseCurrency('₹1,234.56') // 1234.56
 * parseCurrency('1,234') // 1234
 */
export function parseCurrency(value: string): number {
    // Remove currency symbol, commas, and whitespace
    const cleaned = value.replace(/[₹,\s]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
}

// =============================================================================
// Calculation Helpers
// =============================================================================

/**
 * Calculate percentage of amount
 */
export function calculatePercentage(amount: number, percentage: number): number {
    return Math.round((amount * percentage) / 100 * 100) / 100;
}

/**
 * Calculate GST (18% default)
 */
export function calculateGST(amount: number, rate: number = 18): {
    baseAmount: number;
    gstAmount: number;
    totalAmount: number;
} {
    const gstAmount = calculatePercentage(amount, rate);
    return {
        baseAmount: amount,
        gstAmount,
        totalAmount: amount + gstAmount,
    };
}

/**
 * Extract GST from total (reverse calculation)
 */
export function extractGSTFromTotal(totalAmount: number, rate: number = 18): {
    baseAmount: number;
    gstAmount: number;
    totalAmount: number;
} {
    const baseAmount = Math.round((totalAmount / (1 + rate / 100)) * 100) / 100;
    const gstAmount = totalAmount - baseAmount;
    return {
        baseAmount,
        gstAmount,
        totalAmount,
    };
}

/**
 * Calculate platform fee
 */
export function calculatePlatformFee(
    consultationFee: number,
    platformFeePercentage: number = 10
): {
    consultationFee: number;
    platformFee: number;
    total: number;
} {
    const platformFee = calculatePercentage(consultationFee, platformFeePercentage);
    return {
        consultationFee,
        platformFee,
        total: consultationFee + platformFee,
    };
}

// =============================================================================
// Display Helpers
// =============================================================================

/**
 * Format price range
 */
export function formatPriceRange(min: number, max: number): string {
    if (min === max) {
        return formatCurrency(min);
    }
    return `${formatCurrency(min)} - ${formatCurrency(max)}`;
}

/**
 * Format discount
 */
export function formatDiscount(originalPrice: number, discountedPrice: number): {
    originalFormatted: string;
    discountedFormatted: string;
    savingsFormatted: string;
    percentOff: number;
} {
    const savings = originalPrice - discountedPrice;
    const percentOff = Math.round((savings / originalPrice) * 100);

    return {
        originalFormatted: formatCurrency(originalPrice),
        discountedFormatted: formatCurrency(discountedPrice),
        savingsFormatted: formatCurrency(savings),
        percentOff,
    };
}

// =============================================================================
// Razorpay Helpers
// =============================================================================

/**
 * Convert rupees to paise (for Razorpay)
 */
export function toPaise(rupees: number): number {
    return Math.round(rupees * 100);
}

/**
 * Convert paise to rupees
 */
export function toRupees(paise: number): number {
    return paise / 100;
}

export default {
    formatCurrency,
    formatCompactCurrency,
    parseCurrency,
    calculatePercentage,
    calculateGST,
    extractGSTFromTotal,
    calculatePlatformFee,
    formatPriceRange,
    formatDiscount,
    toPaise,
    toRupees,
    CURRENCY_SYMBOL,
    CURRENCY_CODE,
};
