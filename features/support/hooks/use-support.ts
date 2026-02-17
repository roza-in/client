'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getSupportStats,
    getMyTickets,
    getAllTickets,
    createTicket,
    getTicket,
    replyToTicket,
    rateTicket,
    updateTicket,
    resolveTicket,
    closeTicket,
} from '../api/support-api';
import type {
    CreateTicketInput,
    ReplyToTicketInput,
    UpdateTicketInput,
    TicketFilters,
} from '@/types';

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const supportKeys = {
    all: ['support'] as const,
    stats: () => [...supportKeys.all, 'stats'] as const,
    tickets: () => [...supportKeys.all, 'tickets'] as const,
    myTickets: (filters: Record<string, unknown>) => [...supportKeys.tickets(), 'my', filters] as const,
    allTickets: (filters: Record<string, unknown>) => [...supportKeys.tickets(), 'all', filters] as const,
    detail: (id: string) => [...supportKeys.tickets(), 'detail', id] as const,
};

// ─── Query Hooks ──────────────────────────────────────────────────────────────

export function useSupportStats() {
    return useQuery({
        queryKey: supportKeys.stats(),
        queryFn: getSupportStats,
        staleTime: 2 * 60 * 1000,
    });
}

export function useMyTickets(filters: TicketFilters = {}) {
    return useQuery({
        queryKey: supportKeys.myTickets(filters),
        queryFn: () => getMyTickets(filters),
        staleTime: 1 * 60 * 1000,
    });
}

export function useAllTickets(filters: TicketFilters = {}) {
    return useQuery({
        queryKey: supportKeys.allTickets(filters),
        queryFn: () => getAllTickets(filters),
        staleTime: 1 * 60 * 1000,
    });
}

export function useTicket(id: string) {
    return useQuery({
        queryKey: supportKeys.detail(id),
        queryFn: () => getTicket(id),
        enabled: !!id,
        staleTime: 30 * 1000,
    });
}

// ─── Mutation Hooks ───────────────────────────────────────────────────────────

export function useCreateTicket() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: CreateTicketInput) => createTicket(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: supportKeys.tickets() });
            queryClient.invalidateQueries({ queryKey: supportKeys.stats() });
        },
    });
}

export function useReplyToTicket() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ ticketId, input }: { ticketId: string; input: ReplyToTicketInput }) =>
            replyToTicket(ticketId, input),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: supportKeys.detail(variables.ticketId) });
        },
    });
}

export function useRateTicket() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ ticketId, input }: { ticketId: string; input: { rating: number; feedback?: string } }) =>
            rateTicket(ticketId, input),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: supportKeys.detail(variables.ticketId) });
        },
    });
}

export function useUpdateTicket() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ ticketId, input }: { ticketId: string; input: UpdateTicketInput }) =>
            updateTicket(ticketId, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: supportKeys.tickets() });
            queryClient.invalidateQueries({ queryKey: supportKeys.stats() });
        },
    });
}

export function useResolveTicket() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ ticketId, input }: { ticketId: string; input: { resolutionNotes: string } }) =>
            resolveTicket(ticketId, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: supportKeys.tickets() });
            queryClient.invalidateQueries({ queryKey: supportKeys.stats() });
        },
    });
}

export function useCloseTicket() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (ticketId: string) => closeTicket(ticketId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: supportKeys.tickets() });
            queryClient.invalidateQueries({ queryKey: supportKeys.stats() });
        },
    });
}
