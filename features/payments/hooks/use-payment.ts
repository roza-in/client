/**
 * Payments Feature - Payment Hook
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getPayment,
    requestRefund,
    type PaymentFilters,
} from '../api/payments';
import { toast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/api';

// =============================================================================
// Query Keys
// =============================================================================

export const paymentKeys = {
    all: ['payments'] as const,
    lists: () => [...paymentKeys.all, 'list'] as const,
    list: (filters: PaymentFilters) => [...paymentKeys.lists(), filters] as const,
    details: () => [...paymentKeys.all, 'detail'] as const,
    detail: (id: string) => [...paymentKeys.details(), id] as const,
};

// =============================================================================
// Hooks
// =============================================================================

/**
 * Hook to fetch a single payment
 */
export function usePayment(id: string | null) {
    return useQuery({
        queryKey: id ? paymentKeys.detail(id) : ['payment', 'disabled'],
        queryFn: () => getPayment(id!),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Hook to request refund
 */
export function useRequestRefund() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ paymentId, reason }: { paymentId: string; reason: string }) =>
            requestRefund(paymentId, reason),
        onSuccess: () => {
            toast.success('Refund request submitted');
            queryClient.invalidateQueries({ queryKey: paymentKeys.all });
        },
        onError: (err) => {
            toast.error(getErrorMessage(err));
        },
    });
}
