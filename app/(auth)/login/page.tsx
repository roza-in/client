'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { GoogleLoginButton } from '@/components/common/google-login-button';
import { toast } from 'sonner';
import { Phone, Mail, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { sendOtp, verifyOtp, isLoading, error } = useAuth();

  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  
  // Phone OTP state
  const [phone, setPhone] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [showPhoneOtpInput, setShowPhoneOtpInput] = useState(false);
  const [phoneOtpLoading, setPhoneOtpLoading] = useState(false);
  
  // Email state
  const [email, setEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  
  // Cooldown timer
  const [otpCooldown, setOtpCooldown] = useState(0);

  // Handle OTP cooldown
  useEffect(() => {
    if (otpCooldown > 0) {
      const timer = setTimeout(() => setOtpCooldown(otpCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCooldown]);

  // Handle sending OTP for phone
  const handleSendPhoneOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || !/^\+?[1-9]\d{1,14}$/.test(phone.replace(/\D/g, ''))) {
      toast.error('Please enter a valid phone number');
      return;
    }

    try {
      setPhoneOtpLoading(true);
      await sendOtp({ phone, purpose: 'login' });
      toast.success('OTP sent to your phone!');
      setShowPhoneOtpInput(true);
      setOtpCooldown(60);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setPhoneOtpLoading(false);
    }
  };

  // Handle verifying OTP
  const handleVerifyPhoneOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneOtp || phoneOtp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setPhoneOtpLoading(true);
      await verifyOtp({ phone, otp: phoneOtp, purpose: 'login' });
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to verify OTP');
    } finally {
      setPhoneOtpLoading(false);
    }
  };

  const handleGoogleSuccess = () => {
    toast.success('Google login successful!');
    router.push('/dashboard');
  };

  const handleGoogleError = (error: Error) => {
    toast.error(error.message || 'Google login failed');
  };

  return (
    <div className="max-w-md w-full mx-auto py-8 px-6 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center">Welcome Back</h1>
        <p className="text-center text-muted-foreground mt-2">Login to your ROZX account</p>
      </div>

      {/* Auth Method Selection */}
      <div className="flex gap-2 mb-6 bg-muted p-1 rounded-lg">
        <button
          onClick={() => {
            setAuthMethod('phone');
            setShowPhoneOtpInput(false);
            setPhoneOtp('');
          }}
          className={`flex-1 py-2 px-3 rounded-md font-medium transition flex items-center justify-center gap-2 ${
            authMethod === 'phone'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Phone className="h-4 w-4" />
          <span className="hidden sm:inline">Phone</span>
        </button>
        <button
          onClick={() => setAuthMethod('email')}
          className={`flex-1 py-2 px-3 rounded-md font-medium transition flex items-center justify-center gap-2 ${
            authMethod === 'email'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Mail className="h-4 w-4" />
          <span className="hidden sm:inline">Email</span>
        </button>
      </div>

      {/* Phone OTP Login */}
      {authMethod === 'phone' && (
        <form onSubmit={handleSendPhoneOTP} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              disabled={phoneOtpLoading || showPhoneOtpInput}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              We'll send you a 6-digit code to verify your phone
            </p>
          </div>

          {!showPhoneOtpInput ? (
            <Button type="submit" className="w-full" disabled={phoneOtpLoading || isLoading}>
              {phoneOtpLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </Button>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Enter OTP</label>
                <Input
                  type="text"
                  value={phoneOtp}
                  onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  disabled={phoneOtpLoading}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowPhoneOtpInput(false);
                    setPhoneOtp('');
                  }}
                  disabled={phoneOtpLoading}
                >
                  Back
                </Button>
                <Button
                  onClick={handleVerifyPhoneOTP}
                  className="flex-1"
                  disabled={phoneOtpLoading || phoneOtp.length !== 6}
                >
                  {phoneOtpLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify OTP'
                  )}
                </Button>
              </div>

              {otpCooldown > 0 ? (
                <p className="text-xs text-center text-muted-foreground">
                  Resend OTP in {otpCooldown}s
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleSendPhoneOTP}
                  className="w-full text-sm text-primary hover:underline"
                  disabled={phoneOtpLoading}
                >
                  Didn't receive code? Resend
                </button>
              )}
            </>
          )}
        </form>
      )}

      {/* Email Login */}
      {authMethod === 'email' && (
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <Input
              type="password"
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Note: Email/password login coming soon
          </p>
        </form>
      )}

      {error && (
        <div className="mt-4 p-3 bg-destructive/10 text-destructive text-sm rounded-md">
          {error}
        </div>
      )}

      {/* Divider */}
      <div className="my-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-sm text-muted-foreground">Or continue with</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Google Login */}
      <GoogleLoginButton
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        disabled={isLoading || phoneOtpLoading}
      />

      {/* Footer */}
      <div className="mt-8 text-center space-y-3">
        <p className="text-muted-foreground text-sm">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary hover:underline font-medium">
            Sign up here
          </Link>
        </p>
        <p className="text-xs text-muted-foreground">
          Are you a hospital?{' '}
          <Link href="/register?type=hospital" className="text-primary hover:underline font-medium">
            Register your hospital
          </Link>
        </p>
      </div>
    </div>
  );
}