export type {
    Appointment,
    AppointmentListItem,
    AppointmentWithDetails,
    AppointmentVitals,
    TimeSlot,
    DayAvailability,
} from '@/types';

export type {
    CancelAppointmentInput,
    RescheduleAppointmentInput,
    AppointmentActionResult,
} from './api/manage-appointment';

export type {
    GetSlotsInput,
    AvailabilityResponse,
    WeekAvailabilityResponse,
} from './api/get-slots';

export type {
    BookAppointmentInput,
    LockSlotInput,
    LockSlotResponse,
    BookingResponse,
    PaymentVerificationInput,
    PaymentVerificationResponse,
    CompleteBookingInput,
    CompleteBookingResult,
} from './api/book-appointment';

export type { AppointmentFilters } from './hooks/use-appointments';
