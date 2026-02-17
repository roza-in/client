/**
 * Settlements API Functions
 */
import { api } from '@/lib/api';
import type {
    Settlement,
    SettlementListItem,
    SettlementWithDetails,
    SettlementStats,
    CalculateSettlementInput,
    CompleteSettlementInput,
    SettlementFilters,
} from '@/types';

const SETTLEMENTS_BASE = '/settlements';

export async function getSettlementStats() {
    return api.get<SettlementStats>(`${SETTLEMENTS_BASE}/stats`);
}

export async function getMySettlements(filters: SettlementFilters = {}) {
    const { data, meta } = await api.getWithMeta<SettlementListItem[]>(
        `${SETTLEMENTS_BASE}/my`,
        { params: filters }
    );
    return { settlements: data, pagination: meta };
}

export async function getAllSettlements(filters: SettlementFilters = {}) {
    const { data, meta } = await api.getWithMeta<SettlementListItem[]>(
        SETTLEMENTS_BASE,
        { params: filters }
    );
    return { settlements: data, pagination: meta };
}

export async function calculateSettlement(input: CalculateSettlementInput) {
    return api.post<Settlement>(SETTLEMENTS_BASE, input);
}

export async function getSettlement(id: string) {
    return api.get<SettlementWithDetails>(`${SETTLEMENTS_BASE}/${id}`);
}

export async function approveSettlement(id: string) {
    return api.post<Settlement>(`${SETTLEMENTS_BASE}/${id}/approve`);
}

export async function initiateSettlementPayout(id: string) {
    return api.post<Settlement>(`${SETTLEMENTS_BASE}/${id}/initiate`);
}

export async function completeSettlement(id: string, input: CompleteSettlementInput) {
    return api.post<Settlement>(`${SETTLEMENTS_BASE}/${id}/complete`, input);
}
