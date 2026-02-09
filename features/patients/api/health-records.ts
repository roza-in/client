/**
 * Patients Feature - Health Records API
 */

import { api, endpoints } from '@/lib/api';
import type { HealthDocument } from '@/types';

// =============================================================================
// Types
// =============================================================================

export interface HealthRecordFilters {
    type?: 'report' | 'prescription' | 'scan' | 'other';
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    [key: string]: string | number | boolean | string[] | null | undefined;
}

export interface UploadHealthRecordInput {
    file: File;
    type: 'report' | 'prescription' | 'scan' | 'other';
    title: string;
    description?: string;
    recordDate?: string;
}

// =============================================================================
// API Functions
// =============================================================================

/**
 * Get health records list
 */
export async function getHealthRecords(filters?: HealthRecordFilters): Promise<{
    records: HealthDocument[];
    total: number;
}> {
    const { data, meta } = await api.getWithMeta<HealthDocument[]>(endpoints.healthRecords.list, {
        params: filters,
    });
    return { records: data, total: meta?.total || 0 };
}

/**
 * Get a health record by ID
 */
export async function getHealthRecord(id: string): Promise<HealthDocument> {
    return api.get<HealthDocument>(endpoints.healthRecords.get(id));
}

/**
 * Upload a health record
 */
export async function uploadHealthRecord(input: UploadHealthRecordInput): Promise<HealthDocument> {
    const formData = new FormData();
    formData.append('file', input.file);
    formData.append('type', input.type);
    formData.append('title', input.title);
    if (input.description) formData.append('description', input.description);
    if (input.recordDate) formData.append('recordDate', input.recordDate);

    return api.upload<HealthDocument>(endpoints.healthRecords.upload, formData);
}

/**
 * Delete a health record
 */
export async function deleteHealthRecord(id: string): Promise<void> {
    await api.delete(endpoints.healthRecords.delete(id));
}

/**
 * Download a health record
 */
export async function downloadHealthRecord(id: string): Promise<Blob> {
    const response = await fetch(`/api${endpoints.healthRecords.download(id)}`, {
        credentials: 'include',
    });
    return response.blob();
}
