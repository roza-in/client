/**
 * Consultations Feature Exports
 */

// Consultation Lifecycle API
export { consultationsApi } from './api/consultations';

// Video Room API
export {
    joinVideoRoom,
    leaveVideoRoom,
    getVideoRoomStatus,
    startRecording,
    stopRecording,
    reportIssue,
} from './api/video';
export type { VideoRoom, VideoRoomStatus } from './api/video';

// Hooks
export { useConsultationRoom } from './hooks/use-consultation-room';
export {
    useConsultation,
    useConsultationStatus,
    consultationKeys,
} from './hooks/use-consultation';
export type { UseConsultationReturn, ConsultationStatus } from './hooks/use-consultation';
export { useAgoraCall } from './hooks/use-agora-call';
export { useZegoCall } from './hooks/use-zego-call';
