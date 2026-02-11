/**
 * Rozx Healthcare Platform - Constants Module Index
 */

export * from './routes';

export {
    UserRole,
    ROLE_LABELS,
    ROLE_COLORS,
    ROLE_ICONS,
    ROLE_HIERARCHY,
    getRoleLabel,
    getRoleColor,
    isValidRole,
    compareRoles,
} from './roles';
export type { UserRoleType } from './roles';

export {
    AppointmentStatus,
    APPOINTMENT_STATUS_LABELS,
    APPOINTMENT_STATUS_COLORS,
    ConsultationType,
    CONSULTATION_TYPE_LABELS,
    CONSULTATION_TYPE_ICONS,
    getAppointmentStatusLabel,
    getAppointmentStatusColors,
    isActiveAppointment,
    isCompletedAppointment,
    canCancelAppointment,
    canRescheduleAppointment,
} from './appointment-status';
export type { AppointmentStatusType, ConsultationTypeValue } from './appointment-status';

export {
    PaymentStatus,
    PAYMENT_STATUS_LABELS,
    PAYMENT_STATUS_COLORS,
    PaymentMethod,
    PAYMENT_METHOD_LABELS,
    PAYMENT_METHOD_ICONS,
    RefundStatus,
    REFUND_STATUS_LABELS,
    getPaymentStatusLabel,
    getPaymentStatusColors,
    isSuccessfulPayment,
    isRefundable,
    canRetryPayment,
} from './payment-status';
export type { PaymentStatusType, PaymentMethodType, RefundStatusType } from './payment-status';

export {
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
} from './config';
