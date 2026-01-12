'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import { GoogleLoginButton } from '@/components/common/google-login-button';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';
import type { HospitalType } from '@/lib/types';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { sendOtp, register, registerAsHospital, isLoading } = useAuth();

  const initialType = (searchParams.get('type') as 'patient' | 'hospital') || 'patient';
  const [userType, setUserType] = useState<'patient' | 'hospital'>(initialType);

  // Patient state
  const [patientForm, setPatientForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    otp: '',
  });
  const [patientOtpSent, setPatientOtpSent] = useState(false);
  const [patientOtpLoading, setPatientOtpLoading] = useState(false);
  const [patientOtpCooldown, setPatientOtpCooldown] = useState(0);

  // Hospital state
  const [hospitalForm, setHospitalForm] = useState({
    fullName: '',
    hospitalName: '',
    email: '',
    phone: '',
    hospitalType: 'multi_specialty' as HospitalType,
    addressLine1: '',
    city: '',
    state: '',
    pincode: '',
    otp: '',
    password: '',
    confirmPassword: '',
  });
  const [hospitalOtpSent, setHospitalOtpSent] = useState(false);
  const [hospitalOtpLoading, setHospitalOtpLoading] = useState(false);
  const [hospitalOtpCooldown, setHospitalOtpCooldown] = useState(0);

  // Handle OTP cooldown for patient
  useEffect(() => {
    if (patientOtpCooldown > 0) {
      const timer = setTimeout(() => setPatientOtpCooldown(patientOtpCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [patientOtpCooldown]);

  // Handle OTP cooldown for hospital
  useEffect(() => {
    if (hospitalOtpCooldown > 0) {
      const timer = setTimeout(() => setHospitalOtpCooldown(hospitalOtpCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [hospitalOtpCooldown]);

  // Patient registration handlers
  const handlePatientSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientForm.fullName || !patientForm.email || !patientForm.phone) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientForm.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!/^\+?[1-9]\d{1,14}$/.test(patientForm.phone.replace(/\D/g, ''))) {
      toast.error('Please enter a valid phone number');
      return;
    }

    try {
      setPatientOtpLoading(true);
      await sendOtp({ phone: patientForm.phone, purpose: 'registration' });
      toast.success('OTP sent to your phone!');
      setPatientOtpSent(true);
      setPatientOtpCooldown(60);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setPatientOtpLoading(false);
    }
  };

  const handlePatientVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientForm.otp || patientForm.otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    if (patientForm.password !== patientForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (patientForm.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    try {
      setPatientOtpLoading(true);
      await register({
        phone: patientForm.phone,
        fullName: patientForm.fullName,
        email: patientForm.email,
        password: patientForm.password,
        otp: patientForm.otp,
      });

      toast.success('Registration successful!');
      router.push('/patient');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setPatientOtpLoading(false);
    }
  };

  // Hospital registration handlers
  const handleHospitalSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !hospitalForm.fullName ||
      !hospitalForm.hospitalName ||
      !hospitalForm.hospitalType ||
      !hospitalForm.email ||
      !hospitalForm.phone ||
      !hospitalForm.addressLine1 ||
      !hospitalForm.city ||
      !hospitalForm.state ||
      !hospitalForm.pincode
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!/^\+?[1-9]\d{1,14}$/.test(hospitalForm.phone.replace(/\D/g, ''))) {
      toast.error('Please enter a valid phone number');
      return;
    }

    if (!/^\d{6}$/.test(hospitalForm.pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(hospitalForm.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setHospitalOtpLoading(true);
      await sendOtp({ phone: hospitalForm.phone, purpose: 'registration' });
      toast.success('OTP sent to your phone!');
      setHospitalOtpSent(true);
      setHospitalOtpCooldown(60);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setHospitalOtpLoading(false);
    }
  };

  const handleHospitalVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hospitalForm.otp || hospitalForm.otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    if (hospitalForm.password !== hospitalForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (hospitalForm.password && hospitalForm.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    try {
      setHospitalOtpLoading(true);
      await registerAsHospital({
        phone: hospitalForm.phone,
        otp: hospitalForm.otp,
        fullName: hospitalForm.fullName,
        email: hospitalForm.email,
        password: hospitalForm.password,
        hospital: {
          name: hospitalForm.hospitalName,
          type: hospitalForm.hospitalType,
          phone: hospitalForm.phone,
          email: hospitalForm.email,
          addressLine1: hospitalForm.addressLine1,
          city: hospitalForm.city,
          state: hospitalForm.state,
          pincode: hospitalForm.pincode,
        },
      });

      toast.success('Hospital registration successful!');
      router.push('/hospital');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setHospitalOtpLoading(false);
    }
  };

  const handleGoogleError = (error: Error) => {
    toast.error(error.message || 'Google signup failed');
  };

  return (
    <div className="max-w-md w-full mx-auto py-8 px-6 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center">Create Account</h1>
        <p className="text-center text-muted-foreground mt-2">Join ROZX today</p>
      </div>

      {/* User Type Selection */}
      <div className="flex gap-2 mb-6 bg-muted p-1 rounded-lg">
        <button
          onClick={() => {
            setUserType('patient');
            setPatientOtpSent(false);
            setPatientForm({ ...patientForm, otp: '' });
          }}
          className={`flex-1 py-2 rounded-md font-medium transition ${
            userType === 'patient'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Patient
        </button>
        <button
          onClick={() => {
            setUserType('hospital');
            setHospitalOtpSent(false);
            setHospitalForm({ ...hospitalForm, otp: '' });
          }}
          className={`flex-1 py-2 rounded-md font-medium transition ${
            userType === 'hospital'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Hospital
        </button>
      </div>

      {/* Patient Registration Form */}
      {userType === 'patient' && (
        <form
          onSubmit={patientOtpSent ? handlePatientVerifyAndRegister : handlePatientSendOTP}
          className="space-y-4"
          noValidate
        >
          {!patientOtpSent ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <Input
                  value={patientForm.fullName}
                  onChange={(e) =>
                    setPatientForm({ ...patientForm, fullName: e.target.value })
                  }
                  placeholder="Shivam Maurya"
                  disabled={patientOtpLoading || isLoading}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={patientForm.email}
                  onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
                  placeholder="shivam@example.com"
                  disabled={patientOtpLoading || isLoading}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <Input
                  type="tel"
                  value={patientForm.phone}
                  onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  disabled={patientOtpLoading || isLoading}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={patientOtpLoading || isLoading}
              >
                {patientOtpLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  'Send OTP'
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-900">
                  Enter the 6-digit OTP sent to <strong>{patientForm.phone}</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">OTP</label>
                <Input
                  type="text"
                  value={patientForm.otp}
                  onChange={(e) =>
                    setPatientForm({
                      ...patientForm,
                      otp: e.target.value.replace(/\D/g, '').slice(0, 6),
                    })
                  }
                  placeholder="000000"
                  maxLength={6}
                  disabled={patientOtpLoading}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <Input
                  type="password"
                  value={patientForm.password}
                  onChange={(e) => setPatientForm({ ...patientForm, password: e.target.value })}
                  placeholder="••••••••"
                  disabled={patientOtpLoading}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum 8 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <Input
                  type="password"
                  value={patientForm.confirmPassword}
                  onChange={(e) =>
                    setPatientForm({ ...patientForm, confirmPassword: e.target.value })
                  }
                  placeholder="••••••••"
                  disabled={patientOtpLoading}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setPatientOtpSent(false);
                    setPatientForm({ ...patientForm, otp: '' });
                  }}
                  disabled={patientOtpLoading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={patientOtpLoading || patientForm.otp.length !== 6}
                >
                  {patientOtpLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </div>

              {patientOtpCooldown > 0 ? (
                <p className="text-xs text-center text-muted-foreground">
                  Resend OTP in {patientOtpCooldown}s
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handlePatientSendOTP}
                  className="w-full text-sm text-primary hover:underline"
                  disabled={patientOtpLoading}
                >
                  Didn't receive code? Resend
                </button>
              )}
            </>
          )}
        </form>
      )}

      {/* Hospital Registration Form */}
      {userType === 'hospital' && (
        <form
          onSubmit={hospitalOtpSent ? handleHospitalVerifyAndRegister : handleHospitalSendOTP}
          className="space-y-4"
          noValidate
        >
          {!hospitalOtpSent ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Your Full Name</label>
                <Input
                  value={hospitalForm.fullName}
                  onChange={(e) =>
                    setHospitalForm({ ...hospitalForm, fullName: e.target.value })
                  }
                  placeholder="Shivam Maurya"
                  disabled={hospitalOtpLoading || isLoading}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Hospital Name</label>
                <Input
                  value={hospitalForm.hospitalName}
                  onChange={(e) =>
                    setHospitalForm({ ...hospitalForm, hospitalName: e.target.value })
                  }
                  placeholder="XYZ Hospital"
                  disabled={hospitalOtpLoading || isLoading}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Hospital Type</label>
                <Select
                  value={hospitalForm.hospitalType}
                  onValueChange={(value) =>
                    setHospitalForm({
                      ...hospitalForm,
                      hospitalType: value as HospitalType,
                    })
                  }
                  disabled={hospitalOtpLoading || isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clinic">Clinic</SelectItem>
                    <SelectItem value="nursing_home">Nursing Home</SelectItem>
                    <SelectItem value="diagnostic_center">Diagnostic Center</SelectItem>
                    <SelectItem value="single_specialty">Single Specialty Hospital</SelectItem>
                    <SelectItem value="multi_specialty">Multi Specialty Hospital</SelectItem>
                    <SelectItem value="medical_college">Medical College</SelectItem>
                    <SelectItem value="primary_health">Primary Health Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={hospitalForm.email}
                  onChange={(e) => setHospitalForm({ ...hospitalForm, email: e.target.value })}
                  placeholder="info@hospital.com"
                  disabled={hospitalOtpLoading || isLoading}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <Input
                  type="tel"
                  value={hospitalForm.phone}
                  onChange={(e) => setHospitalForm({ ...hospitalForm, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  disabled={hospitalOtpLoading || isLoading}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <Input
                  value={hospitalForm.addressLine1}
                  onChange={(e) =>
                    setHospitalForm({ ...hospitalForm, addressLine1: e.target.value })
                  }
                  placeholder="Street address"
                  disabled={hospitalOtpLoading || isLoading}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <Input
                    value={hospitalForm.city}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, city: e.target.value })}
                    placeholder="City"
                    disabled={hospitalOtpLoading || isLoading}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">State</label>
                  <Input
                    value={hospitalForm.state}
                    onChange={(e) =>
                      setHospitalForm({ ...hospitalForm, state: e.target.value })
                    }
                    placeholder="State"
                    disabled={hospitalOtpLoading || isLoading}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Pincode</label>
                <Input
                  value={hospitalForm.pincode}
                  onChange={(e) =>
                    setHospitalForm({
                      ...hospitalForm,
                      pincode: e.target.value.replace(/\D/g, '').slice(0, 6),
                    })
                  }
                  placeholder="123456"
                  maxLength={6}
                  disabled={hospitalOtpLoading || isLoading}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={hospitalOtpLoading || isLoading}
              >
                {hospitalOtpLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  'Send OTP'
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-900">
                  Enter the 6-digit OTP sent to <strong>{hospitalForm.phone}</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">OTP</label>
                <Input
                  type="text"
                  value={hospitalForm.otp}
                  onChange={(e) =>
                    setHospitalForm({
                      ...hospitalForm,
                      otp: e.target.value.replace(/\D/g, '').slice(0, 6),
                    })
                  }
                  placeholder="000000"
                  maxLength={6}
                  disabled={hospitalOtpLoading}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <Input
                  type="password"
                  value={hospitalForm.password}
                  onChange={(e) => setHospitalForm({ ...hospitalForm, password: e.target.value })}
                  placeholder="••••••••"
                  disabled={hospitalOtpLoading}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum 8 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <Input
                  type="password"
                  value={hospitalForm.confirmPassword}
                  onChange={(e) =>
                    setHospitalForm({ ...hospitalForm, confirmPassword: e.target.value })
                  }
                  placeholder="••••••••"
                  disabled={hospitalOtpLoading}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setHospitalOtpSent(false);
                    setHospitalForm({ ...hospitalForm, otp: '' });
                  }}
                  disabled={hospitalOtpLoading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={hospitalOtpLoading || hospitalForm.otp.length !== 6}
                >
                  {hospitalOtpLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    'Register'
                  )}
                </Button>
              </div>

              {hospitalOtpCooldown > 0 ? (
                <p className="text-xs text-center text-muted-foreground">
                  Resend OTP in {hospitalOtpCooldown}s
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleHospitalSendOTP}
                  className="w-full text-sm text-primary hover:underline"
                  disabled={hospitalOtpLoading}
                >
                  Didn't receive code? Resend
                </button>
              )}
            </>
          )}
        </form>
      )}

      {/* Only show Google login and divider if not waiting for OTP */}
      {!patientOtpSent && !hospitalOtpSent && (
        <>
          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-muted-foreground">Or sign up with</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Google Signup */}
          <GoogleLoginButton
            className="w-full"
            onError={handleGoogleError}
            disabled={isLoading || hospitalOtpLoading || patientOtpLoading}
          />
        </>
      )}

      {/* Footer */}
      <div className="mt-8 text-center space-y-3">
        <p className="text-muted-foreground text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
