/**
 * ROZX Healthcare Platform - Date Utilities
 * 
 * Date formatting and manipulation helpers using date-fns.
 */

import {
    format,
    formatDistance,
    formatRelative,
    parseISO,
    isValid,
    isBefore,
    isAfter,
    isToday,
    isTomorrow,
    isYesterday,
    addDays,
    addMinutes,
    addHours,
    differenceInMinutes,
    differenceInHours,
    differenceInDays,
    startOfDay,
    endOfDay,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    setHours,
    setMinutes,
} from 'date-fns';
import { enIN } from 'date-fns/locale';

// =============================================================================
// Format Constants
// =============================================================================

export const DATE_FORMATS = {
    /** 15 Jan 2025 */
    full: 'd MMM yyyy',
    /** 15/01/2025 */
    numeric: 'dd/MM/yyyy',
    /** 15 Jan */
    short: 'd MMM',
    /** January 15, 2025 */
    long: 'MMMM d, yyyy',
    /** Wed, 15 Jan */
    dayShort: 'EEE, d MMM',
    /** Wednesday, 15 January 2025 */
    dayLong: 'EEEE, d MMMM yyyy',
    /** 02:30 PM */
    time: 'hh:mm a',
    /** 14:30 */
    time24: 'HH:mm',
    /** 15 Jan 2025, 02:30 PM */
    datetime: 'd MMM yyyy, hh:mm a',
    /** 2025-01-15 */
    iso: 'yyyy-MM-dd',
} as const;

// =============================================================================
// Formatting Functions
// =============================================================================

/**
 * Format a date with the specified format
 */
export function formatDate(
    date: Date | string | number,
    formatStr: string = DATE_FORMATS.full
): string {
    const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
    if (!isValid(parsedDate)) return 'Invalid date';
    return format(parsedDate, formatStr, { locale: enIN });
}

/**
 * Format date for display (15 Jan 2025)
 */
export function formatDisplayDate(date: Date | string): string {
    return formatDate(date, DATE_FORMATS.full);
}

/**
 * Format time (02:30 PM)
 */
export function formatTime(date: Date | string): string {
    return formatDate(date, DATE_FORMATS.time);
}

/**
 * Format datetime (15 Jan 2025, 02:30 PM)
 */
export function formatDateTime(date: Date | string): string {
    return formatDate(date, DATE_FORMATS.datetime);
}

/**
 * Format as relative time (2 hours ago, in 3 days)
 */
export function formatRelativeTime(date: Date | string): string {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) return 'Invalid date';
    return formatDistance(parsedDate, new Date(), { addSuffix: true, locale: enIN });
}

/**
 * Format date relative to today (Today, Yesterday, Tomorrow, or date)
 */
export function formatSmartDate(date: Date | string): string {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) return 'Invalid date';

    if (isToday(parsedDate)) return 'Today';
    if (isTomorrow(parsedDate)) return 'Tomorrow';
    if (isYesterday(parsedDate)) return 'Yesterday';

    return formatDate(parsedDate, DATE_FORMATS.dayShort);
}

// =============================================================================
// Time Slot Helpers
// =============================================================================

/**
 * Format a time slot range (02:30 PM - 03:00 PM)
 */
export function formatTimeRange(startTime: string, endTime: string): string {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
}

/**
 * Generate time slots for a day
 */
export function generateTimeSlots(
    startHour: number,
    endHour: number,
    intervalMinutes: number = 30
): string[] {
    const slots: string[] = [];
    let current = new Date();
    current = setHours(current, startHour);
    current = setMinutes(current, 0);

    const end = setHours(new Date(), endHour);

    while (isBefore(current, end)) {
        slots.push(format(current, DATE_FORMATS.time));
        current = addMinutes(current, intervalMinutes);
    }

    return slots;
}

/**
 * Parse time string (10:30 AM) to hours and minutes
 */
export function parseTimeString(timeStr: string): { hours: number; minutes: number } | null {
    const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (!match) return null;

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3]?.toUpperCase();

    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    return { hours, minutes };
}

// =============================================================================
// Date Comparison Helpers
// =============================================================================

/**
 * Check if date is in the past
 */
export function isPast(date: Date | string): boolean {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isBefore(parsedDate, new Date());
}

/**
 * Check if date is in the future
 */
export function isFuture(date: Date | string): boolean {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isAfter(parsedDate, new Date());
}

/**
 * Get duration in human-readable format
 */
export function getDuration(startDate: Date | string, endDate: Date | string): string {
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;

    const minutes = differenceInMinutes(end, start);
    if (minutes < 60) return `${minutes} min`;

    const hours = differenceInHours(end, start);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) return `${hours} hr`;

    return `${hours} hr ${remainingMinutes} min`;
}

// =============================================================================
// Date Range Helpers
// =============================================================================

export function getDateRange(period: 'today' | 'week' | 'month'): { start: Date; end: Date } {
    const now = new Date();

    switch (period) {
        case 'today':
            return { start: startOfDay(now), end: endOfDay(now) };
        case 'week':
            return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
        case 'month':
            return { start: startOfMonth(now), end: endOfMonth(now) };
        default:
            return { start: startOfDay(now), end: endOfDay(now) };
    }
}

// =============================================================================
// Exports
// =============================================================================

export {
    parseISO,
    isValid,
    isBefore,
    isAfter,
    isToday,
    isTomorrow,
    isYesterday,
    addDays,
    addMinutes,
    addHours,
    differenceInMinutes,
    differenceInHours,
    differenceInDays,
    startOfDay,
    endOfDay,
};
