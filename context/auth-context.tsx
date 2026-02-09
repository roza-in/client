'use client';

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { logout as logoutApi } from '@/features/auth/api/login';
import { getDashboardRoute } from '@/config/routes';
import { isSubdomainEnabled, getDashboardUrl, buildSubdomainUrl, type UserRole } from '@/config/subdomains';
import type { User } from '@/types';

// =============================================================================
// Types
// =============================================================================

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    loginWithOTP: (phone: string, otp: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

interface RegisterData {
    name: string;
    email: string;
    phone: string;
    password: string;
}

// =============================================================================
// Context
// =============================================================================

const AuthContext = createContext<AuthContextValue | null>(null);

// =============================================================================
// Provider
// =============================================================================

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [state, setState] = useState<AuthState>({
        user: null,
        isLoading: true,
        isAuthenticated: false,
    });

    // Check auth on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
            const response = await fetch(`${apiUrl}/auth/me`, {
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                const user = data.data?.user || data.user;

                setState({
                    user,
                    isLoading: false,
                    isAuthenticated: !!user,
                });
            } else {
                setState({
                    user: null,
                    isLoading: false,
                    isAuthenticated: false,
                });
            }
        } catch {
            setState({
                user: null,
                isLoading: false,
                isAuthenticated: false,
            });
        }
    };

    const login = async (email: string, password: string) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
        const response = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        const data = await response.json();
        const user = data.data?.user || data.user;

        setState({
            user,
            isLoading: false,
            isAuthenticated: true,
        });

        // Check for redirect param in URL
        const params = new URLSearchParams(window.location.search);
        let redirectUrl = params.get('redirect');

        if (redirectUrl) {
            // Sanitize redirect URL: replace localhost with base domain to avoid cookie issues
            if (isSubdomainEnabled() && redirectUrl.includes('localhost')) {
                const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'rozx.local';
                redirectUrl = redirectUrl.replace('localhost', baseDomain);
            }

            window.location.href = redirectUrl;
            return;
        }

        // Default redirect to role dashboard
        if (isSubdomainEnabled()) {
            window.location.href = getDashboardUrl(user.role as UserRole);
        } else {
            router.push(getDashboardRoute(user.role));
            router.refresh();
        }
    };

    const loginWithOTP = async (phone: string, otp: string) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
        const response = await fetch(`${apiUrl}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ phone, otp }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'OTP verification failed');
        }

        const data = await response.json();
        const user = data.data?.user || data.user;

        setState({
            user,
            isLoading: false,
            isAuthenticated: true,
        });

        // Check for redirect param in URL
        const params = new URLSearchParams(window.location.search);
        let redirectUrl = params.get('redirect');

        if (redirectUrl) {
            // Sanitize redirect URL: replace localhost with base domain
            if (isSubdomainEnabled() && redirectUrl.includes('localhost')) {
                const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'rozx.local';
                redirectUrl = redirectUrl.replace('localhost', baseDomain);
            }

            window.location.href = redirectUrl;
            return;
        }

        // Default redirect to role dashboard
        if (isSubdomainEnabled()) {
            window.location.href = getDashboardUrl(user.role as UserRole);
        } else {
            router.push(getDashboardRoute(user.role));
            router.refresh();
        }
    };

    const register = async (data: RegisterData) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
        const response = await fetch(`${apiUrl}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }

        // Redirect to login or auto-login based on response
        router.push('/login?registered=true');
        router.refresh();
    };

    const logout = async () => {
        try {
            await logoutApi();
        } catch (error) {
            console.error('Logout failed:', error);
            // Continue with client-side cleanup even if server fails
        }

        setState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
        });

        if (isSubdomainEnabled()) {
            // Redirect to main domain login
            // We use window.location.href to force a full page reload and clear client state
            // buildSubdomainUrl('www') -> http://rozx.local:3000
            const loginUrl = `${buildSubdomainUrl('www')}/login`;
            window.location.href = loginUrl;
        } else {
            router.push('/login');
            router.refresh();
        }
    };

    const refreshUser = async () => {
        await checkAuth();
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,
                login,
                loginWithOTP,
                register,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// =============================================================================
// Hook
// =============================================================================

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within AuthProvider');
    }
    return context;
}

export default AuthContext;
