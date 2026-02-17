/**
 * Rozx Healthcare Platform — Pharmacy Model Types
 *
 * Covers medicines, medicine orders, order items, returns,
 * and pharmacy-level settlements.
 */

import type {
    MedicineCategory,
    MedicineSchedule,
    MedicineOrderStatus,
    DeliveryPartnerCode,
    PaymentStatus,
    SettlementStatus,
} from '../enums';

// =============================================================================
// Medicine Entity
// =============================================================================

export interface Medicine {
    id: string;
    sku: string;
    name: string;
    genericName: string | null;
    brand: string | null;
    manufacturer: string | null;
    category: MedicineCategory;
    schedule: MedicineSchedule;
    composition: string | null;
    strength: string | null;
    packSize: string | null;
    mrp: number;
    sellingPrice: number;
    discountPercent: number;
    hospitalCommissionPercent: number;
    isPrescriptionRequired: boolean;
    stockQuantity: number;
    lowStockThreshold: number;
    isInStock: boolean;
    isActive: boolean;
    isDiscontinued: boolean;
    description: string | null;
    usageInstructions: string | null;
    sideEffects: string | null;
    contraindications: string | null;
    drugInteractions: string | null;
    storageInstructions: string | null;
    slug: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    imageUrl: string | null;
    images: string[] | null;
    hsnCode: string | null;
    gstPercent: number;
    searchKeywords: string[] | null;
    createdAt: string;
    updatedAt: string;
}

// =============================================================================
// Medicine List Item
// =============================================================================

export interface MedicineListItem {
    id: string;
    sku: string;
    name: string;
    genericName: string | null;
    brand: string | null;
    category: MedicineCategory;
    schedule: MedicineSchedule;
    mrp: number;
    sellingPrice: number;
    discountPercent: number;
    isPrescriptionRequired: boolean;
    isInStock: boolean;
    isActive: boolean;
    imageUrl: string | null;
}

// =============================================================================
// Medicine Order
// =============================================================================

export interface MedicineOrder {
    id: string;
    orderNumber: string | null;
    prescriptionId: string | null;
    patientId: string;
    familyMemberId: string | null;
    hospitalId: string | null;
    deliveryAddress: Record<string, unknown>;
    status: MedicineOrderStatus;
    statusHistory: Record<string, unknown>;
    itemsTotal: number;
    discountAmount: number;
    deliveryFee: number;
    gstAmount: number;
    totalAmount: number;
    hospitalCommission: number;
    platformCommission: number;
    requiresPrescription: boolean;
    prescriptionVerified: boolean;
    prescriptionVerifiedBy: string | null;
    prescriptionVerifiedAt: string | null;
    prescriptionRejectionReason: string | null;
    deliveryPartner: DeliveryPartnerCode | null;
    deliveryTrackingId: string | null;
    deliveryTrackingUrl: string | null;
    estimatedDeliveryAt: string | null;
    deliveryOtp: string | null;
    placedAt: string;
    confirmedAt: string | null;
    packedAt: string | null;
    dispatchedAt: string | null;
    deliveredAt: string | null;
    cancelledAt: string | null;
    cancelledBy: string | null;
    cancellationReason: string | null;
    paymentStatus: PaymentStatus;
    paymentId: string | null;
    patientNotes: string | null;
    internalNotes: string | null;
    createdAt: string;
    updatedAt: string;
}

// =============================================================================
// Medicine Order Item
// =============================================================================

export interface MedicineOrderItem {
    id: string;
    orderId: string;
    medicineId: string;
    prescriptionItemIndex: number | null;
    quantity: number;
    unitMrp: number;
    unitSellingPrice: number;
    discountPercent: number;
    subtotal: number;
    medicineName: string;
    medicineBrand: string | null;
    medicineStrength: string | null;
    medicinePackSize: string | null;
    requiresPrescription: boolean;
    isSubstitute: boolean;
    originalMedicineId: string | null;
    substitutionApproved: boolean;
    createdAt: string;
}

// =============================================================================
// Medicine Order with Details
// =============================================================================

export interface MedicineOrderWithDetails extends MedicineOrder {
    items: MedicineOrderItem[];
    patient: {
        id: string;
        name: string;
        phone: string;
        email: string | null;
    };
    hospital?: {
        id: string;
        name: string;
        city: string;
    };
}

// =============================================================================
// Medicine Order List Item
// =============================================================================

export interface MedicineOrderListItem {
    id: string;
    orderNumber: string | null;
    patientName: string;
    hospitalName: string | null;
    status: MedicineOrderStatus;
    totalAmount: number;
    itemCount: number;
    paymentStatus: PaymentStatus;
    placedAt: string;
    createdAt: string;
}

// =============================================================================
// Medicine Return
// =============================================================================

export interface MedicineReturn {
    id: string;
    returnNumber: string | null;
    orderId: string;
    reason: string;
    reasonDetails: string | null;
    items: Record<string, unknown>;
    photos: string[] | null;
    refundAmount: number;
    status: string;
    initiatedBy: string;
    initiatedAt: string;
    reviewedBy: string | null;
    reviewedAt: string | null;
    reviewNotes: string | null;
    pickupScheduledAt: string | null;
    pickupCompletedAt: string | null;
    refundId: string | null;
    createdAt: string;
    updatedAt: string;
}

// =============================================================================
// Medicine Return with Details
// =============================================================================

export interface MedicineReturnWithDetails extends MedicineReturn {
    order: {
        id: string;
        orderNumber: string | null;
        patientId: string;
        totalAmount: number;
    };
    patient: {
        id: string;
        name: string;
        phone: string;
    };
}

// =============================================================================
// Pharmacy Settlement
// =============================================================================

export interface PharmacySettlement {
    id: string;
    settlementNumber: string | null;
    hospitalId: string;
    periodStart: string;
    periodEnd: string;
    totalOrders: number;
    totalOrderValue: number;
    commissionRate: number;
    grossCommission: number;
    tdsAmount: number;
    otherDeductions: number;
    deductionDetails: Record<string, unknown> | null;
    netPayable: number;
    status: SettlementStatus;
    processedBy: string | null;
    processedAt: string | null;
    paymentMode: string | null;
    utrNumber: string | null;
    createdAt: string;
    updatedAt: string;
}

// =============================================================================
// Order Pricing Breakdown
// =============================================================================

export interface OrderPricingBreakdown {
    itemsTotal: number;
    discountAmount: number;
    deliveryFee: number;
    gstAmount: number;
    totalAmount: number;
}

// =============================================================================
// Medicine Order Stats
// =============================================================================

export interface MedicineOrderStats {
    totalOrders: number;
    pendingOrders: number;
    processingOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
}

// =============================================================================
// Input Types
// =============================================================================

export interface CreateMedicineOrderInput {
    prescriptionId?: string;
    familyMemberId?: string;
    hospitalId?: string;
    deliveryAddress: {
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        pincode: string;
        landmark?: string;
    };
    items: {
        medicineId: string;
        quantity: number;
    }[];
    patientNotes?: string;
}

export interface CancelOrderInput {
    reason: string;
}

export interface CreateReturnInput {
    orderId: string;
    reason: string;
    reasonDetails?: string;
    items: {
        medicineId: string;
        quantity: number;
    }[];
    photos?: string[];
}

// =============================================================================
// Filter Types
// =============================================================================

export interface MedicineSearchFilters {
    [key: string]: string | number | boolean | string[] | null | undefined;
    category?: MedicineCategory;
    schedule?: MedicineSchedule;
    inStock?: boolean;
    isPrescriptionRequired?: boolean;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: 'name' | 'price' | 'discount' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

export interface MedicineOrderFilters {
    [key: string]: string | number | boolean | string[] | null | undefined;
    patientId?: string;
    hospitalId?: string;
    status?: MedicineOrderStatus | MedicineOrderStatus[];
    paymentStatus?: PaymentStatus;
    startDate?: string;
    endDate?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'totalAmount' | 'placedAt';
    sortOrder?: 'asc' | 'desc';
}

export interface MedicineReturnFilters {
    [key: string]: string | number | boolean | string[] | null | undefined;
    orderId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}
