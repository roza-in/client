'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useCallback, useEffect } from 'react';
import {
  sendOTP,
  verifyOTP,
  loginWithPassword as loginWithPasswordApi,
  getGoogleOAuthUrl,
  handleGoogleCallback,
  googleOAuth,
  registerPatient,
  registerHospital,
  getMe,
  logout as logoutApi,
  clearAuthTokens,
  getAccessToken,
} from '@/lib/api';
import { createClient as createSupabaseClient } from '@/lib/supabase/client';
import type {
  User,
  UserProfile,
  UserRole,
  OTPSendInput,
  OTPVerifyInput,
  GoogleAuthInput,
  RegisterInput,
  PasswordLoginInput,
  HospitalType,
} from '@/lib/types';

// Hospital registration input
export interface HospitalRegisterInput {
  phone: string;
  otp: string;
  // Optional password for the hospital admin user
  password?: string;
  fullName: string;
  email?: string;
  hospital: {
    name: string;
    type?: HospitalType;
    registrationNumber?: string;
    phone: string;
    email?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    latitude?: number;
    longitude?: number;
    about?: string;
    specialties?: string[];
    facilities?: string[];
  };
}

// ============================================================================
// Types
// ============================================================================

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: (initialized: boolean) => void;
  reset: () => void;
}

type AuthStore = AuthState & AuthActions;

// ============================================================================
// Store
// ============================================================================

const initialState: AuthState = {
  user: null,
  isLoading: false,
  isInitialized: false,
  error: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,

      setUser: (user) => set({ user, error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error, isLoading: false }),
      setInitialized: (isInitialized) => set({ isInitialized }),
      reset: () => {
        clearAuthTokens();
        set(initialState);
      },
    }),
    {
      name: 'rozx-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);

// ============================================================================
// Main Auth Hook
// ============================================================================

export function useAuth() {
  const store = useAuthStore();
  const { user, isLoading, isInitialized, error, setUser, setLoading, setError, setInitialized, reset } = store;

  // Initialize auth state on mount
  const initialize = useCallback(async () => {
    // If an OAuth flow is in progress, wait briefly for tokens to arrive
    const authPending = typeof window !== 'undefined' && sessionStorage.getItem('auth_pending');

    // Wait for access token if authPending is set (short polling)
    const waitForTokenIfPending = async (timeoutMs = 3000, intervalMs = 250) => {
      if (!authPending) return;
      const start = Date.now();
      while (Date.now() - start < timeoutMs) {
        const t = getAccessToken();
        if (t) return;
        // small delay
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, intervalMs));
      }
    };

    await waitForTokenIfPending();

    const token = getAccessToken();
    if (!token) {
      // No tokens available — mark initialized so layouts won't hang
      setInitialized(true);
      return;
    }

    try {
      setLoading(true);
      const response = await getMe();
      setUser(response.user);
    } catch (err) {
      // If token invalid, clear tokens and state
      reset();
      throw err;
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [setUser, setLoading, setInitialized, reset]);

  // Send OTP
  const sendOtp = useCallback(
    async (input: OTPSendInput) => {
      try {
        setLoading(true);
        setError(null);
        const response = await sendOTP(input);
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to send OTP';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  // Verify OTP and login
  const verifyOtp = useCallback(
    async (input: OTPVerifyInput) => {
      try {
        setLoading(true);
        setError(null);
        const response = await verifyOTP(input);
        setUser(response.user);
        setInitialized(true);
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to verify OTP';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading, setError]
  );

  // Get Google OAuth URL (Supabase Auth flow - Step 1)
  const getGoogleOAuthUrl = useCallback(
    async (redirectUrl: string) => {
      try {
        setError(null);
        return await getGoogleOAuthUrl(redirectUrl);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to get Google OAuth URL';
        setError(message);
        throw err;
      }
    },
    [setError]
  );

  // Handle Google OAuth callback (Supabase Auth flow - Step 2)
  const handleGoogleCallbackFlow = useCallback(
    async (code: string, state?: string) => {
      try {
        setLoading(true);
        setError(null);
        const response = await handleGoogleCallback(code, state || '');
        setUser(response.user);
        setInitialized(true);
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Google login failed';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading, setError]
  );

  // Google OAuth login (DEPRECATED - use getGoogleOAuthUrl + handleGoogleCallbackFlow)
  const loginWithGoogle = useCallback(
    async (input: GoogleAuthInput) => {
      try {
        setLoading(true);
        setError(null);
        const response = await googleOAuth(input);
        setUser(response.user);
        setInitialized(true);
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Google login failed';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading, setError]
  );

  // Login with email/password
  const loginWithPassword = useCallback(
    async (input: PasswordLoginInput) => {
      try {
        setLoading(true);
        setError(null);
        const response = await loginWithPasswordApi(input);
        setUser(response.user);
        setInitialized(true);
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading, setError]
  );

  // Register patient
  const register = useCallback(
    async (input: RegisterInput) => {
      try {
        setLoading(true);
        setError(null);
        const response = await registerPatient(input);
        setUser(response.user);
        setInitialized(true);
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Registration failed';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading, setError]
  );

  // Register hospital
  const registerAsHospital = useCallback(
    async (input: HospitalRegisterInput) => {
      try {
        setLoading(true);
        setError(null);
        const response = await registerHospital(input);
        setUser(response.user);
        setInitialized(true);
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Hospital registration failed';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading, setError]
  );

  // Logout
  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } finally {
      // Sign out Supabase to clear its auth cookies (used by middleware)
      try {
        const supabase = createSupabaseClient();
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut failed (continuing):', err);
      }

      // Clear auth state and mark initialized so layouts stop showing loaders
      reset();
      setInitialized(true);
    }
  }, [reset, setInitialized]);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const response = await getMe();
      setUser(response.user);
      return response.user;
    } catch (err) {
      reset();
      throw err;
    }
  }, [setUser, reset]);

  return {
    // State
    user,
    isLoading,
    isInitialized,
    isAuthenticated: !!user,
    error,

    // Actions
    initialize,
    sendOtp,
    verifyOtp,
    getGoogleOAuthUrl,
    handleGoogleCallbackFlow,
    loginWithGoogle,
    loginWithPassword,
    register,
    registerAsHospital,
    logout,
    refreshUser,
    clearError: () => setError(null),
  };
}

// ============================================================================
// Role Hook
// ============================================================================

export function useRole() {
  const user = useAuthStore((state) => state.user);

  const hasRole = useCallback(
    (roles: UserRole | UserRole[]): boolean => {
      if (!user) return false;
      const roleArray = Array.isArray(roles) ? roles : [roles];
      return roleArray.includes(user.role);
    },
    [user]
  );

  return {
    role: user?.role ?? null,
    hasRole,
    isAdmin: user?.role === 'admin',
    isHospital: user?.role === 'hospital',
    isDoctor: user?.role === 'doctor',
    isPatient: user?.role === 'patient',
  };
}

// ============================================================================
// User Hook (simplified access to user)
// ============================================================================

export function useUser() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  return {
    user,
    isLoading,
    isInitialized,
    isAuthenticated: !!user,
  };
}

// ============================================================================
// Auth Initialization Hook (for layout/providers)
// ============================================================================

export function useAuthInit() {
  const { initialize, isInitialized } = useAuth();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [initialize, isInitialized]);

  return { isInitialized };
}
