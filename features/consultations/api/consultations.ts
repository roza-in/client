import { api, endpoints } from '@/lib/api';
import type { Consultation } from '@/types';

export const consultationsApi = {
    startConsultation: (appointmentId: string) =>
        api.post<Consultation>(endpoints.consultations.start, { appointmentId }),

    endConsultation: (consultationId: string, notes?: string) =>
        api.post<Consultation>(endpoints.consultations.end(consultationId), { notes }),

    getConsultation: (consultationId: string) =>
        api.get<Consultation>(endpoints.consultations.get(consultationId)),

    listConsultations: (params?: any) =>
        api.get<Consultation[]>(endpoints.consultations.list, { params }),

    getVideoToken: (consultationId: string) =>
        api.get<{ token: string; appId: string; roomId: string; provider: 'zegocloud' | 'agora' }>(endpoints.consultations.videoToken(consultationId)),

    updateNotes: (consultationId: string, notes: string) =>
        api.patch<void>(endpoints.consultations.notes(consultationId), { notes }),

    updateVitals: (consultationId: string, vitals: any) =>
        api.patch<void>(endpoints.consultations.vitals(consultationId), { vitals }),

    getStatus: (consultationId: string) =>
        api.get<{ status: string }>(endpoints.consultations.status(consultationId)),

    joinConsultation: (consultationId: string) =>
        api.post<void>(endpoints.consultations.join(consultationId)),
};
