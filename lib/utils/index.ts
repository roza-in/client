/**
 * ROZX Healthcare Platform - Utils Module Index
 */

export { cn } from './cn';

export {
    DATE_FORMATS,
    formatDate,
    formatDisplayDate,
    formatTime,
    formatDateTime,
    formatRelativeTime,
    formatSmartDate,
    formatTimeRange,
    generateTimeSlots,
    parseTimeString,
    isPast,
    isFuture,
    getDuration,
    getDateRange,
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
} from './date';

export {
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
} from './currency';

export {
    isValidPhone,
    cleanPhone,
    formatPhone,
    formatPhoneForAPI,
    maskPhone,
    getPhoneLast4,
    formatPhoneInput,
    getPhoneInputValue,
} from './phone';

export {
    FILE_TYPES,
    MAX_FILE_SIZES,
    isValidFileType,
    isValidFileSize,
    validateFile,
    formatFileSize,
    getFileExtension,
    getFileName,
    generateUniqueFileName,
    fileToBase64,
    base64ToBlob,
    downloadBlob,
    downloadFromUrl,
    getImageDimensions,
    compressImage,
} from './file';

export {
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
} from './format';
