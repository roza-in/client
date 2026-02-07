/**
 * Notifications Feature - Hooks
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    getNotificationPreferences,
    updateNotificationPreferences,
    type NotificationPreferences,
} from '../api/notifications';
import { toast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/api';

// =============================================================================
// Query Keys
// =============================================================================

export const notificationKeys = {
    all: ['notifications'] as const,
    lists: () => [...notificationKeys.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...notificationKeys.lists(), filters] as const,
    unreadCount: () => [...notificationKeys.all, 'unread'] as const,
    preferences: () => [...notificationKeys.all, 'preferences'] as const,
};

// =============================================================================
// Hooks
// =============================================================================

/**
 * Hook to fetch notifications
 */
export function useNotifications(params?: {
    type?: string;
    isRead?: boolean;
    page?: number;
    limit?: number;
}) {
    return useQuery({
        queryKey: notificationKeys.list(params || {}),
        queryFn: () => getNotifications(params),
        staleTime: 1 * 60 * 1000, // 1 minute
    });
}

/**
 * Hook to get unread count
 */
export function useUnreadCount() {
    return useQuery({
        queryKey: notificationKeys.unreadCount(),
        queryFn: getUnreadCount,
        staleTime: 30 * 1000, // 30 seconds
        refetchInterval: 60 * 1000, // Poll every minute
    });
}

/**
 * Hook to mark notification as read
 */
export function useMarkAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });
        },
        onError: (err) => {
            toast.error(getErrorMessage(err));
        },
    });
}

/**
 * Hook to mark all as read
 */
export function useMarkAllAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markAllAsRead,
        onSuccess: () => {
            toast.success('All notifications marked as read');
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });
        },
        onError: (err) => {
            toast.error(getErrorMessage(err));
        },
    });
}

/**
 * Hook to get notification preferences
 */
export function useNotificationPreferences() {
    return useQuery({
        queryKey: notificationKeys.preferences(),
        queryFn: getNotificationPreferences,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}

/**
 * Hook to update notification preferences
 */
export function useUpdateNotificationPreferences() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateNotificationPreferences,
        onSuccess: () => {
            toast.success('Preferences updated');
            queryClient.invalidateQueries({ queryKey: notificationKeys.preferences() });
        },
        onError: (err) => {
            toast.error(getErrorMessage(err));
        },
    });
}
