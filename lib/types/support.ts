/**
 * ROZX Healthcare Platform - Support & Admin Types
 */

import type {
  TicketStatus,
  TicketPriority,
  TicketCategory,
  AuditAction,
} from './enums';

// ============================================================================
// Support Ticket Types
// ============================================================================

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  category: TicketCategory;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo: string | null;
  appointmentId: string | null;
  paymentId: string | null;
  attachments: string[] | null;
  resolvedAt: string | null;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SupportTicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderType: 'user' | 'support' | 'system';
  message: string;
  attachments: string[] | null;
  isInternal: boolean;
  createdAt: string;
}

export interface SupportTicketWithMessages extends SupportTicket {
  messages: SupportTicketMessage[];
  user: {
    id: string;
    fullName: string;
    email: string | null;
    phone: string;
  };
}

export interface CreateTicketInput {
  category: TicketCategory;
  subject: string;
  description: string;
  priority?: TicketPriority;
  appointmentId?: string;
  paymentId?: string;
  attachments?: string[];
}

export interface AddTicketMessageInput {
  message: string;
  attachments?: string[];
}

export interface UpdateTicketInput {
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedTo?: string;
}

export interface TicketFilters {
  status?: TicketStatus | TicketStatus[];
  priority?: TicketPriority;
  category?: TicketCategory;
  assignedTo?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// ============================================================================
// Audit Log Types
// ============================================================================

export interface AuditLog {
  id: string;
  userId: string | null;
  action: AuditAction;
  resourceType: string;
  resourceId: string | null;
  oldValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface AuditLogFilters {
  userId?: string;
  action?: AuditAction;
  resourceType?: string;
  resourceId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// ============================================================================
// System Settings Types
// ============================================================================

export interface SystemSetting {
  id: string;
  key: string;
  value: unknown;
  description: string | null;
  isPublic: boolean;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// API Key Types
// ============================================================================

export interface ApiKey {
  id: string;
  hospitalId: string;
  name: string;
  keyPrefix: string;
  permissions: string[];
  rateLimit: number;
  isActive: boolean;
  lastUsedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

export interface CreateApiKeyInput {
  name: string;
  permissions: string[];
  rateLimit?: number;
  expiresAt?: string;
}

// ============================================================================
// Admin Dashboard Types
// ============================================================================

export interface AdminDashboardStats {
  totalUsers: number;
  totalPatients: number;
  totalDoctors: number;
  totalHospitals: number;
  totalAppointments: number;
  todayAppointments: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingVerifications: number;
  openTickets: number;
  activeUsers24h: number;
}

export interface PlatformMetrics {
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  averageAppointmentsPerDay: number;
  averageRevenuePerAppointment: number;
  platformFeeRevenue: number;
  userGrowthRate: number;
  appointmentGrowthRate: number;
}

// ============================================================================
// Report Types
// ============================================================================

export interface ReportFilters {
  reportType: 'revenue' | 'appointments' | 'users' | 'doctors' | 'hospitals';
  startDate: string;
  endDate: string;
  hospitalId?: string;
  doctorId?: string;
  groupBy?: 'day' | 'week' | 'month';
}

export interface ReportData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
  summary: Record<string, number>;
}
