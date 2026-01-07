'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useCallback, useEffect } from 'react';
import {
  sendOTP,
  verifyOTP,
  googleOAuth,
  registerPatient,
  registerHospital,
  getMe,
  logout as logoutApi,
  clearAuthTokens,
  getAccessToken,
} from '@/lib/api';
import type {
  User,
  UserProfile,
  UserRole,
  OTPSendInput,
  OTPVerifyInput,
  GoogleAuthInput,
  RegisterInput,
  HospitalType,
} from '@/lib/types';

// Hospital registration input
export interface HospitalRegisterInput {
  phone: string;
  email?: string;
  fullName: string;
  hospitalName: string;
  hospitalType: HospitalType;
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
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
    const token = getAccessToken();
    if (!token) {
      setInitialized(true);
      return;
    }

    try {
      setLoading(true);
      const { profile } = await getMe();
      setUser(profile);
    } catch {
      // Token invalid, clear everything
      reset();
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

  // Google OAuth login
  const loginWithGoogle = useCallback(
    async (input: GoogleAuthInput) => {
      try {
        setLoading(true);
        setError(null);
        const response = await googleOAuth(input);
        setUser(response.user);
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

  // Register patient
  const register = useCallback(
    async (input: RegisterInput) => {
      try {
        setLoading(true);
        setError(null);
        const response = await registerPatient(input);
        setUser(response.profile);
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
        setUser(response.profile);
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
      reset();
    }
  }, [reset]);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const { profile } = await getMe();
      setUser(profile);
      return profile;
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
    loginWithGoogle,
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
