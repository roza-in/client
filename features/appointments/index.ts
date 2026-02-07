/**
 * Appointments Feature Exports
 */

// API
export {
    bookingApi,
    bookAppointment,
    lockSlot,
    releaseSlot,
    executeBookingFlow,
    verifyPaymentAndConfirm,
    checkSlotAvailability,
    getDoctorAvailability
} from './api/book-appointment';

export {
    cancelAppointment,
    rescheduleAppointment,
    checkInAppointment,
    completeAppointment,
    addAppointmentVitals
} from './api/manage-appointment';

export {
    getAvailableSlots,
    getWeeklyAvailability,
    getConsultationFeeBreakdown
} from './api/get-slots';

// Hooks
export { useAppointments } from './hooks/use-appointments';
export { useAvailableSlots, useWeeklyAvailability, slotKeys } from './hooks/use-available-slots';
export { useConsultationFee } from './hooks/use-consultation-fee';

// Types
export * from './types';

// Schemas
export {
    bookAppointmentSchema,
    rescheduleAppointmentSchema,
    cancelAppointmentSchema,
    checkInAppointmentSchema,
    addVitalsSchema,
    completeAppointmentSchema,
    appointmentFilterSchema,
    availabilityCheckSchema,
    lockSlotSchema,
} from './schemas';
