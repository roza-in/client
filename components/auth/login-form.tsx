/**
 * Auth Components - Login Form
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, Phone, ArrowRight, Edit2, Key } from 'lucide-react';
import { useLogin, useOTP } from '@/features/auth';
import { getGoogleOAuthUrl } from '@/features/auth/api/login';
import { cn } from '@/lib/utils';
import { routes } from '@/config';
import { LoadingSpinner } from '@/components/shared';
import { toast } from 'sonner';

// =============================================================================
// Schemas
// =============================================================================

const emailLoginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

const phoneLoginSchema = z.object({
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
});

const otpSchema = z.object({
    otp: z.string().length(6, 'OTP must be 6 digits'),
});

type EmailLoginData = z.infer<typeof emailLoginSchema>;
type PhoneLoginData = z.infer<typeof phoneLoginSchema>;
type OTPData = z.infer<typeof otpSchema>;

// =============================================================================
// Component
// =============================================================================

export function LoginForm() {
    const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('phone');
    const [showPassword, setShowPassword] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const {
        loginWithEmail,
        verifyLoginOTP,
        isLoading: isEmailLoading,
        error,
    } = useLogin();
    const { sendOTP, isLoading: isOTPLoading, error: otpError } = useOTP();

    const emailForm = useForm<EmailLoginData>({
        resolver: zodResolver(emailLoginSchema),
    });

    const phoneForm = useForm<PhoneLoginData>({
        resolver: zodResolver(phoneLoginSchema),
    });

    const otpForm = useForm<OTPData>({
        resolver: zodResolver(otpSchema),
    });

    const handleEmailLogin = async (data: EmailLoginData) => {
        await loginWithEmail({ email: data.email, password: data.password });
    };

    const handleSendOTP = async (data: PhoneLoginData) => {
        const formattedPhone = `+91${data.phone}`;
        setPhoneNumber(formattedPhone);
        const success = await sendOTP({ phone: formattedPhone, purpose: 'login' });
        if (success) setOtpSent(true);
    };

    const handleVerifyOTP = async (data: OTPData) => {
        await verifyLoginOTP(phoneNumber, data.otp);
    };

    const handleGoogleLogin = async () => {
        try {
            setIsGoogleLoading(true);

            // basic callback URL
            let callbackUrl = `${window.location.origin}/callback`;

            // Check for redirect param in current URL and append it to callback
            const params = new URLSearchParams(window.location.search);
            const redirectParams = params.get('redirect');
            if (redirectParams) {
                callbackUrl += `?redirect=${encodeURIComponent(redirectParams)}`;
            }

            const { url } = await getGoogleOAuthUrl(callbackUrl);
            window.location.href = url;
        } catch (err) {
            toast.error('Failed to initiate Google login. Please try again.');
            setIsGoogleLoading(false);
        }
    };


    return (
        <div className="w-full">
            <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Welcome Back</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    Access your health journey with ROZX.
                </p>
            </div>

            {/* Login Method Tabs */}
            <div className="flex rounded-xl border bg-muted/50 p-1 mb-6">

                <button
                    type="button"
                    onClick={() => {
                        setLoginMethod('phone');
                        setOtpSent(false);
                    }}
                    className={cn(
                        'flex-1 rounded-lg py-2 text-sm font-semibold transition-all',
                        loginMethod === 'phone'
                            ? 'bg-white text-primary shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                    )}
                >
                    Phone OTP
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setLoginMethod('email');
                        setOtpSent(false);
                    }}
                    className={cn(
                        'flex-1 rounded-lg py-2 text-sm font-semibold transition-all',
                        loginMethod === 'email'
                            ? 'bg-white text-primary shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                    )}
                >
                    Email login
                </button>
            </div>

            {/* Email Login Form */}
            {loginMethod === 'email' && (
                <form onSubmit={emailForm.handleSubmit(handleEmailLogin)} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                {...emailForm.register('email')}
                                type="email"
                                placeholder="john@example.com"
                                className={cn(
                                    "w-full rounded-xl border bg-background py-3 pl-10 pr-4 text-sm transition-all shadow-xs",
                                    "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                                    emailForm.formState.errors.email && "border-destructive focus:ring-destructive/20"
                                )}
                            />
                        </div>
                        {emailForm.formState.errors.email && (
                            <p className="text-xs font-medium text-destructive mt-1 animate-slide-down">
                                {emailForm.formState.errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                {...emailForm.register('password')}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                className={cn(
                                    "w-full rounded-xl border bg-background py-3 pl-10 pr-10 text-sm transition-all shadow-xs",
                                    "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                                    emailForm.formState.errors.password && "border-destructive focus:ring-destructive/20"
                                )}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {emailForm.formState.errors.password && (
                            <p className="text-xs font-medium text-destructive mt-1 animate-slide-down">
                                {emailForm.formState.errors.password.message}
                            </p>
                        )}
                    </div>

                    {error && (
                        <div className="rounded-xl bg-destructive/10 p-3 text-sm font-medium text-destructive text-center animate-shake">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isEmailLoading}
                        className={cn(
                            "w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all",
                            "hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99]",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            "flex items-center justify-center gap-2"
                        )}
                    >
                        {isEmailLoading ? (
                            <LoadingSpinner size="sm" className="text-white" />
                        ) : (
                            <>
                                <span>Sign In</span>
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </button>
                </form>
            )}

            {/* Phone Login Form */}
            {loginMethod === 'phone' && !otpSent && (
                <form onSubmit={phoneForm.handleSubmit(handleSendOTP)} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                        <div className="relative flex">
                            <div className="flex items-center rounded-l-xl border border-r-0 bg-muted px-3 text-sm font-medium text-muted-foreground">
                                +91
                            </div>
                            <div className="relative flex-1">
                                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    {...phoneForm.register('phone')}
                                    type="tel"
                                    placeholder="9876543210"
                                    maxLength={10}
                                    className={cn(
                                        "w-full rounded-r-xl border bg-background py-3 pl-10 pr-4 text-sm transition-all shadow-xs",
                                        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                                        phoneForm.formState.errors.phone && "border-destructive focus:ring-destructive/20"
                                    )}
                                />
                            </div>
                        </div>
                        {phoneForm.formState.errors.phone && (
                            <p className="text-xs font-medium text-destructive mt-1 animate-slide-down">
                                {phoneForm.formState.errors.phone.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isOTPLoading}
                        className={cn(
                            "w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all",
                            "hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99]",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            "flex items-center justify-center gap-2"
                        )}
                    >
                        {isOTPLoading ? (
                            <LoadingSpinner size="sm" className="text-white" />
                        ) : (
                            <>
                                <span>Send OTP</span>
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </button>
                </form>
            )}

            {/* OTP Verification Form */}
            {loginMethod === 'phone' && otpSent && (
                <form onSubmit={otpForm.handleSubmit(handleVerifyOTP)} className="space-y-6">
                    <div className="flex flex-col items-center justify-center gap-1 text-center mb-2">
                        <p className="text-sm font-medium text-muted-foreground">
                            Enter the 6-digit code sent to
                        </p>
                        <span className="text-base font-bold text-gray-900">{phoneNumber}</span>
                    </div>

                    <div className="relative space-y-1.5">
                        <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            {...otpForm.register('otp')}
                            type="text"
                            maxLength={6}
                            placeholder="Enter OTP"
                            className={cn(
                                "w-full rounded-xl border bg-background py-3 pl-10 text-sm tracking-widest font-mono shadow-xs transition-all",
                                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                                otpForm.formState.errors.otp && "border-destructive focus:ring-destructive/20"
                            )}
                        />
                        {otpForm.formState.errors.otp && (
                            <p className="text-xs font-medium text-destructive text-center mt-1 animate-slide-down">
                                {otpForm.formState.errors.otp.message}
                            </p>
                        )}
                    </div>

                    {otpError && (
                        <div className="rounded-xl bg-destructive/10 p-3 text-sm font-medium text-destructive text-center animate-shake">
                            {otpError}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isOTPLoading}
                        className={cn(
                            "w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all",
                            "hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99]",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            "flex items-center justify-center gap-2"
                        )}
                    >
                        {isOTPLoading ? <LoadingSpinner size="sm" className="text-white" /> : 'Verify & Continue'}
                    </button>

                    <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="w-full text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
                    >
                        Use a different number
                    </button>
                </form>
            )}

            {/* Divider */}
            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100" />
                </div>
                <div className="relative flex justify-center text-xs uppercase font-bold text-muted-foreground tracking-widest">
                    <span className="bg-white px-4">Secure Sign In</span>
                </div>
            </div>

            {/* Social Login */}
            <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                className={cn(
                    "group w-full flex items-center justify-center gap-3 rounded-xl border bg-white py-3 text-sm font-bold text-gray-700 shadow-sm transition-all",
                    "hover:bg-gray-50 hover:border-gray-300 active:scale-[0.99]",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
            >
                {isGoogleLoading ? (
                    <LoadingSpinner size="sm" />
                ) : (
                    <svg className="h-5 w-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                )}
                {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
            </button>

            {/* Register Link */}
            <div className="mt-8 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href={routes.public.register} className="font-bold text-primary hover:underline transition-colors">
                    Create account
                </Link>
            </div>
        </div>
    );
}

export default LoginForm;
