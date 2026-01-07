/**
 * Admin API
 * Handles all admin-related API calls (dashboard, users, settings, etc.)
 */

import { api, buildQueryParams, type PaginationMeta } from '@/config/api';
import type {
  User,
  UserRole,
  Hospital,
  VerificationStatus,
  SupportTicket,
  TicketStatus,
  TicketPriority,
  AuditLog,
  SystemSetting,
} from '@/lib/types';

// =============================================================================
// DASHBOARD & STATS
// =============================================================================

/**
 * Dashboard stats
 */
export interface DashboardStats {
  totalUsers: number;
  totalPatients: number;
  totalDoctors: number;
  totalHospitals: number;
  totalAppointments: number;
  totalRevenue: number;
  pendingVerifications: number;
  openTickets: number;
  recentActivity: AuditLog[];
}

/**
 * Get admin dashboard stats
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  return api.get<DashboardStats>('/admin/dashboard');
}

/**
 * Get revenue statistics
 */
export async function getRevenueStats(
  filters: {
    startDate?: string;
    endDate?: string;
    groupBy?: 'day' | 'week' | 'month';
  } = {}
): Promise<{
  total: number;
  platformFees: number;
  data: Array<{ date: string; amount: number; count: number }>;
}> {
  const params = buildQueryParams(filters);
  return api.get('/admin/revenue', { params });
}

/**
 * Get user growth statistics
 */
export async function getUserGrowthStats(
  filters: {
    startDate?: string;
    endDate?: string;
    groupBy?: 'day' | 'week' | 'month';
    role?: UserRole;
  } = {}
): Promise<{
  total: number;
  data: Array<{ date: string; count: number }>;
}> {
  const params = buildQueryParams(filters);
  return api.get('/admin/users/growth', { params });
}

// =============================================================================
// USER MANAGEMENT
// =============================================================================

/**
 * User filters
 */
export interface UserFilters {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  isVerified?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

/**
 * List users
 */
export async function listUsers(
  filters: UserFilters = {}
): Promise<{ users: User[]; meta: PaginationMeta }> {
  const params = buildQueryParams(filters as Record<string, unknown>);
  const response = await api.getWithMeta<User[]>('/admin/users', { params });
  return {
    users: response.data,
    meta: response.meta!,
  };
}

/**
 * Get user by ID
 */
export async function getUser(id: string): Promise<User & { profile: unknown }> {
  return api.get(`/admin/users/${id}`);
}

/**
 * Update user
 */
export async function updateUser(
  id: string,
  data: {
    isActive?: boolean;
    isVerified?: boolean;
    role?: UserRole;
  }
): Promise<User> {
  return api.patch<User>(`/admin/users/${id}`, data);
}

/**
 * Delete user
 */
export async function deleteUser(id: string): Promise<void> {
  return api.delete<void>(`/admin/users/${id}`);
}

/**
 * Ban user
 */
export async function banUser(
  id: string,
  reason: string,
  duration?: number // in days, null for permanent
): Promise<User> {
  return api.post<User>(`/admin/users/${id}/ban`, { reason, duration });
}

/**
 * Unban user
 */
export async function unbanUser(id: string): Promise<User> {
  return api.post<User>(`/admin/users/${id}/unban`);
}

// =============================================================================
// HOSPITAL VERIFICATION
// =============================================================================

/**
 * Hospital verification filters
 */
export interface VerificationFilters {
  status?: VerificationStatus;
  page?: number;
  limit?: number;
}

/**
 * List pending hospital verifications
 */
export async function listPendingVerifications(
  filters: VerificationFilters = {}
): Promise<{ hospitals: Hospital[]; meta: PaginationMeta }> {
  const params = buildQueryParams({ ...filters, status: 'pending' });
  const response = await api.getWithMeta<Hospital[]>('/admin/hospitals/pending', { params });
  return {
    hospitals: response.data,
    meta: response.meta!,
  };
}

/**
 * Verify hospital
 */
export async function verifyHospital(
  id: string,
  data: {
    status: 'verified' | 'rejected';
    remarks?: string;
  }
): Promise<Hospital> {
  return api.patch<Hospital>(`/admin/hospitals/${id}/verify`, data);
}

/**
 * Request additional documents
 */
export async function requestDocuments(
  id: string,
  documentTypes: string[],
  message?: string
): Promise<{ sent: boolean }> {
  return api.post(`/admin/hospitals/${id}/request-documents`, {
    documentTypes,
    message,
  });
}

// =============================================================================
// SUPPORT TICKETS
// =============================================================================

/**
 * Support ticket filters
 */
export interface TicketFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedTo?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

/**
 * Create ticket input
 */
export interface CreateTicketInput {
  subject: string;
  description: string;
  category: string;
  priority?: TicketPriority;
  attachments?: string[];
}

/**
 * List support tickets
 */
export async function listTickets(
  filters: TicketFilters = {}
): Promise<{ tickets: SupportTicket[]; meta: PaginationMeta }> {
  const params = buildQueryParams(filters as Record<string, unknown>);
  const response = await api.getWithMeta<SupportTicket[]>('/admin/tickets', { params });
  return {
    tickets: response.data,
    meta: response.meta!,
  };
}

/**
 * Get ticket by ID
 */
export async function getTicket(id: string): Promise<SupportTicket> {
  return api.get<SupportTicket>(`/admin/tickets/${id}`);
}

/**
 * Create support ticket
 */
export async function createTicket(data: CreateTicketInput): Promise<SupportTicket> {
  return api.post<SupportTicket>('/support/tickets', data);
}

/**
 * Update ticket
 */
export async function updateTicket(
  id: string,
  data: {
    status?: TicketStatus;
    priority?: TicketPriority;
    assignedTo?: string;
  }
): Promise<SupportTicket> {
  return api.patch<SupportTicket>(`/admin/tickets/${id}`, data);
}

/**
 * Add reply to ticket
 */
export async function addTicketReply(
  id: string,
  message: string,
  attachments?: string[]
): Promise<SupportTicket> {
  return api.post<SupportTicket>(`/admin/tickets/${id}/reply`, {
    message,
    attachments,
  });
}

/**
 * Close ticket
 */
export async function closeTicket(id: string, resolution?: string): Promise<SupportTicket> {
  return api.post<SupportTicket>(`/admin/tickets/${id}/close`, { resolution });
}

// =============================================================================
// AUDIT LOGS
// =============================================================================

/**
 * Audit log filters
 */
export interface AuditLogFilters {
  userId?: string;
  action?: string;
  resource?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

/**
 * List audit logs
 */
export async function listAuditLogs(
  filters: AuditLogFilters = {}
): Promise<{ logs: AuditLog[]; meta: PaginationMeta }> {
  const params = buildQueryParams(filters as Record<string, unknown>);
  const response = await api.getWithMeta<AuditLog[]>('/admin/audit-logs', { params });
  return {
    logs: response.data,
    meta: response.meta!,
  };
}

/**
 * Get audit log by ID
 */
export async function getAuditLog(id: string): Promise<AuditLog> {
  return api.get<AuditLog>(`/admin/audit-logs/${id}`);
}

// =============================================================================
// SYSTEM SETTINGS
// =============================================================================

/**
 * Get all system settings
 */
export async function getSettings(): Promise<SystemSetting[]> {
  return api.get<SystemSetting[]>('/admin/settings');
}

/**
 * Get setting by key
 */
export async function getSetting(key: string): Promise<SystemSetting> {
  return api.get<SystemSetting>(`/admin/settings/${key}`);
}

/**
 * Update setting
 */
export async function updateSetting(
  key: string,
  value: string | number | boolean | object
): Promise<SystemSetting> {
  return api.put<SystemSetting>(`/admin/settings/${key}`, { value });
}

/**
 * Reset setting to default
 */
export async function resetSetting(key: string): Promise<SystemSetting> {
  return api.post<SystemSetting>(`/admin/settings/${key}/reset`);
}

// =============================================================================
// REPORTS
// =============================================================================

/**
 * Generate report
 */
export async function generateReport(
  type: 'users' | 'appointments' | 'payments' | 'hospitals',
  filters: {
    startDate?: string;
    endDate?: string;
    format?: 'csv' | 'xlsx' | 'pdf';
  } = {}
): Promise<{ url: string; expiresAt: string }> {
  const params = buildQueryParams(filters);
  return api.post(`/admin/reports/${type}`, {}, { params });
}

/**
 * Get scheduled reports
 */
export async function getScheduledReports(): Promise<
  Array<{
    id: string;
    type: string;
    schedule: string;
    recipients: string[];
    lastRun?: string;
    nextRun?: string;
  }>
> {
  return api.get('/admin/reports/scheduled');
}

// =============================================================================
// API NAMESPACE EXPORTS
// =============================================================================

/**
 * Users API
 */
export const usersApi = {
  list: listUsers,
  get: getUser,
  update: updateUser,
  delete: deleteUser,
  ban: banUser,
  unban: unbanUser,
};

/**
 * Verification API
 */
export const verificationApi = {
  listPending: listPendingVerifications,
  verify: verifyHospital,
  requestDocuments,
};

/**
 * Tickets API
 */
export const ticketsApi = {
  list: listTickets,
  get: getTicket,
  create: createTicket,
  update: updateTicket,
  reply: addTicketReply,
  close: closeTicket,
};

/**
 * Audit Logs API
 */
export const auditLogsApi = {
  list: listAuditLogs,
  get: getAuditLog,
};

/**
 * Settings API
 */
export const settingsApi = {
  getAll: getSettings,
  get: getSetting,
  update: updateSetting,
  reset: resetSetting,
};

/**
 * Reports API
 */
export const reportsApi = {
  generate: generateReport,
  getScheduled: getScheduledReports,
};

/**
 * Admin API namespace export
 */
export const adminApi = {
  getDashboardStats,
  getRevenueStats,
  getUserGrowthStats,
  users: usersApi,
  verification: verificationApi,
  tickets: ticketsApi,
  auditLogs: auditLogsApi,
  settings: settingsApi,
  reports: reportsApi,
};
