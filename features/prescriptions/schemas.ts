/**
 * Prescriptions Feature - Schemas
 */

export {
    medicationSchema,
    labTestSchema,
    createPrescriptionSchema,
    updatePrescriptionSchema,
    prescriptionFilterSchema,
} from '@/lib/validations';

export type {
    MedicationData as MedicationValidation,
    LabTestData as LabTestValidation,
    CreatePrescriptionData as CreatePrescriptionValidation,
    UpdatePrescriptionData as UpdatePrescriptionValidation,
    PrescriptionFilterData as PrescriptionFilterValidation,
} from '@/lib/validations';
