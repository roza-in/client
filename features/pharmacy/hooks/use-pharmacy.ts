'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '@/lib/api';
import {
    searchMedicines,
    getMedicine,
    createOrder,
    getOrders,
    getOrder,
    cancelOrder,
    getHospitalOrders,
    confirmOrder,
    updateOrderStatus,
    getOrderStats,
    getHospitalOrderStats,
    getReturnStats,
    getAllReturns,
    getMyReturns,
    getReturn,
    createReturn,
    reviewReturn,
    completeReturnPickup,
    getPharmacySettlementStats,
    getMyPharmacySettlements,
    getAllPharmacySettlements,
    getPharmacySettlement,
    processPharmacySettlement,
    completePharmacySettlement,
} from '../api/pharmacy-api';
import type {
    MedicineSearchFilters,
    MedicineOrderFilters,
    MedicineReturnFilters,
    CreateMedicineOrderInput,
    CancelOrderInput,
    CreateReturnInput,
} from '@/types';

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const pharmacyKeys = {
    all: ['pharmacy'] as const,
    medicines: () => [...pharmacyKeys.all, 'medicines'] as const,
    medicineList: (filters: Record<string, unknown>) => [...pharmacyKeys.medicines(), 'list', filters] as const,
    medicineDetail: (id: string) => [...pharmacyKeys.medicines(), 'detail', id] as const,
    orders: () => [...pharmacyKeys.all, 'orders'] as const,
    orderList: (filters: Record<string, unknown>) => [...pharmacyKeys.orders(), 'list', filters] as const,
    orderDetail: (id: string) => [...pharmacyKeys.orders(), 'detail', id] as const,
    orderStats: () => [...pharmacyKeys.orders(), 'stats'] as const,
    hospitalOrders: (hospitalId: string, filters: Record<string, unknown>) =>
        [...pharmacyKeys.orders(), 'hospital', hospitalId, filters] as const,
    hospitalOrderStats: (hospitalId: string) =>
        [...pharmacyKeys.orders(), 'hospital-stats', hospitalId] as const,
    returns: () => [...pharmacyKeys.all, 'returns'] as const,
    returnList: (filters: Record<string, unknown>) => [...pharmacyKeys.returns(), 'list', filters] as const,
    returnDetail: (id: string) => [...pharmacyKeys.returns(), 'detail', id] as const,
    returnStats: () => [...pharmacyKeys.returns(), 'stats'] as const,
    myReturns: (filters: Record<string, unknown>) => [...pharmacyKeys.returns(), 'my', filters] as const,
    settlements: () => [...pharmacyKeys.all, 'settlements'] as const,
    settlementStats: () => [...pharmacyKeys.settlements(), 'stats'] as const,
    mySettlements: (filters: Record<string, unknown>) => [...pharmacyKeys.settlements(), 'my', filters] as const,
    allSettlements: (filters: Record<string, unknown>) => [...pharmacyKeys.settlements(), 'all', filters] as const,
    settlementDetail: (id: string) => [...pharmacyKeys.settlements(), 'detail', id] as const,
};

// ─── Medicine Hooks ───────────────────────────────────────────────────────────

export function useMedicineSearch(filters: MedicineSearchFilters = {}) {
    return useQuery({
        queryKey: pharmacyKeys.medicineList(filters),
        queryFn: () => searchMedicines(filters),
        staleTime: 2 * 60 * 1000,
    });
}

export function useMedicine(id: string) {
    return useQuery({
        queryKey: pharmacyKeys.medicineDetail(id),
        queryFn: () => getMedicine(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
}

// ─── Order Hooks ──────────────────────────────────────────────────────────────

export function useOrders(filters: MedicineOrderFilters = {}) {
    return useQuery({
        queryKey: pharmacyKeys.orderList(filters),
        queryFn: () => getOrders(filters),
        staleTime: 1 * 60 * 1000,
    });
}

export function useOrder(id: string) {
    return useQuery({
        queryKey: pharmacyKeys.orderDetail(id),
        queryFn: () => getOrder(id),
        enabled: !!id,
        staleTime: 1 * 60 * 1000,
    });
}

export function useOrderStats() {
    return useQuery({
        queryKey: pharmacyKeys.orderStats(),
        queryFn: getOrderStats,
        staleTime: 2 * 60 * 1000,
    });
}

export function useHospitalOrders(hospitalId: string, filters: MedicineOrderFilters = {}) {
    return useQuery({
        queryKey: pharmacyKeys.hospitalOrders(hospitalId, filters),
        queryFn: () => getHospitalOrders(hospitalId, filters),
        enabled: !!hospitalId,
        staleTime: 1 * 60 * 1000,
    });
}

export function useHospitalOrderStats(hospitalId: string) {
    return useQuery({
        queryKey: pharmacyKeys.hospitalOrderStats(hospitalId),
        queryFn: () => getHospitalOrderStats(hospitalId),
        enabled: !!hospitalId,
        staleTime: 2 * 60 * 1000,
    });
}

export function useCreateOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: CreateMedicineOrderInput) => createOrder(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: pharmacyKeys.orders() });
        },
    });
}

export function useCancelOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: CancelOrderInput }) =>
            cancelOrder(id, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: pharmacyKeys.orders() });
        },
    });
}

export function useConfirmOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => confirmOrder(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: pharmacyKeys.orders() });
        },
    });
}

export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            updateOrderStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: pharmacyKeys.orders() });
        },
    });
}

// ─── Return Hooks ─────────────────────────────────────────────────────────────

export function useReturnStats() {
    return useQuery({
        queryKey: pharmacyKeys.returnStats(),
        queryFn: getReturnStats,
        staleTime: 2 * 60 * 1000,
    });
}

export function useAllReturns(filters: MedicineReturnFilters = {}) {
    return useQuery({
        queryKey: pharmacyKeys.returnList(filters),
        queryFn: () => getAllReturns(filters),
        staleTime: 1 * 60 * 1000,
    });
}

export function useMyReturns(filters: MedicineReturnFilters = {}) {
    return useQuery({
        queryKey: pharmacyKeys.myReturns(filters),
        queryFn: () => getMyReturns(filters),
        staleTime: 1 * 60 * 1000,
    });
}

export function useReturn(id: string) {
    return useQuery({
        queryKey: pharmacyKeys.returnDetail(id),
        queryFn: () => getReturn(id),
        enabled: !!id,
        staleTime: 1 * 60 * 1000,
    });
}

export function useCreateReturn() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ orderId, input }: { orderId: string; input: Omit<CreateReturnInput, 'orderId'> }) =>
            createReturn(orderId, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: pharmacyKeys.returns() });
            queryClient.invalidateQueries({ queryKey: pharmacyKeys.orders() });
        },
    });
}

export function useReviewReturn() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: { approved: boolean; reviewNotes?: string } }) =>
            reviewReturn(id, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: pharmacyKeys.returns() });
        },
    });
}

export function useCompleteReturnPickup() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => completeReturnPickup(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: pharmacyKeys.returns() });
        },
    });
}

// ─── Settlement Hooks ─────────────────────────────────────────────────────────

export function usePharmacySettlementStats() {
    return useQuery({
        queryKey: pharmacyKeys.settlementStats(),
        queryFn: getPharmacySettlementStats,
        staleTime: 5 * 60 * 1000,
    });
}

export function useMyPharmacySettlements(filters: Record<string, string | number | boolean | string[] | null | undefined> = {}) {
    return useQuery({
        queryKey: pharmacyKeys.mySettlements(filters),
        queryFn: () => getMyPharmacySettlements(filters),
        staleTime: 2 * 60 * 1000,
    });
}

export function useAllPharmacySettlements(filters: Record<string, string | number | boolean | string[] | null | undefined> = {}) {
    return useQuery({
        queryKey: pharmacyKeys.allSettlements(filters),
        queryFn: () => getAllPharmacySettlements(filters),
        staleTime: 2 * 60 * 1000,
    });
}

export function usePharmacySettlement(id: string) {
    return useQuery({
        queryKey: pharmacyKeys.settlementDetail(id),
        queryFn: () => getPharmacySettlement(id),
        enabled: !!id,
        staleTime: 2 * 60 * 1000,
    });
}

export function useProcessPharmacySettlement() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => processPharmacySettlement(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: pharmacyKeys.settlements() });
        },
    });
}

export function useCompletePharmacySettlement() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: { paymentMode: string; utrNumber: string } }) =>
            completePharmacySettlement(id, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: pharmacyKeys.settlements() });
        },
    });
}
