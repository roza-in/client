'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  listNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  subscribeToNotifications,
  requestBrowserPermission,
  showBrowserNotification,
} from '@/lib/api';
import type { Notification } from '@/lib/types';
import { useUser } from './use-auth';

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  requestPermission: () => Promise<NotificationPermission>;
}

/**
 * Hook for managing notifications
 */
export function useNotifications(options?: { autoFetch?: boolean }): UseNotificationsReturn {
  const { isAuthenticated } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      setError(null);

      const [{ notifications: data }, { count }] = await Promise.all([
        listNotifications({ limit: 20 }),
        getUnreadCount(),
      ]);

      setNotifications(data);
      setUnreadCount(count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (options?.autoFetch !== false && isAuthenticated) {
      fetchNotifications();
    }
  }, [fetchNotifications, isAuthenticated, options?.autoFetch]);

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubscribe = subscribeToNotifications(
      (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);

        // Show browser notification
        showBrowserNotification(notification.title, {
          body: notification.body || '',
          tag: notification.id,
        });
      },
      (error) => {
        console.error('Notification subscription error:', error);
      }
    );

    return unsubscribe;
  }, [isAuthenticated]);

  const markRead = useCallback(async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, readAt: n.readAt || new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  }, []);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    refresh: fetchNotifications,
    markRead,
    markAllRead,
    requestPermission: requestBrowserPermission,
  };
}
