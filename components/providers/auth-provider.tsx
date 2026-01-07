'use client';

import { ReactNode } from 'react';
import { useAuthInit } from '@/hooks/use-auth';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth Provider - initializes auth state and manages session
 * Uses the useAuthInit hook to handle all auth initialization logic
 */
export function AuthProvider({ children }: AuthProviderProps) {
  // Initialize auth state on mount
  // This hook handles token validation, user profile loading, and token refresh setup
  useAuthInit();

  return <>{children}</>;
}
