/**
 * Pharmacy API Functions
 */
import { api } from '@/lib/api';
import type {
    Medicine,
    MedicineListItem,
    MedicineOrder,
    MedicineOrderWithDetails,
    MedicineOrderListItem,
    MedicineOrderItem,
    MedicineReturn,
    MedicineReturnWithDetails,
    PharmacySettlement,
    MedicineOrderStats,
    CreateMedicineOrderInput,
    CancelOrderInput,
    CreateReturnInput,
    MedicineSearchFilters,
    MedicineOrderFilters,
    MedicineReturnFilters,
} from '@/types';
import type { PaginationMeta } from '@/lib/api';

const PHARMACY_BASE = '/pharmacy';

// ─── Medicine Endpoints ──────────────────────────────────────────────────────

export async function searchMedicines(filters: MedicineSearchFilters = {}) {
    const { data, meta } = await api.getWithMeta<MedicineListItem[]>(
        `${PHARMACY_BASE}/medicines`,
        { params: filters }
    );
    return { medicines: data, pagination: meta };
}

export async function getMedicine(id: string) {
    return api.get<Medicine>(`${PHARMACY_BASE}/medicines/${id}`);
}

// ─── Order Endpoints ──────────────────────────────────────────────────────────

export async function createOrder(input: CreateMedicineOrderInput) {
    return api.post<MedicineOrder>(`${PHARMACY_BASE}/orders`, input);
}

export async function getOrders(filters: MedicineOrderFilters = {}) {
    const { data, meta } = await api.getWithMeta<MedicineOrderListItem[]>(
        `${PHARMACY_BASE}/orders`,
        { params: filters }
    );
    return { orders: data, pagination: meta };
}

export async function getOrder(id: string) {
    return api.get<MedicineOrderWithDetails>(`${PHARMACY_BASE}/orders/${id}`);
}

export async function getOrderByNumber(orderNumber: string) {
    return api.get<MedicineOrderWithDetails>(
        `${PHARMACY_BASE}/orders/number/${orderNumber}`
    );
}

export async function cancelOrder(id: string, input: CancelOrderInput) {
    return api.post<MedicineOrder>(`${PHARMACY_BASE}/orders/${id}/cancel`, input);
}

export async function getHospitalOrders(hospitalId: string, filters: MedicineOrderFilters = {}) {
    const { data, meta } = await api.getWithMeta<MedicineOrderListItem[]>(
        `${PHARMACY_BASE}/orders/hospital/${hospitalId}`,
        { params: filters }
    );
    return { orders: data, pagination: meta };
}

export async function confirmOrder(id: string) {
    return api.post<MedicineOrder>(`${PHARMACY_BASE}/orders/${id}/confirm`);
}

export async function updateOrderStatus(id: string, status: string) {
    return api.patch<MedicineOrder>(`${PHARMACY_BASE}/orders/${id}/status`, { status });
}

export async function getOrderStats() {
    return api.get<MedicineOrderStats>(`${PHARMACY_BASE}/orders/stats`);
}

export async function getHospitalOrderStats(hospitalId: string) {
    return api.get<MedicineOrderStats>(
        `${PHARMACY_BASE}/orders/hospital/${hospitalId}/stats`
    );
}

// ─── Return Endpoints ─────────────────────────────────────────────────────────

export interface ReturnStats {
    totalReturns: number;
    pendingReturns: number;
    approvedReturns: number;
    rejectedReturns: number;
    totalRefundAmount: number;
}

export async function getReturnStats() {
    return api.get<ReturnStats>(`${PHARMACY_BASE}/returns/stats`);
}

export async function getAllReturns(filters: MedicineReturnFilters = {}) {
    const { data, meta } = await api.getWithMeta<MedicineReturn[]>(
        `${PHARMACY_BASE}/returns/all`,
        { params: filters }
    );
    return { returns: data, pagination: meta };
}

export async function getMyReturns(filters: MedicineReturnFilters = {}) {
    const { data, meta } = await api.getWithMeta<MedicineReturn[]>(
        `${PHARMACY_BASE}/returns`,
        { params: filters }
    );
    return { returns: data, pagination: meta };
}

export async function getReturn(id: string) {
    return api.get<MedicineReturnWithDetails>(`${PHARMACY_BASE}/returns/${id}`);
}

export async function getReturnByNumber(returnNumber: string) {
    return api.get<MedicineReturnWithDetails>(
        `${PHARMACY_BASE}/returns/number/${returnNumber}`
    );
}

export async function createReturn(orderId: string, input: Omit<CreateReturnInput, 'orderId'>) {
    return api.post<MedicineReturn>(`${PHARMACY_BASE}/returns/${orderId}`, input);
}

export async function reviewReturn(id: string, input: { approved: boolean; reviewNotes?: string }) {
    return api.post<MedicineReturn>(`${PHARMACY_BASE}/returns/${id}/review`, input);
}

export async function completeReturnPickup(id: string) {
    return api.post<MedicineReturn>(`${PHARMACY_BASE}/returns/${id}/pickup-complete`);
}

// ─── Settlement Endpoints ─────────────────────────────────────────────────────

export interface PharmacySettlementStats {
    totalSettlements: number;
    pendingSettlements: number;
    completedSettlements: number;
    totalAmountSettled: number;
    totalPendingAmount: number;
}

export async function getPharmacySettlementStats() {
    return api.get<PharmacySettlementStats>(`${PHARMACY_BASE}/settlements/stats`);
}

export async function getMyPharmacySettlements(filters: Record<string, string | number | boolean | string[] | null | undefined> = {}) {
    const { data, meta } = await api.getWithMeta<PharmacySettlement[]>(
        `${PHARMACY_BASE}/settlements/my`,
        { params: filters }
    );
    return { settlements: data, pagination: meta };
}

export async function getAllPharmacySettlements(filters: Record<string, string | number | boolean | string[] | null | undefined> = {}) {
    const { data, meta } = await api.getWithMeta<PharmacySettlement[]>(
        `${PHARMACY_BASE}/settlements`,
        { params: filters }
    );
    return { settlements: data, pagination: meta };
}

export async function createPharmacySettlement(input: { hospitalId: string; periodStart: string; periodEnd: string }) {
    return api.post<PharmacySettlement>(`${PHARMACY_BASE}/settlements`, input);
}

export async function getPharmacySettlement(id: string) {
    return api.get<PharmacySettlement>(`${PHARMACY_BASE}/settlements/${id}`);
}

export async function processPharmacySettlement(id: string) {
    return api.post<PharmacySettlement>(`${PHARMACY_BASE}/settlements/${id}/process`);
}

export async function completePharmacySettlement(id: string, input: { paymentMode: string; utrNumber: string }) {
    return api.post<PharmacySettlement>(
        `${PHARMACY_BASE}/settlements/${id}/complete`,
        input
    );
}
