'use client';

import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store';
import { routes, isPublicRoute, getDashboardRoute } from '@/config';

// Types
interface AuthContextValue {
    isInitialized: boolean;
    isAuthenticated: boolean;
    isLoading: boolean;
}

interface AuthProviderProps {
    children: ReactNode;
}

// Context
const AuthContext = createContext<AuthContextValue | null>(null);

// Provider Component
export function AuthProvider({ children }: AuthProviderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const initRef = useRef(false);

    const {
        isAuthenticated,
        isInitialized,
        isLoading,
        user,
        initialize,
    } = useAuthStore();

    // Initialize auth on mount
    useEffect(() => {
        if (initRef.current) return;
        initRef.current = true;

        // Initialize auth
        initialize();

        // Register unauthorized handler
        const { onUnauthorized } = require('@/lib/api/client');
        onUnauthorized(() => {
            useAuthStore.getState().logout();
        });
    }, [initialize]);

    // Handle route protection
    useEffect(() => {
        if (!isInitialized) return;

        const isPublic = isPublicRoute(pathname);

        // Redirect authenticated users away from auth pages
        if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
            const dashboard = getDashboardRoute(user?.role || 'patient');
            router.replace(dashboard);
            return;
        }

        // Redirect unauthenticated users from protected routes
        if (!isAuthenticated && !isPublic) {
            const returnUrl = encodeURIComponent(pathname);
            router.replace(`${routes.public.login}?returnUrl=${returnUrl}`);
        }
    }, [isAuthenticated, isInitialized, pathname, user, router]);

    const value: AuthContextValue = {
        isInitialized,
        isAuthenticated,
        isLoading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook
export function useAuthContext(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within AuthProvider');
    }
    return context;
}

export default AuthProvider;
