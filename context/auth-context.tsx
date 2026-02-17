'use client';

/**
 * @deprecated AuthContext has been removed. Use the Zustand auth store instead:
 *
 *   import { useAuthStore } from '@/store/slices/auth.slice';
 *   import { useAuth } from '@/hooks/use-auth';
 *
 * The AuthProvider wrapper is no longer needed — AuthStoreInitializer
 * handles store initialization in app/providers.tsx.
 */

import { type ReactNode } from 'react';

/**
 * @deprecated No-op provider kept for backward compatibility.
 * Remove this wrapper from your component tree.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    return <>{children}</>;
}

/**
 * @deprecated Use `useAuth()` from '@/hooks/use-auth' or
 * `useAuthStore()` from '@/store/slices/auth.slice' instead.
 */
export function useAuthContext() {
    throw new Error(
        'useAuthContext is deprecated. Use useAuth() from @/hooks/use-auth instead.'
    );
}

export default {};
