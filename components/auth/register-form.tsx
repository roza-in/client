/**
 * Auth Components - Register Form
 * OTP-first registration flow: Phone → OTP → Complete Profile
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Hospital, Building2, ChevronRight, MapPin, FileText, CheckCircle2, Key, Navigation, Map, Hash } from 'lucide-react';
import { useRegister } from '@/features/auth';
import { getGoogleOAuthUrl } from '@/features/auth/api/login';
import { cn } from '@/lib/utils';
import { routes } from '@/config';
import { LoadingSpinner } from '@/components/shared';
import { toast } from 'sonner';

// =============================================================================
// Schemas for Multi-step Registration
// =============================================================================

const step1Schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
    email: z.string().email('Email is required'),
    role: z.enum(['patient', 'hospital']),
});

const step2Schema = z.object({
    otp: z.string().length(6, 'OTP must be 6 digits'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain an uppercase letter')
        .regex(/[0-9]/, 'Password must contain a number'),
    confirmPassword: z.string(),
    terms: z.boolean().refine(val => val === true, 'You must accept the terms'),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const step3HospitalSchema = z.object({
    hospitalName: z.string().min(2, 'Hospital name must be at least 2 characters'),
    hospitalType: z.string().min(1, 'Select hospital type'),
    description: z.string().max(2000).optional().nullable(),
    hospitalPhone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
    hospitalEmail: z.string().email('Hospital email is required'),
});

const step4HospitalSchema = z.object({
    registrationNumber: z.string().min(2, 'Registration number is required'),
    gstin: z.string().optional().nullable(),
    pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Enter a valid PAN (e.g. ABCDE1234F)'),
});

const step5HospitalSchema = z.object({
    address: z.string().min(5, 'Address is required'),
    landmark: z.string().optional().nullable(),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pincode: z.string().regex(/^[1-9][0-9]{5}$/, 'Invalid 6-digit pincode'),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3HospitalSchema>;
type Step4Data = z.infer<typeof step4HospitalSchema>;
type Step5Data = z.infer<typeof step5HospitalSchema>;

type RegistrationData = Partial<Step1Data & Step2Data & Step3Data & Step4Data & Step5Data>;

// =============================================================================
// Component
// =============================================================================

type RegistrationStep = 1 | 2 | 3 | 4 | 5;

export function RegisterForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const handleRoleChange = (role: 'patient' | 'hospital') => {
        form1.setValue('role', role);
        const params = new URLSearchParams(searchParams.toString());
        params.set('role', role);
        router.replace(`${pathname}?${params.toString()}`);
    };
    const roleParam = searchParams.get('role');
    const [step, setStep] = useState<RegistrationStep>(1);
    const [showPassword, setShowPassword] = useState(false);
    const [accumulatedData, setAccumulatedData] = useState<RegistrationData>({});

    const {
        sendRegistrationOTP,
        completeUserRegistration,
        registerHospitalProfile,
        registerHospitalCompliance,
        registerHospitalAddress,
        isLoading,
        isSendingOTP,
        error,
        clearError,
    } = useRegister();

    // Forms for each step
    const form1 = useForm<Step1Data>({
        resolver: zodResolver(step1Schema),
        defaultValues: {
            name: '',
            phone: '',
            email: '',
            role: (searchParams.get('role') || (searchParams.get('type') === 'hospital' ? 'hospital' : 'patient')) as any,
        },
    });

    const form2 = useForm<Step2Data>({
        resolver: zodResolver(step2Schema),
        defaultValues: { otp: '', password: '', confirmPassword: '', terms: false },
    });

    const form3 = useForm<Step3Data>({
        resolver: zodResolver(step3HospitalSchema),
        defaultValues: { hospitalName: '', hospitalType: '', description: '', hospitalPhone: '', hospitalEmail: '' },
    });

    const form4 = useForm<Step4Data>({
        resolver: zodResolver(step4HospitalSchema),
        defaultValues: { registrationNumber: '', gstin: '', pan: '' },
    });

    const form5 = useForm<Step5Data>({
        resolver: zodResolver(step5HospitalSchema),
        defaultValues: { address: '', landmark: '', city: '', state: '', pincode: '' },
    });

    // Step 1: Initiate & Send OTP
    const onStep1Submit = async (data: Step1Data) => {
        clearError();
        const formattedPhone = `+91${data.phone}`;
        const success = await sendRegistrationOTP(formattedPhone);
        if (success) {
            setAccumulatedData(data);
            setStep(2);
        }
    };

    // Step 2: Verify & Complete User
    const onStep2Submit = async (data: Step2Data) => {
        clearError();
        const res = await completeUserRegistration({
            phone: `+91${accumulatedData.phone}`,
            otp: data.otp,
            password: data.password,
            name: accumulatedData.name || '',
            email: accumulatedData.email || '',
            role: accumulatedData.role || 'patient',
        });

        if (res) {
            if (accumulatedData.role === 'hospital') {
                setStep(3);
            }
            // Patient is handled by auto-redirect in useRegister
        }
    };

    // Step 3: Hospital Profile
    const onStep3Submit = async (data: Step3Data) => {
        const success = await registerHospitalProfile({
            name: data.hospitalName,
            type: data.hospitalType,
            description: data.description || '',
            phone: data.hospitalPhone || '',
            email: data.hospitalEmail || '',
        });
        if (success) {
            setAccumulatedData(prev => ({ ...prev, ...data }));
            setStep(4);
            clearError();
        }
    };

    // Step 4: Hospital Compliance
    const onStep4Submit = async (data: Step4Data) => {
        clearError();
        const success = await registerHospitalCompliance(data);
        if (success) setStep(5);
    };

    // Step 5: Hospital Address
    const onStep5Submit = async (data: Step5Data) => {
        clearError();
        await registerHospitalAddress(data);
        // Redirect handled by useRegister
    };

    const goBack = () => {
        if (step > 1) setStep((step - 1) as RegistrationStep);
        clearError();
    };

    // Google OAuth Sign Up
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const handleGoogleSignUp = async () => {
        try {
            setIsGoogleLoading(true);
            const callbackUrl = `${window.location.origin}/callback`;
            const { url } = await getGoogleOAuthUrl(callbackUrl);
            window.location.href = url;
        } catch (err) {
            toast.error('Failed to connect with Google. Please try again.');
            setIsGoogleLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto relative">
            {/* Back Button */}
            {step > 1 && (
                <button
                    onClick={goBack}
                    className="absolute -left-12 top-0 p-2 text-muted-foreground hover:text-primary transition-colors hidden md:block"
                    aria-label="Go back"
                >
                    <ArrowRight className="h-5 w-5 rotate-180" />
                </button>
            )}

            {/* Mobile Back Button */}
            {step > 1 && (
                <button
                    onClick={goBack}
                    className="mb-4 text-sm text-muted-foreground hover:text-primary flex items-center gap-1 md:hidden"
                >
                    <ArrowRight className="h-4 w-4 rotate-180" />
                    <span>Back</span>
                </button>
            )}

            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-2 mb-8">
                {[1, 2, 3, 4, 5].map((s) => {
                    const currentRole = step === 1 ? form1.watch('role') : accumulatedData.role;
                    // Hide hospital steps if patient
                    if (currentRole === 'patient' && s > 2) return null;

                    return (
                        <div key={s} className="flex items-center">
                            <div
                                className={cn(
                                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all',
                                    step === s
                                        ? 'bg-primary text-primary-foreground'
                                        : step > s
                                            ? 'bg-primary/20 text-primary'
                                            : 'bg-muted text-muted-foreground'
                                )}
                            >
                                {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
                            </div>
                            {s < (currentRole === 'patient' ? 2 : 5) && (
                                <div
                                    className={cn(
                                        'w-8 h-0.5 mx-1',
                                        step > s ? 'bg-primary/50' : 'bg-muted'
                                    )}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 rounded-xl bg-destructive/10 p-3 text-sm font-medium text-destructive text-center">
                    {error}
                </div>
            )}

            {/* Step 1: Basic Info */}
            {step === 1 && (
                <form onSubmit={form1.handleSubmit(onStep1Submit)} className="space-y-6">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Create Your Account</h2>
                        <p className="mt-2 text-sm text-muted-foreground">Join ROZX Healthcare platform</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">I am a</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => handleRoleChange('patient')}
                                    className={cn(
                                        "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                                        form1.watch('role') === 'patient' ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:border-primary/50"
                                    )}
                                >
                                    <User className={cn("h-6 w-6", form1.watch('role') === 'patient' ? "text-primary" : "text-muted-foreground")} />
                                    <span className="text-sm font-medium">Patient</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleRoleChange('hospital')}
                                    className={cn(
                                        "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                                        form1.watch('role') === 'hospital' ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:border-primary/50"
                                    )}
                                >
                                    <Hospital className={cn("h-6 w-6", form1.watch('role') === 'hospital' ? "text-primary" : "text-muted-foreground")} />
                                    <span className="text-sm font-medium">Hospital</span>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    {...form1.register('name')}
                                    className={cn(
                                        "w-full rounded-xl border bg-background py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all",
                                        form1.formState.errors.name && "border-destructive"
                                    )}
                                    placeholder="Enter your name"
                                />
                            </div>
                            {form1.formState.errors.name && <p className="text-xs text-destructive">{form1.formState.errors.name.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    {...form1.register('email')}
                                    className={cn(
                                        "w-full rounded-xl border bg-background py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all",
                                        form1.formState.errors.email && "border-destructive"
                                    )}
                                    placeholder="yourname@example.com"
                                />
                            </div>
                            {form1.formState.errors.email && <p className="text-xs text-destructive">{form1.formState.errors.email.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                            <div className="relative flex">
                                <div className="flex items-center rounded-l-xl border border-r-0 bg-muted px-3 text-sm font-medium text-muted-foreground">+91</div>
                                <input
                                    {...form1.register('phone')}
                                    maxLength={10}
                                    className={cn(
                                        "w-full rounded-r-xl border bg-background py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all",
                                        form1.formState.errors.phone && "border-destructive"
                                    )}
                                    placeholder="9876543210"
                                />
                            </div>
                            {form1.formState.errors.phone && <p className="text-xs text-destructive">{form1.formState.errors.phone.message}</p>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSendingOTP}
                        className="w-full bg-primary text-white py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {isSendingOTP ? <LoadingSpinner size="sm" /> : <>Continue <ArrowRight size={18} /></>}
                    </button>

                    {form1.watch('role') === 'patient' && (
                        <>
                            <div className="relative py-2">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-muted-foreground">Or</span></div>
                            </div>
                            <button
                                type="button"
                                onClick={handleGoogleSignUp}
                                className="w-full flex items-center justify-center gap-3 py-3 border rounded-xl font-semibold hover:bg-gray-50 transition-all"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Continue with Google
                            </button>
                        </>
                    )}

                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account? <Link href={routes.public.login} className="text-primary font-bold hover:underline">Sign In</Link>
                    </p>
                </form>
            )}

            {/* Step 2: OTP & Password */}
            {step === 2 && (
                <form onSubmit={form2.handleSubmit(onStep2Submit)} className="space-y-6">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Verify & Secure</h2>
                        <p className="mt-2 text-sm text-muted-foreground">OTP sent to +91{accumulatedData.phone}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Verification Code</label>
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    {...form2.register('otp')}
                                    type="text"
                                    className={cn(
                                        "w-full rounded-xl border bg-background py-3 pl-10 pr-10 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none",
                                        form2.formState.errors.otp && "border-destructive"
                                    )}
                                    placeholder="Enter OTP"
                                />
                            </div>
                            {form2.formState.errors.otp && <p className="text-xs text-destructive text-center">{form2.formState.errors.otp.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Create Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    {...form2.register('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    className={cn(
                                        "w-full rounded-xl border bg-background py-3 pl-10 pr-10 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none",
                                        form2.formState.errors.password && "border-destructive"
                                    )}
                                    placeholder="Min 8 characters"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    {...form2.register('confirmPassword')}
                                    type={showPassword ? 'text' : 'password'}
                                    className={cn(
                                        "w-full rounded-xl border bg-background py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none",
                                        form2.formState.errors.confirmPassword && "border-destructive"
                                    )}
                                    placeholder="Re-enter password"
                                />
                            </div>
                            {form2.formState.errors.confirmPassword && <p className="text-xs text-destructive">{form2.formState.errors.confirmPassword.message}</p>}
                        </div>

                        <label className="flex items-start gap-2 cursor-pointer pt-2">
                            <input {...form2.register('terms')} type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-primary" />
                            <span className="text-xs text-muted-foreground">
                                I agree to the <Link href="/terms" className="text-primary hover:underline">Terms</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                            </span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {isLoading ? <LoadingSpinner size="sm" /> : accumulatedData.role === 'hospital' ? 'Verify & Continue' : 'Create My Account'}
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => {
                                setStep(1);
                                form2.reset();
                            }}
                            className="text-sm text-primary font-semibold hover:underline"
                        >
                            Change phone number
                        </button>
                    </div>
                </form>
            )}

            {/* Step 3: Hospital Profile */}
            {step === 3 && (
                <form onSubmit={form3.handleSubmit(onStep3Submit)} className="space-y-6">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Hospital Details</h2>
                        <p className="mt-2 text-sm text-muted-foreground">Tell us about your hospital</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Hospital Name</label>
                            <div className="relative">
                                <Hospital className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    {...form3.register('hospitalName')}
                                    className="w-full rounded-xl border bg-background py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    placeholder="e.g. City Life Hospital"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Hospital Type</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <select
                                    {...form3.register('hospitalType')}
                                    className="w-full rounded-xl border bg-background py-3 pl-10 pr-10 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none"
                                >
                                    <option value="">Select Type</option>
                                    <option value="multi_specialty">Multi Specialty</option>
                                    <option value="single_specialty">Single Specialty</option>
                                    <option value="clinic">Clinic / Polyclinic</option>
                                    <option value="diagnostic">Diagnostic Center</option>
                                    <option value="nursing_home">Nursing Home</option>
                                </select>
                                <ChevronRight size={16} className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-muted-foreground pointer-events-none" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Hospital Phone</label>
                            <div className="relative flex">
                                <div className="flex items-center rounded-l-xl border border-r-0 bg-muted px-3 text-sm font-medium text-muted-foreground">+91</div>
                                <input
                                    {...form3.register('hospitalPhone')}
                                    maxLength={10}
                                    className={cn(
                                        "w-full rounded-r-xl border bg-background py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none",
                                        form3.formState.errors.hospitalPhone && "border-destructive"
                                    )}
                                    placeholder="Hospital contact number"
                                />
                            </div>
                            {form3.formState.errors.hospitalPhone && <p className="text-xs text-destructive">{form3.formState.errors.hospitalPhone.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Hospital Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    {...form3.register('hospitalEmail')}
                                    className={cn(
                                        "w-full rounded-xl border bg-background py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none",
                                        form3.formState.errors.hospitalEmail && "border-destructive"
                                    )}
                                    placeholder="hospital@example.com"
                                />
                            </div>
                            {form3.formState.errors.hospitalEmail && <p className="text-xs text-destructive">{form3.formState.errors.hospitalEmail.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Brief Description</label>
                            <textarea
                                {...form3.register('description')}
                                className="w-full rounded-xl border bg-background py-3 px-4 text-sm h-32 resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                placeholder="Tell us about the services you provide..."
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {isLoading ? <LoadingSpinner size="sm" /> : 'Continue to Compliance'}
                    </button>
                </form>
            )}

            {/* Step 4: Compliance */}
            {step === 4 && (
                <form onSubmit={form4.handleSubmit(onStep4Submit)} className="space-y-6">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Registration & Compliance</h2>
                        <p className="mt-2 text-sm text-muted-foreground">Verify your hospital credentials</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Registration Number</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    {...form4.register('registrationNumber')}
                                    className="w-full rounded-xl border bg-background py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    placeholder="Enter hospital registration number"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">GSTIN (Optional)</label>
                            <input
                                {...form4.register('gstin')}
                                className="w-full rounded-xl border bg-background py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                placeholder="Enter GST number"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">PAN Number</label>
                            <input
                                {...form4.register('pan')}
                                className={cn(
                                    "w-full rounded-xl border bg-background py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none",
                                    form4.formState.errors.pan && "border-destructive"
                                )}
                                placeholder="Enter hospital PAN"
                            />
                            {form4.formState.errors.pan && <p className="text-xs text-destructive">{form4.formState.errors.pan.message}</p>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {isLoading ? <LoadingSpinner size="sm" /> : 'Continue to Address'}
                    </button>
                </form>
            )}

            {/* Step 5: Address */}
            {step === 5 && (
                <form onSubmit={form5.handleSubmit(onStep5Submit)} className="space-y-6">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Hospital Address</h2>
                        <p className="mt-2 text-sm text-muted-foreground">Complete your registration</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                                <input
                                    {...form5.register('address')}
                                    className="w-full rounded-xl border bg-background py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    placeholder="Plot number, Street, Area..."
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Landmark (Optional)</label>
                            <div className="relative">
                                <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    {...form5.register('landmark')}
                                    className="w-full rounded-xl border bg-background py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    placeholder="Near..."
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">City</label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        {...form5.register('city')}
                                        className="w-full rounded-xl border bg-background py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="City"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">State</label>
                                <div className="relative">
                                    <Map className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        {...form5.register('state')}
                                        className="w-full rounded-xl border bg-background py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="State"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Pincode</label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    {...form5.register('pincode')}
                                    maxLength={6}
                                    className="w-full rounded-xl border bg-background py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    placeholder="6-digit ZIP"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {isLoading ? <LoadingSpinner size="sm" /> : 'Complete Registration'}
                    </button>
                </form>
            )}
        </div>
    );
}

export default RegisterForm;
