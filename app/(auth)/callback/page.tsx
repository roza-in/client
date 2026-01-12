'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { handleGoogleCallback } from '@/lib/api';
import { toast } from 'sonner';

export default function CallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const supabase = createClient();

        // Try to get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          throw new Error(sessionError.message || 'Failed to get session');
        }

        // If no session returned, try to parse OAuth tokens from URL hash and set them
        let currentSession = session;
        if (!currentSession) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');

          if (accessToken && refreshToken) {
            const { data: { session: newSession }, error: setSessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            if (setSessionError || !newSession) {
              throw new Error('Failed to set session from URL parameters');
            }
            currentSession = newSession;
          } else {
            throw new Error('No session found. Please try logging in again.');
          }
        }

        // Exchange Supabase session for backend tokens / app session
        const response = await handleGoogleCallback(currentSession.access_token, currentSession.user.id);

        // Clear pending flag (if any) and redirect
        try {
          sessionStorage.removeItem('auth_pending');
        } catch (e) {
          /* ignore */
        }

        redirectUser(response, router);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
        console.error('OAuth callback error:', err);
        setError(errorMessage);
        toast.error(errorMessage);
        setTimeout(() => router.push('/login'), 3000);
      }
    };

    processCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="text-center">
          {!error ? (
            <>
              <div className="mb-4">
                <svg
                  className="animate-spin h-12 w-12 mx-auto text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Completing sign in...</h2>
              <p className="text-muted-foreground">Please wait while we log you in.</p>
            </>
          ) : (
            <>
              <div className="mb-4">
                <svg
                  className="h-12 w-12 mx-auto text-destructive"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-destructive">Authentication Failed</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <p className="text-sm text-muted-foreground">Redirecting to login...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to handle user redirection
function redirectUser(response: any, router: any) {
  // Get redirect destination from session storage or use role-based default
  const savedRedirect = sessionStorage.getItem('auth_redirect');
  sessionStorage.removeItem('auth_redirect');

  let redirectPath = savedRedirect;
  if (!redirectPath) {
    // Role-based redirect
    switch (response?.user?.role) {
      case 'admin':
        redirectPath = '/admin';
        break;
      case 'hospital':
        redirectPath = '/hospital';
        break;
      case 'doctor':
        redirectPath = '/doctor';
        break;
      case 'patient':
        redirectPath = '/patient';
        break;
      default:
        redirectPath = '/';
    }
  }

  toast.success('Login successful!');
  router.push(redirectPath);
}
