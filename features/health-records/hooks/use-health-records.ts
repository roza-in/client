'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getHealthSummary,
    getFamilyMemberSummary,
    getDocuments,
    getDocument,
    uploadDocument,
    updateDocument,
    deleteDocument,
    getVitals,
    getVital,
    createVital,
    deleteVital,
    getVitalTrends,
    getMedications,
    getMedication,
    createMedication,
    updateMedication,
    deleteMedication,
    getMedicationReminders,
    takeMedicationAction,
    getAllergies,
    getAllergy,
    createAllergy,
    updateAllergy,
    deleteAllergy,
    getHealthFamilyMembers,
    createHealthFamilyMember,
    updateHealthFamilyMember,
    deleteHealthFamilyMember,
} from '../api/health-records-api';
import type {
    CreateVitalInput,
    CreateMedicationInput,
    CreateAllergyInput,
    CreateHealthDocumentInput,
    CreateFamilyMemberInput,
} from '@/types';

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const healthKeys = {
    all: ['health-records'] as const,
    summary: () => [...healthKeys.all, 'summary'] as const,
    familySummary: (memberId: string) => [...healthKeys.all, 'family-summary', memberId] as const,
    documents: () => [...healthKeys.all, 'documents'] as const,
    documentList: (filters: Record<string, unknown>) => [...healthKeys.documents(), 'list', filters] as const,
    documentDetail: (id: string) => [...healthKeys.documents(), 'detail', id] as const,
    vitals: () => [...healthKeys.all, 'vitals'] as const,
    vitalList: (filters: Record<string, unknown>) => [...healthKeys.vitals(), 'list', filters] as const,
    vitalDetail: (id: string) => [...healthKeys.vitals(), 'detail', id] as const,
    vitalTrends: (params: Record<string, unknown>) => [...healthKeys.vitals(), 'trends', params] as const,
    medications: () => [...healthKeys.all, 'medications'] as const,
    medicationList: (filters: Record<string, unknown>) => [...healthKeys.medications(), 'list', filters] as const,
    medicationDetail: (id: string) => [...healthKeys.medications(), 'detail', id] as const,
    reminders: () => [...healthKeys.medications(), 'reminders'] as const,
    allergies: () => [...healthKeys.all, 'allergies'] as const,
    allergyList: (filters: Record<string, unknown>) => [...healthKeys.allergies(), 'list', filters] as const,
    allergyDetail: (id: string) => [...healthKeys.allergies(), 'detail', id] as const,
    family: () => [...healthKeys.all, 'family'] as const,
};

// ─── Summary ──────────────────────────────────────────────────────────────────

export function useHealthSummary() {
    return useQuery({
        queryKey: healthKeys.summary(),
        queryFn: getHealthSummary,
        staleTime: 5 * 60 * 1000,
    });
}

export function useFamilyMemberSummary(memberId: string) {
    return useQuery({
        queryKey: healthKeys.familySummary(memberId),
        queryFn: () => getFamilyMemberSummary(memberId),
        enabled: !!memberId,
        staleTime: 5 * 60 * 1000,
    });
}

// ─── Documents ────────────────────────────────────────────────────────────────

export function useDocuments(filters: Record<string, string | number | boolean | string[] | null | undefined> = {}) {
    return useQuery({
        queryKey: healthKeys.documentList(filters),
        queryFn: () => getDocuments(filters),
        staleTime: 2 * 60 * 1000,
    });
}

export function useDocument(id: string) {
    return useQuery({
        queryKey: healthKeys.documentDetail(id),
        queryFn: () => getDocument(id),
        enabled: !!id,
    });
}

export function useUploadDocument() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (formData: FormData) => uploadDocument(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: healthKeys.documents() });
            queryClient.invalidateQueries({ queryKey: healthKeys.summary() });
        },
    });
}

export function useUpdateDocument() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: Partial<CreateHealthDocumentInput> }) =>
            updateDocument(id, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: healthKeys.documents() });
        },
    });
}

export function useDeleteDocument() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteDocument(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: healthKeys.documents() });
            queryClient.invalidateQueries({ queryKey: healthKeys.summary() });
        },
    });
}

// ─── Vitals ───────────────────────────────────────────────────────────────────

export function useVitals(filters: Record<string, string | number | boolean | string[] | null | undefined> = {}) {
    return useQuery({
        queryKey: healthKeys.vitalList(filters),
        queryFn: () => getVitals(filters),
        staleTime: 2 * 60 * 1000,
    });
}

export function useVital(id: string) {
    return useQuery({
        queryKey: healthKeys.vitalDetail(id),
        queryFn: () => getVital(id),
        enabled: !!id,
    });
}

export function useCreateVital() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: CreateVitalInput) => createVital(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: healthKeys.vitals() });
            queryClient.invalidateQueries({ queryKey: healthKeys.summary() });
        },
    });
}

export function useDeleteVital() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteVital(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: healthKeys.vitals() });
        },
    });
}

export function useVitalTrends(params: { period?: string; familyMemberId?: string } = {}) {
    return useQuery({
        queryKey: healthKeys.vitalTrends(params),
        queryFn: () => getVitalTrends(params),
        staleTime: 5 * 60 * 1000,
    });
}

// ─── Medications ──────────────────────────────────────────────────────────────

export function useMedications(filters: Record<string, string | number | boolean | string[] | null | undefined> = {}) {
    return useQuery({
        queryKey: healthKeys.medicationList(filters),
        queryFn: () => getMedications(filters),
        staleTime: 2 * 60 * 1000,
    });
}

export function useMedication(id: string) {
    return useQuery({
        queryKey: healthKeys.medicationDetail(id),
        queryFn: () => getMedication(id),
        enabled: !!id,
    });
}

export function useCreateMedication() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: CreateMedicationInput) => createMedication(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: healthKeys.medications() });
            queryClient.invalidateQueries({ queryKey: healthKeys.summary() });
        },
    });
}

export function useUpdateMedication() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: Partial<CreateMedicationInput> }) =>
            updateMedication(id, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: healthKeys.medications() });
        },
    });
}

export function useDeleteMedication() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteMedication(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: healthKeys.medications() });
            queryClient.invalidateQueries({ queryKey: healthKeys.summary() });
        },
    });
}

export function useMedicationReminders() {
    return useQuery({
        queryKey: healthKeys.reminders(),
        queryFn: getMedicationReminders,
        staleTime: 1 * 60 * 1000,
    });
}

export function useTakeMedicationAction() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, action }: { id: string; action: string }) =>
            takeMedicationAction(id, action),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: healthKeys.medications() });
            queryClient.invalidateQueries({ queryKey: healthKeys.reminders() });
        },
    });
}

// ─── Allergies ────────────────────────────────────────────────────────────────

export function useAllergies(filters: Record<string, string | number | boolean | string[] | null | undefined> = {}) {
    return useQuery({
        queryKey: healthKeys.allergyList(filters),
        queryFn: () => getAllergies(filters),
        staleTime: 5 * 60 * 1000,
    });
}

export function useAllergy(id: string) {
    return useQuery({
        queryKey: healthKeys.allergyDetail(id),
        queryFn: () => getAllergy(id),
        enabled: !!id,
    });
}

export function useCreateAllergy() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: CreateAllergyInput) => createAllergy(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: healthKeys.allergies() });
            queryClient.invalidateQueries({ queryKey: healthKeys.summary() });
        },
    });
}

export function useUpdateAllergy() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: Partial<CreateAllergyInput> }) =>
            updateAllergy(id, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: healthKeys.allergies() });
        },
    });
}

export function useDeleteAllergy() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteAllergy(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: healthKeys.allergies() });
            queryClient.invalidateQueries({ queryKey: healthKeys.summary() });
        },
    });
}

// ─── Family Members ───────────────────────────────────────────────────────────

export function useHealthFamilyMembers() {
    return useQuery({
        queryKey: healthKeys.family(),
        queryFn: getHealthFamilyMembers,
        staleTime: 10 * 60 * 1000,
    });
}

export function useCreateHealthFamilyMember() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: CreateFamilyMemberInput) => createHealthFamilyMember(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: healthKeys.family() });
            queryClient.invalidateQueries({ queryKey: healthKeys.summary() });
        },
    });
}

export function useUpdateHealthFamilyMember() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: Partial<CreateFamilyMemberInput> }) =>
            updateHealthFamilyMember(id, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: healthKeys.family() });
        },
    });
}

export function useDeleteHealthFamilyMember() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteHealthFamilyMember(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: healthKeys.family() });
            queryClient.invalidateQueries({ queryKey: healthKeys.summary() });
        },
    });
}
