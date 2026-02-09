/**
 * Notifications Feature - API
 */

import { api, endpoints } from '@/lib/api';

// =============================================================================
// Types
// =============================================================================

export interface Notification {
    id: string;
    type: 'appointment' | 'prescription' | 'payment' | 'system' | 'reminder';
    title: string;
    message: string;
    data?: Record<string, unknown>;
    isRead: boolean;
    createdAt: string;
}

export interface NotificationPreferences {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    push: boolean;
    appointmentReminders: boolean;
    prescriptionAlerts: boolean;
    marketingEmails: boolean;
}

export interface UnreadCount {
    total: number;
    byType: Record<string, number>;
}

// =============================================================================
// API Functions
// =============================================================================

/**
 * Get notifications list
 */
export async function getNotifications(params?: {
    type?: string;
    isRead?: boolean;
    page?: number;
    limit?: number;
    [key: string]: any;
}): Promise<{ notifications: Notification[]; total: number }> {
    const { data, meta } = await api.getWithMeta<Notification[]>(endpoints.notifications.list, {
        params,
    });
    return { notifications: data, total: meta?.total || 0 };
}

/**
 * Get unread notifications count
 */
export async function getUnreadCount(): Promise<UnreadCount> {
    return api.get<UnreadCount>(endpoints.notifications.count);
}

/**
 * Mark notification as read
 */
export async function markAsRead(id: string): Promise<void> {
    await api.post(endpoints.notifications.markRead(id));
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(): Promise<void> {
    await api.post(endpoints.notifications.markAllRead);
}

/**
 * Get notification preferences
 */
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
    return api.get<NotificationPreferences>(endpoints.notifications.preferences);
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
    preferences: Partial<NotificationPreferences>
): Promise<NotificationPreferences> {
    return api.patch<NotificationPreferences>(endpoints.notifications.preferences, preferences);
}
