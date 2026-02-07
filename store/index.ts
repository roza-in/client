/**
 * Store Exports
 * Central export file for all Zustand stores
 */

// Auth Store
export {
    useAuthStore,
    useUser,
    useIsAuthenticated,
    useUserRole,
    useAuthLoading,
    useAuthError,
    getRedirectPath,
    ROLE_REDIRECT_PATHS,
    type AuthState,
    type UserRole,
} from './slices/auth.slice';
