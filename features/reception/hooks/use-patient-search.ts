import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { searchPatients } from '../api/reception.api';
import type { PatientSearchResult } from '../types';

/**
 * Hook for searching patients with debounce
 */
export function usePatientSearch(initialQuery: string = '') {
    const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
    const [query, setQuery] = useState(initialQuery);

    // Debounce the search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const result = useQuery({
        queryKey: ['patient-search', debouncedQuery],
        queryFn: () => searchPatients(debouncedQuery),
        enabled: debouncedQuery.length >= 2,
        staleTime: 60000, // Cache results for 1 minute
    });

    return {
        ...result,
        query,
        setQuery,
        patients: result.data || [],
    };
}
