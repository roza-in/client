/**
 * ROZX Healthcare Platform — Pharmacy Feature Module
 */

// API
export {
    searchMedicines,
    getMedicine,
    createOrder,
    getOrders,
    getOrder,
    getOrderByNumber,
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
    getReturnByNumber,
    createReturn,
    reviewReturn,
    completeReturnPickup,
    getPharmacySettlementStats,
    getMyPharmacySettlements,
    getAllPharmacySettlements,
    createPharmacySettlement,
    getPharmacySettlement,
    processPharmacySettlement,
    completePharmacySettlement,
} from './api/pharmacy-api';
export type { ReturnStats, PharmacySettlementStats } from './api/pharmacy-api';

// Hooks
export {
    pharmacyKeys,
    useMedicineSearch,
    useMedicine,
    useOrders,
    useOrder,
    useOrderStats,
    useHospitalOrders,
    useHospitalOrderStats,
    useCreateOrder,
    useCancelOrder,
    useConfirmOrder,
    useUpdateOrderStatus,
    useReturnStats,
    useAllReturns,
    useMyReturns,
    useReturn,
    useCreateReturn,
    useReviewReturn,
    useCompleteReturnPickup,
    usePharmacySettlementStats,
    useMyPharmacySettlements,
    useAllPharmacySettlements,
    usePharmacySettlement,
    useProcessPharmacySettlement,
    useCompletePharmacySettlement,
} from './hooks/use-pharmacy';
