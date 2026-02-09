/**
 * Appointments Feature - Schemas
 */

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
} from '@/lib/validations';

export type {
    CheckInAppointmentInput,
    AddVitalsInput,
    CompleteAppointmentInput,
    AppointmentFilterInput,
    AvailabilityCheckInput,
} from '@/lib/validations';
