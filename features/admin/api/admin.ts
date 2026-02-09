/**
 * Admin Feature - API
 */

import { api } from '@/lib/api';
import { endpoints } from '@/lib/api/endpoints';
import {
    AdminDashboardStats,
    VerificationItem,
    PlatformAnalytics,
    AdminSettings,
    TrendSeriesItem
} from '../types';

/**
 * Get core dashboard stats
 */
export async function getAdminStats(): Promise<AdminDashboardStats> {
    return api.get<AdminDashboardStats>(endpoints.admin.stats);
}

/**
 * Get platform analytics overview
 */
export async function getPlatformAnalytics(): Promise<PlatformAnalytics> {
    return api.get<PlatformAnalytics>(endpoints.admin.analytics);
}

/**
 * Get revenue trends
 */
export async function getRevenueTrends(period: string = 'week'): Promise<TrendSeriesItem[]> {
    return api.get<TrendSeriesItem[]>(endpoints.admin.revenueTrends, { params: { period } });
}

/**
 * List hospitals (generic)
 */
export async function listHospitals(params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc'
}): Promise<{ data: any[]; meta?: any }> {
    return api.getWithMeta<any[]>(endpoints.admin.hospitals, { params });
}

/**
 * List doctors (generic)
 */
export async function listDoctors(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string
}): Promise<{ data: any[]; meta?: any }> {
    return api.getWithMeta<any[]>(endpoints.admin.doctors, { params });
}

/**
 * List patients (specific user role)
 */
export async function listPatients(params?: {
    page?: number;
    limit?: number;
    search?: string
}): Promise<{ data: any[]; meta?: any }> {
    return api.getWithMeta<any[]>(endpoints.admin.patients, { params });
}

/**
 * Get a single user's detail
 */
export async function getUser(id: string): Promise<any> {
    return api.get(endpoints.admin.user(id));
}

/**
 * List pending hospital verifications
 */
export async function listPendingHospitals(params?: { page?: number; limit?: number }): Promise<{ data: any[]; meta?: any }> {
    return listHospitals({ ...params, status: 'pending' });
}

/**
 * List pending doctor verifications
 */
export async function listPendingDoctors(params?: { page?: number; limit?: number }): Promise<{ data: any[]; meta?: any }> {
    return listDoctors({ ...params, status: 'pending' });
}

/**
 * Verify a hospital
 */
export async function verifyHospital(id: string, status: 'verified' | 'rejected' | 'under_review', remarks?: string): Promise<any> {
    return api.patch(endpoints.admin.verifyHospital(id), { status, remarks });
}

/**
 * Verify a doctor
 */
export async function verifyDoctor(id: string, status: 'verified' | 'rejected' | 'under_review', remarks?: string): Promise<any> {
    return api.patch(endpoints.admin.verifyDoctor(id), { status, remarks });
}

/**
 * Delete a doctor
 */
export async function deleteDoctor(id: string): Promise<void> {
    return api.delete(endpoints.admin.doctor(id));
}

/**
 * Delete a hospital
 */
export async function deleteHospital(id: string): Promise<void> {
    return api.delete(endpoints.admin.deleteHospital(id));
}

/**
 * Update hospital active status
 */
export async function updateHospitalStatus(id: string, is_active: boolean): Promise<void> {
    return api.patch(endpoints.admin.updateHospitalStatus(id), { is_active });
}

/**
 * Update doctor active status
 */
export async function updateDoctorStatus(id: string, is_active: boolean): Promise<void> {
    return api.patch(endpoints.admin.updateDoctorStatus(id), { is_active });
}

/**
 * Update user active status (patients/general)
 */
export async function updateUserStatus(id: string, is_active: boolean): Promise<void> {
    return api.patch(endpoints.admin.user(id) + '/status', { is_active });
}

/**
 * Delete a user account (patients/general)
 */
export async function deleteUser(id: string): Promise<void> {
    return api.delete(endpoints.admin.user(id));
}

/**
 * Reject a doctor verification request
 */
export async function rejectDoctor(id: string, remarks: string): Promise<any> {
    return api.patch(endpoints.admin.rejectDoctor(id), { remarks });
}

/**
 * Get system settings
 */
export async function getAdminSettings(): Promise<AdminSettings[]> {
    return api.get(endpoints.admin.platformFees);
}
