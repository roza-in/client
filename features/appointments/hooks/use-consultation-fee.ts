'use client';

import { useQuery } from '@tanstack/react-query';
import { bookingApi } from '../api/book-appointment';
import type { ConsultationType } from '@/types';

interface FeeInput {
    doctorId: string;
    hospitalId?: string;
    consultationType: ConsultationType;
}

/**
 * Hook to fetch itemized consultation fee breakdown
 */
export function useConsultationFee(input: FeeInput | null) {
    return useQuery({
        queryKey: ['consultation-fee', input?.doctorId, input?.hospitalId, input?.consultationType],
        queryFn: () => bookingApi.getConsultationFee(input!.doctorId, input!.consultationType),
        enabled: !!input?.doctorId && !!input?.consultationType,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
