/**
 * Auth Feature - Logout API
 */

import { api, endpoints } from '@/lib/api';

/**
 * Logout the current user (clears cookies on server)
 */
export async function logout(): Promise<void> {
    await api.post(endpoints.auth.logout);
}

/**
 * Revoke a specific session
 */
export async function revokeSession(sessionId: string): Promise<void> {
    await api.delete(`${endpoints.users.sessions}/${sessionId}`);
}

/**
 * Revoke all sessions except current
 */
export async function revokeAllSessions(): Promise<void> {
    await api.delete(endpoints.users.sessions);
}
