/**
 * Rozx Healthcare Platform - Auth Module Index
 */

export {
    updateActivity,
    getLastActivity,
    isSessionExpired,
    getSessionId,
    clearSession,
    initSessionTracking,
} from './session';

export {
    decodeToken,
    isTokenExpired,
    getTokenExpiry,
    getTimeUntilExpiry,
    getRoleFromToken,
    getUserIdFromToken,
} from './tokens';
export type { TokenPayload } from './tokens';

export {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    getPermissions,
    hasRole,
    hasRoleLevel,
    isAdmin,
    isProvider,
    isPatient,
    canAccessRoute,
} from './permissions';
export type { Permission } from './permissions';

export {
    getReturnUrl,
    buildLoginUrl,
    buildRegisterUrl,
    getPostLoginRedirect,
    getPostLogoutRedirect,
    requiresAuth,
    isAuthPage,
    getUnauthorizedRedirect,
} from './redirect';
