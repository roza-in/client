/**
 * Notification API
 * Handles all notification-related API calls
 */

import { api, buildQueryParams, type PaginationMeta } from '@/config/api';
import type {
  Notification,
  NotificationPreferences,
  DeviceToken,
  NotificationType,
  NotificationChannel,
} from '@/lib/types';

/**
 * Notification filters
 */
export interface NotificationFilters {
  type?: NotificationType;
  isRead?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

/**
 * Send notification input
 */
export interface SendNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  channels?: NotificationChannel[];
}

/**
 * Bulk notification input
 */
export interface BulkNotificationInput {
  userIds: string[];
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  channels?: NotificationChannel[];
}

/**
 * Register device input
 */
export interface RegisterDeviceInput {
  token: string;
  platform: 'ios' | 'android' | 'web';
  deviceInfo?: {
    model?: string;
    os?: string;
    osVersion?: string;
    appVersion?: string;
  };
}

/**
 * List notifications
 */
export async function listNotifications(
  filters: NotificationFilters = {}
): Promise<{ notifications: Notification[]; meta: PaginationMeta }> {
  const params = buildQueryParams(filters as Record<string, unknown>);
  const response = await api.getWithMeta<Notification[]>('/notifications', { params });
  return {
    notifications: response.data,
    meta: response.meta!,
  };
}

/**
 * Get notification by ID
 */
export async function getNotification(id: string): Promise<Notification> {
  return api.get<Notification>(`/notifications/${id}`);
}

/**
 * Mark notification as read
 */
export async function markAsRead(id: string): Promise<Notification> {
  return api.patch<Notification>(`/notifications/${id}/read`);
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(): Promise<{ count: number }> {
  return api.post<{ count: number }>('/notifications/read-all');
}

/**
 * Delete notification
 */
export async function deleteNotification(id: string): Promise<void> {
  return api.delete<void>(`/notifications/${id}`);
}

/**
 * Delete all notifications
 */
export async function deleteAllNotifications(): Promise<{ count: number }> {
  return api.delete<{ count: number }>('/notifications/all');
}

/**
 * Get unread count
 */
export async function getUnreadCount(): Promise<{ count: number }> {
  return api.get<{ count: number }>('/notifications/unread-count');
}

/**
 * Get recent notifications
 */
export async function getRecentNotifications(
  limit: number = 5
): Promise<Notification[]> {
  const params = buildQueryParams({ limit, sortBy: 'createdAt', sortOrder: 'desc' });
  return api.get<Notification[]>('/notifications', { params });
}

// =============================================================================
// NOTIFICATION PREFERENCES
// =============================================================================

/**
 * Get notification preferences
 */
export async function getPreferences(): Promise<NotificationPreferences> {
  return api.get<NotificationPreferences>('/notifications/preferences');
}

/**
 * Update notification preferences
 */
export async function updatePreferences(
  data: Partial<NotificationPreferences>
): Promise<NotificationPreferences> {
  return api.put<NotificationPreferences>('/notifications/preferences', data);
}

/**
 * Reset preferences to default
 */
export async function resetPreferences(): Promise<NotificationPreferences> {
  return api.post<NotificationPreferences>('/notifications/preferences/reset');
}

// =============================================================================
// DEVICE TOKENS (PUSH NOTIFICATIONS)
// =============================================================================

/**
 * Register device for push notifications
 */
export async function registerDevice(data: RegisterDeviceInput): Promise<DeviceToken> {
  return api.post<DeviceToken>('/notifications/devices', data);
}

/**
 * Unregister device
 */
export async function unregisterDevice(token: string): Promise<void> {
  return api.delete<void>(`/notifications/devices/${encodeURIComponent(token)}`);
}

/**
 * List registered devices
 */
export async function listDevices(): Promise<DeviceToken[]> {
  return api.get<DeviceToken[]>('/notifications/devices');
}

/**
 * Test push notification to device
 */
export async function testPushNotification(token: string): Promise<{ sent: boolean }> {
  return api.post<{ sent: boolean }>('/notifications/devices/test', { token });
}

// =============================================================================
// ADMIN - SEND NOTIFICATIONS
// =============================================================================

/**
 * Send notification (admin)
 */
export async function sendNotification(data: SendNotificationInput): Promise<Notification> {
  return api.post<Notification>('/notifications/send', data);
}

/**
 * Send bulk notifications (admin)
 */
export async function sendBulkNotifications(
  data: BulkNotificationInput
): Promise<{ sent: number; failed: number }> {
  return api.post<{ sent: number; failed: number }>('/notifications/send-bulk', data);
}

/**
 * Send notification to all users (admin)
 */
export async function sendBroadcast(
  data: Omit<SendNotificationInput, 'userId'>
): Promise<{ queued: number }> {
  return api.post<{ queued: number }>('/notifications/broadcast', data);
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Subscribe to notification updates (using EventSource/SSE)
 */
export function subscribeToNotifications(
  onNotification: (notification: Notification) => void,
  onError?: (error: Event) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  const token = localStorage.getItem('accessToken');
  if (!token) return () => {};

  const eventSource = new EventSource(
    `${process.env.NEXT_PUBLIC_API_URL}/notifications/subscribe?token=${token}`
  );

  eventSource.onmessage = (event) => {
    try {
      const notification = JSON.parse(event.data) as Notification;
      onNotification(notification);
    } catch (e) {
      console.error('Failed to parse notification:', e);
    }
  };

  eventSource.onerror = (error) => {
    onError?.(error);
    eventSource.close();
  };

  return () => eventSource.close();
}

/**
 * Request browser notification permission
 */
export async function requestBrowserPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  return Notification.requestPermission();
}

/**
 * Show browser notification
 */
export function showBrowserNotification(
  title: string,
  options?: NotificationOptions
): globalThis.Notification | null {
  if (
    typeof window === 'undefined' ||
    !('Notification' in window) ||
    Notification.permission !== 'granted'
  ) {
    return null;
  }

  return new Notification(title, {
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    ...options,
  });
}

// =============================================================================
// API NAMESPACE EXPORTS
// =============================================================================

/**
 * Preferences API
 */
export const preferencesApi = {
  get: getPreferences,
  update: updatePreferences,
  reset: resetPreferences,
};

/**
 * Devices API
 */
export const devicesApi = {
  register: registerDevice,
  unregister: unregisterDevice,
  list: listDevices,
  test: testPushNotification,
};

/**
 * Notification API namespace export
 */
export const notificationApi = {
  list: listNotifications,
  get: getNotification,
  markAsRead,
  markAllAsRead,
  delete: deleteNotification,
  deleteAll: deleteAllNotifications,
  getUnreadCount,
  getRecent: getRecentNotifications,
  preferences: preferencesApi,
  devices: devicesApi,
  send: sendNotification,
  sendBulk: sendBulkNotifications,
  broadcast: sendBroadcast,
  subscribe: subscribeToNotifications,
  requestPermission: requestBrowserPermission,
  showBrowser: showBrowserNotification,
};
