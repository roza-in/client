/**
 * Video Feature - API
 */

import { api } from '@/lib/api';

// =============================================================================
// Types
// =============================================================================

export interface VideoRoom {
    roomId: string;
    token: string;
    appointmentId: string;
    doctorId: string;
    patientId: string;
    expiresAt: string;
}

export interface VideoRoomStatus {
    isActive: boolean;
    startedAt?: string;
    participants: {
        doctorJoined: boolean;
        patientJoined: boolean;
    };
}

// =============================================================================
// API Functions
// =============================================================================

/**
 * Join a video consultation room
 */
export async function joinVideoRoom(appointmentId: string): Promise<VideoRoom> {
    return api.post<VideoRoom>(`/consultations/${appointmentId}/join`);
}

/**
 * Leave a video consultation room
 */
export async function leaveVideoRoom(appointmentId: string): Promise<void> {
    await api.post(`/consultations/${appointmentId}/leave`);
}

/**
 * Get video room status
 */
export async function getVideoRoomStatus(appointmentId: string): Promise<VideoRoomStatus> {
    return api.get<VideoRoomStatus>(`/consultations/${appointmentId}/status`);
}

/**
 * Start recording (doctor only)
 */
export async function startRecording(appointmentId: string): Promise<{ recordingId: string }> {
    return api.post<{ recordingId: string }>(`/consultations/${appointmentId}/record/start`);
}

/**
 * Stop recording
 */
export async function stopRecording(appointmentId: string): Promise<void> {
    await api.post(`/consultations/${appointmentId}/record/stop`);
}

/**
 * Report technical issue during consultation
 */
export async function reportIssue(
    appointmentId: string,
    issue: { type: 'audio' | 'video' | 'connection' | 'other'; description?: string }
): Promise<void> {
    await api.post(`/consultations/${appointmentId}/report-issue`, issue);
}
