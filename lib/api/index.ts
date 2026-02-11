/**
 * Rozx Healthcare Platform - API Module Index
 */

export { api, onUnauthorized } from './client';
export type { RequestOptions, ApiResponse, PaginationMeta } from './client';

export { ApiError, getErrorMessage, isErrorCode, handleApiError, withRetry } from './error-handler';

export { endpoints } from './endpoints';

export {
    addRequestInterceptor,
    addResponseInterceptor,
    addErrorInterceptor,
} from './interceptors';

// Public API (for Server Components - no auth required)
export {
    fetchDoctors,
    fetchDoctor,
    fetchFeaturedDoctors,
    fetchHospitals,
    fetchHospital,
    fetchFeaturedHospitals,
    fetchSpecializations,
} from './public';

// Feature APIs
export { patientsApi } from './patients';
export { appointmentsApi } from './appointments';
export type { AppointmentListResponse, CheckAvailabilityResponse, TimeSlot as ApiTimeSlot } from './appointments';

export type {
    PublicDoctor,
    PublicHospital,
    Specialization,
    DoctorFilters as PublicDoctorFilters,
    HospitalFilters as PublicHospitalFilters,
} from './public';
