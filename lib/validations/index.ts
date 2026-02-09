/**
 * ROZX Healthcare Platform - Validations Module Index
 */

// Common schemas
export {
    uuidSchema,
    emailSchema,
    phoneSchema,
    passwordSchema,
    otpSchema,
    urlSchema,
    pincodeSchema,
    dateStringSchema,
    futureDateSchema,
    pastDateSchema,
    dateOfBirthSchema,
    paginationSchema,
    sortSchema,
    dateRangeSchema,
    addressSchema,
    coordinatesSchema,
    imageFileSchema,
    documentFileSchema,
    optional,
    arrayOf,
} from './common';

// Auth schemas
export {
    loginWithEmailSchema,
    loginWithPhoneSchema,
    verifyOTPSchema,
    registerPatientSchema,
    registerDoctorSchema,
    registerHospitalSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
} from './auth';
export type {
    LoginWithEmailInput,
    LoginWithPhoneInput,
    VerifyOTPInput,
    RegisterPatientInput,
    RegisterDoctorInput,
    RegisterHospitalInput,
    ForgotPasswordInput,
    ResetPasswordInput,
    ChangePasswordInput,
} from './auth';

// Appointment schemas
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
} from './appointment';
export type {
    BookAppointmentInput,
    RescheduleAppointmentInput,
    CancelAppointmentInput,
    CheckInAppointmentInput,
    AddVitalsInput,
    CompleteAppointmentInput,
    AppointmentFilterInput,
    AvailabilityCheckInput,
    LockSlotInput,
} from './appointment';

// Prescription schemas
export {
    medicationSchema,
    labTestSchema,
    createPrescriptionSchema,
    updatePrescriptionSchema,
    prescriptionFilterSchema,
} from './prescription';
export type {
    MedicationInput,
    LabTestInput,
    CreatePrescriptionInput,
    UpdatePrescriptionInput,
    PrescriptionFilterInput,
} from './prescription';
