'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { env } from '@/config/env';

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Google Login Button Component
 * Requires Google Sign-In script to be loaded
 */
export function GoogleLoginButton({
  onSuccess,
  onError,
  disabled = false,
  className,
}: GoogleLoginButtonProps) {
  const { loginWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleGoogleSignIn = () => {
    if (!env.googleClientId) {
      const error = new Error('Google Client ID not configured');
      onError?.(error);
      return;
    }

    setIsLoading(true);

    // Initialize Google Sign-In
    if (window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: env.googleClientId,
        callback: async (response) => {
          try {
            await loginWithGoogle({ credential: response.credential });
            onSuccess?.();
          } catch (error) {
            const err = error instanceof Error ? error : new Error('Google login failed');
            onError?.(err);
          } finally {
            setIsLoading(false);
          }
        },
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { theme: 'outline', size: 'large' }
      );
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <Button
        type="button"
        variant="outline"
        className={className}
        disabled={disabled || isLoading}
        onClick={handleGoogleSignIn}
      >
        {isLoading ? 'Signing in...' : 'Sign in with Google'}
      </Button>
      <div id="google-signin-button" className="flex justify-center" />
    </div>
  );
}
