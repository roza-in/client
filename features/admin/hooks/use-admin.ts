/**
 * Admin Feature - Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAdminStats,
    getPlatformAnalytics,
    listHospitals,
    listDoctors,
    listPendingHospitals,
    listPendingDoctors,
    getRevenueTrends,
    verifyHospital,
    verifyDoctor,
    updateDoctorStatus,
    listPatients,
    getUser,
    updateUserStatus,
    deleteUser
} from '../api/admin';

export function useAdminStats() {
    return useQuery({
        queryKey: ['admin', 'stats'],
        queryFn: getAdminStats,
    });
}

export function usePlatformAnalytics() {
    return useQuery({
        queryKey: ['admin', 'analytics'],
        queryFn: getPlatformAnalytics,
    });
}

export function useRevenueTrends(period: string = 'week') {
    return useQuery({
        queryKey: ['admin', 'analytics', 'revenue', period],
        queryFn: () => getRevenueTrends(period),
    });
}

export function useAdminHospitals(params: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc'
}) {
    return useQuery({
        queryKey: ['admin', 'hospitals', params],
        queryFn: () => listHospitals(params),
    });
}

export function useAdminDoctors(params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string
}) {
    return useQuery({
        queryKey: ['admin', 'doctors', params],
        queryFn: () => listDoctors(params),
    });
}

export function useAdminPatients(params: {
    page?: number;
    limit?: number;
    search?: string
}) {
    return useQuery({
        queryKey: ['admin', 'patients', params],
        queryFn: () => listPatients(params),
    });
}

export function useAdminUser(id: string) {
    return useQuery({
        queryKey: ['admin', 'users', id],
        queryFn: () => getUser(id),
    });
}

export function usePendingVerifications() {
    return useQuery({
        queryKey: ['admin', 'pending-verifications'],
        queryFn: async () => {
            const [hospData, docData] = await Promise.all([
                listPendingHospitals({ limit: 5 }),
                listPendingDoctors({ limit: 5 })
            ]);
            return {
                hospitals: (hospData as any).data || [],
                doctors: (docData as any).data || []
            };
        }
    });
}

export function useVerifyHospital() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status, remarks }: { id: string, status: 'verified' | 'rejected', remarks?: string }) =>
            verifyHospital(id, status, remarks),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'pending-verifications'] });
            queryClient.invalidateQueries({ queryKey: ['hospitals'] });
        }
    });
}

export function useVerifyDoctor() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status, remarks }: { id: string, status: 'verified' | 'rejected', remarks?: string }) =>
            verifyDoctor(id, status, remarks),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'pending-verifications'] });
            queryClient.invalidateQueries({ queryKey: ['doctors'] });
        }
    });
}
export function useUpdateDoctorStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, is_active }: { id: string, is_active: boolean }) =>
            updateDoctorStatus(id, is_active),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'doctors'] });
            queryClient.invalidateQueries({ queryKey: ['doctors'] });
        }
    });
}

export function useUpdateUserStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, is_active }: { id: string, is_active: boolean }) =>
            updateUserStatus(id, is_active),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users', id] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'patients'] });
        }
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'patients'] });
        }
    });
}
