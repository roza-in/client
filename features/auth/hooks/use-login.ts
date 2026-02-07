/**
 * Login Hook
 * Handles login flow with OTP, password, loading states, and role-based redirect
 */

'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
    loginWithPassword,
    loginWithOTP,
    sendOTP,
    type LoginWithPasswordInput,
    type LoginWithOTPInput,
    type SendOTPInput,
    type AuthResponse,
    ApiError,
    logout,
} from '@/features/auth/api/login';
import { useAuthStore, getRedirectPath } from '@/store/slices/auth.slice';

// =============================================================================
// Types
// =============================================================================

export interface UseLoginReturn {
    // State
    isLoading: boolean;
    error: string | null;
    sessionId: string | null;

    // Password Login
    loginWithEmail: (input: LoginWithPasswordInput) => Promise<boolean>;

    // OTP Login
    sendLoginOTP: (phone: string) => Promise<boolean>;
    verifyLoginOTP: (phone: string, otp: string) => Promise<boolean>;

    // Utilities
    clearError: () => void;
    getSessionId: () => string;
}

export interface UseOTPReturn {
    // State
    isLoading: boolean;
    isSending: boolean;
    error: string | null;
    otpSent: boolean;
    resendCooldown: number;
    sessionId: string | null;

    // Actions
    sendOTP: (input: Omit<SendOTPInput, 'sessionId'>) => Promise<boolean>;
    resetOTPState: () => void;
    getSessionId: () => string;
}

// =============================================================================
// Helper: Generate Session ID
// =============================================================================

function generateSessionId(): string {
    return crypto.randomUUID();
}

// =============================================================================
// useLogin Hook
// =============================================================================

export function useLogin(): UseLoginReturn {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);
    const setError = useAuthStore((state) => state.setError);
    const clearAuthError = useAuthStore((state) => state.clearError);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setLocalError] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);

    /**
     * Get or create session ID for OTP flow
     */
    const getSessionId = useCallback(() => {
        if (sessionId) return sessionId;
        const newSessionId = generateSessionId();
        setSessionId(newSessionId);
        return newSessionId;
    }, [sessionId]);

    /**
     * Handle successful login - store user and redirect
     */
    const handleLoginSuccess = useCallback(
        async (response: AuthResponse) => {
            login(response);

            // Redirect based on role
            const redirectPath = getRedirectPath(response.user.role);

            // Safety check for hospital admins
            if (response.user.role === 'hospital') {
                const hospital = (response.user as any).hospital;
                if (!hospital) {
                    toast.error('Hospital profile setup incomplete.');
                    router.push('/hospital/onboarding');
                    return;
                }
            }

            router.push(redirectPath);
            router.refresh();
        },
        [login, router]
    );

    /**
     * Handle login error
     */
    const handleLoginError = useCallback(
        (err: unknown) => {
            let message = 'Login failed. Please try again.';

            if (err instanceof ApiError) {
                if (err.isAuthError()) {
                    message = 'Invalid credentials. Please check your email and password.';
                } else if (err.isRateLimitError()) {
                    message = 'Too many attempts. Please try again later.';
                } else if (err.isValidationError()) {
                    message = err.message || 'Please check your input.';
                } else {
                    message = err.message;
                }
            } else if (err instanceof Error) {
                message = err.message;
            }

            setLocalError(message);
            setError(message);
            toast.error(message);
        },
        [setError]
    );

    /**
     * Login with email and password
     */
    const loginWithEmail = useCallback(
        async (input: LoginWithPasswordInput): Promise<boolean> => {
            setIsLoading(true);
            setLocalError(null);
            clearAuthError();

            try {
                const response = await loginWithPassword(input);
                handleLoginSuccess(response);
                return true;
            } catch (err) {
                handleLoginError(err);
                return false;
            } finally {
                setIsLoading(false);
            }
        },
        [handleLoginSuccess, handleLoginError, clearAuthError]
    );

    /**
     * Send OTP for login
     */
    const sendLoginOTP = useCallback(
        async (phone: string): Promise<boolean> => {
            setIsLoading(true);
            setLocalError(null);

            try {
                const sid = getSessionId();
                await sendOTP({ phone, purpose: 'login', sessionId: sid });
                toast.success('OTP sent to your phone');
                return true;
            } catch (err) {
                handleLoginError(err);
                return false;
            } finally {
                setIsLoading(false);
            }
        },
        [handleLoginError, getSessionId]
    );

    /**
     * Verify OTP and login
     */
    const verifyLoginOTP = useCallback(
        async (phone: string, otp: string): Promise<boolean> => {
            setIsLoading(true);
            setLocalError(null);
            clearAuthError();

            try {
                const response = await loginWithOTP({ phone, otp, purpose: 'login' });
                handleLoginSuccess(response);
                return true;
            } catch (err) {
                handleLoginError(err);
                return false;
            } finally {
                setIsLoading(false);
            }
        },
        [handleLoginSuccess, handleLoginError, clearAuthError]
    );

    /**
     * Clear error state
     */
    const clearError = useCallback(() => {
        setLocalError(null);
        clearAuthError();
    }, [clearAuthError]);

    return {
        isLoading,
        error,
        sessionId,
        loginWithEmail,
        sendLoginOTP,
        verifyLoginOTP,
        clearError,
        getSessionId,
    };
}

// =============================================================================
// useOTP Hook (for OTP management - used in registration)
// =============================================================================

const OTP_COOLDOWN_SECONDS = 60;

export function useOTP(): UseOTPReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [otpSent, setOtpSent] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [sessionId, setSessionId] = useState<string | null>(null);

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
     * Send OTP
     */
    const handleSendOTP = useCallback(
        async (input: Omit<SendOTPInput, 'sessionId'>): Promise<boolean> => {
            if (resendCooldown > 0) {
                toast.error(`Please wait ${resendCooldown} seconds before resending`);
                return false;
            }

            setIsSending(true);
            setError(null);

            try {
                const sid = getSessionId();
                await sendOTP({ ...input, sessionId: sid });
                setOtpSent(true);
                startCooldown();
                toast.success('OTP sent successfully');
                return true;
            } catch (err) {
                const message = err instanceof ApiError ? err.message : 'Failed to send OTP';
                setError(message);
                toast.error(message);
                return false;
            } finally {
                setIsSending(false);
            }
        },
        [resendCooldown, startCooldown, getSessionId]
    );

    /**
     * Reset OTP state
     */
    const resetOTPState = useCallback(() => {
        setIsLoading(false);
        setIsSending(false);
        setError(null);
        setOtpSent(false);
        setResendCooldown(0);
        setSessionId(null);
    }, []);

    return {
        isLoading,
        isSending,
        error,
        otpSent,
        resendCooldown,
        sessionId,
        sendOTP: handleSendOTP,
        resetOTPState,
        getSessionId,
    };
}

// =============================================================================
// useLogout Hook
// =============================================================================

export function useLogout() {
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = useCallback(async () => {
        setIsLoading(true);
        try {
            await logout();
            toast.success('Logged out successfully');
            router.push('/login');
            router.refresh();
        } catch {
            // Still redirect even if API call fails
            router.push('/login');
            router.refresh();
        } finally {
            setIsLoading(false);
        }
    }, [logout, router]);

    return { logout: handleLogout, isLoading };
}
