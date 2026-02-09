/**
 * Auth Feature - Registration Hook
 * OTP-first registration flow with session management
 */

'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
    registerPatient,
    registerHospital,
    completeUserRegistration,
    registerHospitalProfile,
    registerHospitalCompliance,
    registerHospitalAddress,
    verifyEmail,
    forgotPassword,
    resetPassword,
    type RegisterPatientInput,
    type RegisterHospitalInput,
    type CompleteUserRegistrationInput,
    type RegisterHospitalProfileInput,
    type RegisterHospitalComplianceInput,
    type RegisterHospitalAddressInput,
    type RegisterResponse,
} from '../api/register';
import { sendOTP, type SendOTPInput } from '../api/login';
import { api, endpoints } from '@/lib/api';
import { useAuthStore } from '@/store';
import { routes } from '@/config';
import { getErrorMessage } from '@/lib/api';

// =============================================================================
// Types
// =============================================================================

export interface UseRegisterReturn {
    // State
    isLoading: boolean;
    isSendingOTP: boolean;
    isVerifyingOTP: boolean;
    error: string | null;
    otpSent: boolean;
    otpVerified: boolean;
    sessionId: string | null;
    resendCooldown: number;

    // OTP Actions
    sendRegistrationOTP: (phone: string) => Promise<boolean>;
    verifyRegistrationOTP: (phone: string, otp: string) => Promise<boolean>;

    // Registration Actions
    registerPatient: (input: RegisterPatientInput) => Promise<RegisterResponse | undefined>;
    registerHospital: (input: RegisterHospitalInput) => Promise<RegisterResponse | undefined>;
    completeUserRegistration: (input: CompleteUserRegistrationInput) => Promise<RegisterResponse | undefined>;
    registerHospitalProfile: (input: RegisterHospitalProfileInput) => Promise<boolean>;
    registerHospitalCompliance: (input: RegisterHospitalComplianceInput) => Promise<boolean>;
    registerHospitalAddress: (input: RegisterHospitalAddressInput) => Promise<boolean>;

    // Utilities
    clearError: () => void;
    resetState: () => void;
}

// =============================================================================
// Helper
// =============================================================================

function generateSessionId(): string {
    return crypto.randomUUID();
}

const OTP_COOLDOWN_SECONDS = 60;

// =============================================================================
// Hook Implementation
// =============================================================================

export function useRegister(): UseRegisterReturn {
    const router = useRouter();
    const { user, setUser, login } = useAuthStore();

    // State
    const [isLoading, setIsLoading] = useState(false);
    const [isSendingOTP, setIsSendingOTP] = useState(false);
    const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [resendCooldown, setResendCooldown] = useState(0);

    /**
     * Get or create session ID
     */
    const getSessionId = useCallback(() => {
        if (sessionId) return sessionId;
        const newSessionId = generateSessionId();
        setSessionId(newSessionId);
        return newSessionId;
    }, [sessionId]);

    /**
     * Start cooldown timer
     */
    const startCooldown = useCallback(() => {
        setResendCooldown(OTP_COOLDOWN_SECONDS);

        const interval = setInterval(() => {
            setResendCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, []);

    /**
     * Send OTP for registration
     */
    const sendRegistrationOTP = useCallback(
        async (phone: string): Promise<boolean> => {
            if (resendCooldown > 0) {
                toast.error(`Please wait ${resendCooldown} seconds before resending`);
                return false;
            }

            setIsSendingOTP(true);
            setError(null);

            try {
                const sid = getSessionId();
                await sendOTP({
                    phone,
                    purpose: 'registration',
                    sessionId: sid
                });
                setOtpSent(true);
                startCooldown();
                return true;
            } catch (err) {
                const message = getErrorMessage(err);
                setError(message);
                toast.error(message);
                return false;
            } finally {
                setIsSendingOTP(false);
            }
        },
        [resendCooldown, startCooldown, getSessionId]
    );

    /**
     * Verify registration OTP (without consuming it)
     */
    const handleVerifyRegistrationOTP = useCallback(
        async (phone: string, otp: string): Promise<boolean> => {
            setIsVerifyingOTP(true);
            setError(null);

            try {
                await api.post<{ valid: boolean }>(
                    endpoints.auth.validateRegistrationOTP,
                    { phone, otp },
                    { skipErrorToast: true } as any
                );
                setOtpVerified(true);
                return true;
            } catch (err) {
                const message = getErrorMessage(err);
                setError(message);
                toast.error(message);
                return false;
            } finally {
                setIsVerifyingOTP(false);
            }
        },
        []
    );

    /**
     * Register patient with OTP verification
     */
    const handleRegisterPatient = useCallback(
        async (input: RegisterPatientInput): Promise<RegisterResponse | undefined> => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await registerPatient(input);

                // Auto-login after successful registration
                if (response.tokens) {
                    login({ user: response.user, tokens: response.tokens, isNewUser: true });
                    router.push(routes.patient.dashboard);
                    router.refresh();
                } else {
                    router.push(routes.public.login);
                }

                return response;
            } catch (err) {
                const message = getErrorMessage(err);
                setError(message);
                toast.error(message);
                return undefined;
            } finally {
                setIsLoading(false);
            }
        },
        [login, router]
    );

    /**
     * Register hospital with OTP verification
     */
    const handleRegisterHospital = useCallback(
        async (input: RegisterHospitalInput): Promise<RegisterResponse | undefined> => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await registerHospital(input);

                // Auto-login after successful registration
                if (response.tokens) {
                    login({ user: response.user, tokens: response.tokens, isNewUser: true });
                    router.push(routes.hospital.dashboard);
                    router.refresh();
                } else {
                    router.push(routes.public.login);
                }

                return response;
            } catch (err) {
                const message = getErrorMessage(err);
                setError(message);
                toast.error(message);
                return undefined;
            } finally {
                setIsLoading(false);
            }
        },
        [login, router]
    );

    /**
     * Complete initial user registration (Step 2)
     */
    const handleCompleteUserRegistration = useCallback(
        async (input: CompleteUserRegistrationInput): Promise<RegisterResponse | undefined> => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await completeUserRegistration(input);

                // Auto-login after successful registration
                if (response.tokens) {
                    login({ user: response.user, tokens: response.tokens, isNewUser: true });
                    // For hospitals, we stay on register page but advance step
                    // For patients, we redirect to dashboard
                    if (input.role === 'patient') {
                        router.push(routes.patient.dashboard);
                        router.refresh();
                    }
                }

                return response;
            } catch (err) {
                const message = getErrorMessage(err);
                setError(message);
                toast.error(message);
                return undefined;
            } finally {
                setIsLoading(false);
            }
        },
        [login, router]
    );

    /**
     * Register hospital profile (Step 3)
     */
    const handleRegisterHospitalProfile = useCallback(
        async (input: RegisterHospitalProfileInput): Promise<boolean> => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await registerHospitalProfile(input);
                if (response && user) {
                    setUser({
                        ...user,
                        hospital: response
                    });
                }
                return true;
            } catch (err) {
                const message = getErrorMessage(err);
                setError(message);
                toast.error(message);
                return false;
            } finally {
                setIsLoading(false);
            }
        },
        [user, setUser]
    );

    /**
     * Register hospital compliance (Step 4)
     */
    const handleRegisterHospitalCompliance = useCallback(
        async (input: RegisterHospitalComplianceInput): Promise<boolean> => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await registerHospitalCompliance(input);
                if (response && user) {
                    setUser({
                        ...user,
                        hospital: response
                    });
                }
                return true;
            } catch (err) {
                const message = getErrorMessage(err);
                setError(message);
                toast.error(message);
                return false;
            } finally {
                setIsLoading(false);
            }
        },
        [user, setUser]
    );

    /**
     * Register hospital address (Step 5)
     */
    const handleRegisterHospitalAddress = useCallback(
        async (input: RegisterHospitalAddressInput): Promise<boolean> => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await registerHospitalAddress(input);
                if (response && user) {
                    setUser({
                        ...user,
                        hospital: response
                    });
                }
                // Last step, redirect to hospital dashboard
                router.push(routes.hospital.dashboard);
                router.refresh();
                return true;
            } catch (err) {
                const message = getErrorMessage(err);
                setError(message);
                toast.error(message);
                return false;
            } finally {
                setIsLoading(false);
            }
        },
        [router, user, setUser]
    );

    /**
     * Clear error state
     */
    const clearError = useCallback(() => setError(null), []);

    /**
     * Reset all state
     */
    const resetState = useCallback(() => {
        setIsLoading(false);
        setIsSendingOTP(false);
        setError(null);
        setOtpSent(false);
        setOtpVerified(false);
        setSessionId(null);
        setResendCooldown(0);
    }, []);

    return {
        isLoading,
        isSendingOTP,
        isVerifyingOTP,
        error,
        otpSent,
        otpVerified,
        sessionId,
        resendCooldown,
        sendRegistrationOTP,
        verifyRegistrationOTP: handleVerifyRegistrationOTP,
        registerPatient: handleRegisterPatient,
        registerHospital: handleRegisterHospital,
        completeUserRegistration: handleCompleteUserRegistration,
        registerHospitalProfile: handleRegisterHospitalProfile,
        registerHospitalCompliance: handleRegisterHospitalCompliance,
        registerHospitalAddress: handleRegisterHospitalAddress,
        clearError,
        resetState,
    };
}

// =============================================================================
// Additional Hooks
// =============================================================================

export function useVerifyEmail() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const verify = useCallback(async (token: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await verifyEmail(token);
            toast.success('Email verified successfully!');
            return result;
        } catch (err) {
            const message = getErrorMessage(err);
            setError(message);
            toast.error(message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { verify, isLoading, error };
}

export function useForgotPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);

    const sendResetEmail = useCallback(async (email: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await forgotPassword(email);
            setSent(true);
            toast.success('Password reset email sent!');
            return true;
        } catch (err) {
            const message = getErrorMessage(err);
            setError(message);
            toast.error(message);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { sendResetEmail, isLoading, error, sent };
}

export function useResetPassword() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const reset = useCallback(async (token: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await resetPassword(token, password);
            toast.success('Password reset successfully!');
            router.push(routes.public.login);
            return true;
        } catch (err) {
            const message = getErrorMessage(err);
            setError(message);
            toast.error(message);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    return { reset, isLoading, error };
}
