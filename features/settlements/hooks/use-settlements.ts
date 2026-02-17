'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getSettlementStats,
    getMySettlements,
    getAllSettlements,
    calculateSettlement,
    getSettlement,
    approveSettlement,
    initiateSettlementPayout,
    completeSettlement,
} from '../api/settlements-api';
import type {
    CalculateSettlementInput,
    CompleteSettlementInput,
    SettlementFilters,
} from '@/types';

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const settlementKeys = {
    all: ['settlements'] as const,
    stats: () => [...settlementKeys.all, 'stats'] as const,
    lists: () => [...settlementKeys.all, 'list'] as const,
    myList: (filters: Record<string, unknown>) => [...settlementKeys.lists(), 'my', filters] as const,
    allList: (filters: Record<string, unknown>) => [...settlementKeys.lists(), 'all', filters] as const,
    details: () => [...settlementKeys.all, 'detail'] as const,
    detail: (id: string) => [...settlementKeys.details(), id] as const,
};

// ─── Query Hooks ──────────────────────────────────────────────────────────────

export function useSettlementStats() {
    return useQuery({
        queryKey: settlementKeys.stats(),
        queryFn: getSettlementStats,
        staleTime: 5 * 60 * 1000,
    });
}

export function useMySettlements(filters: SettlementFilters = {}) {
    return useQuery({
        queryKey: settlementKeys.myList(filters),
        queryFn: () => getMySettlements(filters),
        staleTime: 2 * 60 * 1000,
    });
}

export function useAllSettlements(filters: SettlementFilters = {}) {
    return useQuery({
        queryKey: settlementKeys.allList(filters),
        queryFn: () => getAllSettlements(filters),
        staleTime: 2 * 60 * 1000,
    });
}

export function useSettlement(id: string) {
    return useQuery({
        queryKey: settlementKeys.detail(id),
        queryFn: () => getSettlement(id),
        enabled: !!id,
        staleTime: 2 * 60 * 1000,
    });
}

// ─── Mutation Hooks ───────────────────────────────────────────────────────────

export function useCalculateSettlement() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: CalculateSettlementInput) => calculateSettlement(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: settlementKeys.all });
        },
    });
}

export function useApproveSettlement() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => approveSettlement(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: settlementKeys.all });
        },
    });
}

export function useInitiateSettlementPayout() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => initiateSettlementPayout(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: settlementKeys.all });
        },
    });
}

export function useCompleteSettlement() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: CompleteSettlementInput }) =>
            completeSettlement(id, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: settlementKeys.all });
        },
    });
}
