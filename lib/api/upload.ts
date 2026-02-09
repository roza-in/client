import { api } from './client';

export interface UploadResponse {
    url: string;
    path: string;
}

/**
 * Upload a file to a specific bucket
 * @param bucket - The storage bucket (e.g., 'doctors', 'hospitals')
 * @param id - The identifier (folder name). For new entities, use 'temp' or a generated UUID.
 * @param file - The file object to upload
 */
export async function uploadFile(
    bucket: string,
    id: string,
    file: File
): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return api.upload<UploadResponse>(`/uploads/${bucket}/${id}`, formData);
}

/**
 * Helper to upload a doctor avatar specifically
 * Uses a temp folder if no ID is available yet
 */
export async function uploadDoctorAvatar(file: File, doctorId: string = 'temp'): Promise<UploadResponse> {
    return uploadFile('doctors', doctorId, file);
}
