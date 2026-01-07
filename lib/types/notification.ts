/**
 * ROZX Healthcare Platform - Notification Types
 */

import type {
  NotificationType,
  NotificationChannel,
  NotificationStatus,
} from './enums';

// ============================================================================
// Notification Types
// ============================================================================

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  imageUrl: string | null;
  actionUrl: string | null;
  status: NotificationStatus;
  sentAt: string | null;
  deliveredAt: string | null;
  readAt: string | null;
  failureReason: string | null;
  createdAt: string;
}

export interface NotificationListItem {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  actionUrl: string | null;
  status: NotificationStatus;
  readAt: string | null;
  createdAt: string;
}

// ============================================================================
// Notification Preferences Types
// ============================================================================

export interface NotificationPreferences {
  id: string;
  userId: string;
  // Channel preferences
  smsEnabled: boolean;
  whatsappEnabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  // Type preferences
  appointmentReminders: boolean;
  paymentNotifications: boolean;
  prescriptionAlerts: boolean;
  medicineReminders: boolean;
  promotionalMessages: boolean;
  healthTips: boolean;
  // Timing preferences
  quietHoursEnabled: boolean;
  quietHoursStart: string | null;
  quietHoursEnd: string | null;
  preferredLanguage: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateNotificationPreferencesInput {
  smsEnabled?: boolean;
  whatsappEnabled?: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  appointmentReminders?: boolean;
  paymentNotifications?: boolean;
  prescriptionAlerts?: boolean;
  medicineReminders?: boolean;
  promotionalMessages?: boolean;
  healthTips?: boolean;
  quietHoursEnabled?: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  preferredLanguage?: string;
}

// ============================================================================
// Device Token Types
// ============================================================================

export interface DeviceToken {
  id: string;
  userId: string;
  token: string;
  platform: 'ios' | 'android' | 'web';
  deviceInfo: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterDeviceTokenInput {
  token: string;
  platform: 'ios' | 'android' | 'web';
  deviceInfo?: string;
}

// ============================================================================
// Notification Template Types
// ============================================================================

export interface NotificationTemplate {
  id: string;
  type: NotificationType;
  channel: NotificationChannel;
  name: string;
  subject: string | null;
  title: string;
  body: string;
  variables: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Scheduled Notification Types
// ============================================================================

export interface ScheduledNotification {
  id: string;
  userId: string;
  type: NotificationType;
  scheduledFor: string;
  data: Record<string, unknown>;
  status: 'pending' | 'sent' | 'cancelled' | 'failed';
  sentAt: string | null;
  createdAt: string;
}
