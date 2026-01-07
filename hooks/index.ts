/**
 * ROZX Healthcare Platform - Hooks
 * Central export file for all custom hooks
 */

// Auth hooks
export {
  useAuthStore,
  useAuth,
  useRole,
  useUser,
  useAuthInit,
} from './use-auth';

// Async/mutation hooks
export { useAsync, useMutation } from './use-async';

// Debounce hooks
export { useDebounce, useDebouncedCallback } from './use-debounce';

// Storage hooks
export { useLocalStorage } from './use-local-storage';

// Responsive hooks
export { useMobile, useBreakpoint } from './use-mobile';

// Notifications hook
export { useNotifications } from './use-notifications';

// URL params hook
export { useSearchParams } from './use-search-params';

// Pagination hooks
export { usePagination, useSearchWithPagination } from './use-pagination';
