/**
 * Rozx Healthcare Platform - Hooks Index
 * Centralized exports for all custom hooks
 */

// Authentication
export { useAuth, useUser, useIsAuthenticated, useRequireRole } from './use-auth';
export type { UseAuthReturn } from './use-auth';

// Session
export { useSession, useAuthInit } from './use-session';
export type { UseSessionReturn, SessionConfig } from './use-session';

// Debounce
export { useDebounce, useDebouncedCallback, useDebouncedState } from './use-debounce';
export type { DebouncedState } from './use-debounce';

// Media Query
export {
    useMediaQuery,
    useBreakpoint,
    useBreakpointValue,
    useIsMobile,
    useIsTablet,
    useIsDesktop,
    useWindowSize,
    usePreferredColorScheme,
    useIsReducedMotion,
    breakpoints,
} from './use-media-query';
export type { Breakpoint, BreakpointValues, WindowSize, ColorScheme } from './use-media-query';

// Toast
export { useToast, toast } from './use-toast';
export type { ToastType, ToastOptions, UseToastReturn } from './use-toast';

// Local Storage
export {
    useLocalStorage,
    useThemePreference,
    useSidebarState,
    useRecentSearches,
    storageKeys,
} from './use-local-storage';
export type { UseLocalStorageOptions, UseLocalStorageReturn } from './use-local-storage';

// Pagination
export { usePagination } from './use-pagination';
export type { PaginationState, UsePaginationOptions, UsePaginationReturn } from './use-pagination';

// Filter
export { useFilter } from './use-filter';
export type { FilterValue, FilterConfig, UseFilterReturn } from './use-filter';

// API Error Handling
export { useApiError, useFormErrors } from './use-api-error';
export type { ErrorState } from './use-api-error';
