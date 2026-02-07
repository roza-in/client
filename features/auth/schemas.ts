/**
 * Auth Feature - Validation Schemas
 */

// Re-export from lib validations
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
} from '@/lib/validations';

export type {
    LoginWithEmailInput,
    LoginWithPhoneInput,
    VerifyOTPInput,
    ForgotPasswordInput,
    ResetPasswordInput,
    ChangePasswordInput,
} from '@/lib/validations';
