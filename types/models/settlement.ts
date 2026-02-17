/**
 * Rozx Healthcare Platform — Settlement & Payout Model Types
 *
 * Covers platform-level settlements, line items, payouts,
 * payout accounts, and daily summaries.
 */

import type {
    SettlementStatus,
    PayoutStatus,
    PayoutMode,
    KycStatus,
    SettlementFrequency,
} from '../enums';

// =============================================================================
// Settlement Entity
// =============================================================================

export interface Settlement {
    id: string;
    settlementNumber: string | null;
    entityType: string;
    entityId: string;
    periodStart: string;
    periodEnd: string;
    grossAmount: number;
    refundsAmount: number;
    commissionAmount: number;
    tdsAmount: number;
    otherDeductions: number;
    deductionDetails: Record<string, unknown> | null;
    netPayable: number;
    payoutAccountId: string | null;
    paymentMode: string | null;
    utrNumber: string | null;
    status: SettlementStatus;
    statusReason: string | null;
    approvedBy: string | null;
    approvedAt: string | null;
    processedAt: string | null;
    invoiceUrl: string | null;
    createdAt: string;
    updatedAt: string;
}

// =============================================================================
// Settlement Line Item
// =============================================================================

export interface SettlementLineItem {
    id: string;
    settlementId: string;
    transactionType: string;
    transactionId: string;
    transactionDate: string;
    grossAmount: number;
    commissionAmount: number;
    netAmount: number;
    description: string | null;
    createdAt: string;
}

// =============================================================================
// Settlement List Item
// =============================================================================

export interface SettlementListItem {
    id: string;
    settlementNumber: string | null;
    entityType: string;
    entityId: string;
    entityName: string;
    periodStart: string;
    periodEnd: string;
    netPayable: number;
    status: SettlementStatus;
    createdAt: string;
}

// =============================================================================
// Settlement with Relations
// =============================================================================

export interface SettlementWithDetails extends Settlement {
    lineItems: SettlementLineItem[];
    payouts: Payout[];
    entity: {
        id: string;
        name: string;
        type: string;
    };
}

// =============================================================================
// Payout Entity
// =============================================================================

export interface Payout {
    id: string;
    payoutNumber: string | null;
    settlementId: string;
    payoutAccountId: string;
    amount: number;
    currency: string;
    payoutMode: PayoutMode;
    gatewayProvider: string;
    gatewayPayoutId: string | null;
    gatewayResponse: Record<string, unknown> | null;
    status: PayoutStatus;
    statusReason: string | null;
    utrNumber: string | null;
    initiatedAt: string;
    completedAt: string | null;
    failedAt: string | null;
    reversedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

// =============================================================================
// Payout Account
// =============================================================================

export interface PayoutAccount {
    id: string;
    hospitalId: string;
    gatewayProvider: string;
    gatewayAccountId: string;
    gatewayContactId: string | null;
    accountHolderName: string | null;
    bankName: string | null;
    accountNumberMasked: string | null;
    ifscCode: string | null;
    kycStatus: KycStatus;
    kycVerifiedAt: string | null;
    settlementFrequency: SettlementFrequency | null;
    minPayoutAmount: number;
    isPrimary: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// =============================================================================
// Daily Settlement Summary
// =============================================================================

export interface DailySettlementSummary {
    id: string;
    summaryDate: string;
    entityType: string;
    entityId: string;
    totalAppointments: number;
    totalConsultationFees: number;
    totalPlatformFees: number;
    totalGatewayFees: number;
    totalRefunds: number;
    totalGst: number;
    totalTds: number;
    netSettlement: number;
    createdAt: string;
}

// =============================================================================
// Settlement Stats
// =============================================================================

export interface SettlementStats {
    totalSettlements: number;
    pendingSettlements: number;
    completedSettlements: number;
    failedSettlements: number;
    totalAmountSettled: number;
    totalPendingAmount: number;
    averageSettlementTime: number;
}

// =============================================================================
// Input Types
// =============================================================================

export interface CalculateSettlementInput {
    entityType: string;
    entityId: string;
    periodStart: string;
    periodEnd: string;
}

export interface CompleteSettlementInput {
    paymentMode: string;
    utrNumber: string;
    notes?: string;
}

// =============================================================================
// Filter Types
// =============================================================================

export interface SettlementFilters {
    [key: string]: string | number | boolean | string[] | null | undefined;
    entityType?: string;
    entityId?: string;
    status?: SettlementStatus | SettlementStatus[];
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'netPayable' | 'periodStart';
    sortOrder?: 'asc' | 'desc';
}

export interface PayoutFilters {
    settlementId?: string;
    status?: PayoutStatus | PayoutStatus[];
    payoutMode?: PayoutMode;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'amount' | 'initiatedAt';
    sortOrder?: 'asc' | 'desc';
}
