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
