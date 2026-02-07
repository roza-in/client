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
    MedicationInput,
    LabTestInput,
    CreatePrescriptionInput,
    UpdatePrescriptionInput,
    PrescriptionFilterInput,
} from '@/lib/validations';
